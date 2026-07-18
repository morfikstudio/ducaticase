import type { ImageLoaderProps } from "next/image"

/**
 * Custom next/image loader that delegates all resizing/encoding to the Sanity
 * CDN, so images are transformed exactly once (no second re-encode by the
 * Next.js image optimizer). Next still builds the responsive `srcset`; each
 * candidate width is served directly by Sanity at the requested quality.
 *
 * The `src` passed in is a full Sanity CDN URL already built by
 * `getSanityImageUrl` (with `w`, optional `h`+`fit=crop`, `auto=format`, `q`).
 * This loader only rewrites `w`/`h`/`q` per srcset entry; it preserves any
 * existing crop (`rect`/`fit`/hotspot).
 *
 * Non-Sanity URLs (e.g. placehold.co fallbacks, data URLs) are returned as-is.
 */
const SANITY_CDN_HOST = "cdn.sanity.io"

/**
 * Never request a delivered width larger than the Studio upload cap
 * (`MAX_IMAGE_DIMENSION` in imageCompression.ts). Beyond it Sanity would only
 * upscale the source — wasted bytes and softer output, no extra detail.
 */
const MAX_DELIVERED_WIDTH = 2560
const DEFAULT_QUALITY = 80

export default function sanityImageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps): string {
  let url: URL

  try {
    url = new URL(src)
  } catch {
    // Relative or data URLs: nothing to transform.
    return src
  }

  if (url.hostname !== SANITY_CDN_HOST) {
    return src
  }

  const targetWidth = Math.min(width, MAX_DELIVERED_WIDTH)
  const params = url.searchParams

  // Preserve the crop aspect ratio encoded by getSanityImageUrl (w + h +
  // fit=crop): scale height proportionally so every srcset width keeps the
  // same crop.
  const currentW = Number(params.get("w"))
  const currentH = Number(params.get("h"))

  if (currentW > 0 && currentH > 0) {
    const ratio = currentH / currentW
    params.set("h", String(Math.round(targetWidth * ratio)))
  }

  params.set("w", String(targetWidth))
  params.set("q", String(quality ?? DEFAULT_QUALITY))
  params.set("auto", "format")
  // dpr is handled by the browser via srcset now; drop any baked value.
  params.delete("dpr")

  url.search = params.toString()
  return url.toString()
}
