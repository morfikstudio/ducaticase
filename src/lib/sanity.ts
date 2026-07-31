import imageUrlBuilder from "@sanity/image-url"
import type { SanityImageSource } from "@sanity/image-url/lib/types/types"

import { client } from "@/sanity/lib/client"
import { hasResolvableSanityImageAsset } from "@/lib/sanityImageSource"

const builder = imageUrlBuilder(client)

type SanityImageUrlBuilder = ReturnType<typeof builder.image>

/**
 * Single entry point for every URL built here, so no caller can crash a render
 * on a malformed image.
 *
 * `builder.image()` throws on sources it cannot resolve — an image slot saved
 * in Studio without a file, a blank `asset._ref`, a null `asset`. Those are
 * truthy, so a plain `if (!image)` check misses them, and the exception escapes
 * the server render as a 500 instead of a missing picture.
 *
 * The guard covers the shapes we actually see in the CMS; the `try/catch` is
 * the backstop for anything else the builder rejects. Returning `undefined` is
 * what every caller already expects for an unusable image.
 */
function buildImageUrl(
  image: SanityImageSource | null | undefined,
  configure: (source: SanityImageUrlBuilder) => SanityImageUrlBuilder,
): string | undefined {
  if (!hasResolvableSanityImageAsset(image)) return undefined

  try {
    return configure(builder.image(image as SanityImageSource)).url()
  } catch {
    return undefined
  }
}

/**
 * Builds a Sanity image URL with width and optional height.
 * When height is omitted or 0, only width is set so the image keeps its aspect ratio.
 *
 * Note: no `dpr()` is applied. For images rendered through next/image the
 * responsive `srcset` (see src/lib/sanityImageLoader.ts) already covers
 * high-DPI displays; for direct-`<img>` consumers `width` is chosen large
 * enough that CSS downscaling keeps them crisp. Baking dpr(2) here previously
 * caused requests beyond the source resolution (upscaling → soft images).
 *
 * @param image - Sanity image object (e.g. property.contents?.mainImage)
 * @param width - Width in pixels
 * @param height - Height in pixels; if 0 or undefined, only width is used (fluid height)
 * @param quality - Compression quality from 1 to 100 (default 80)
 * @returns Image URL or undefined if image is invalid
 */
export function getSanityImageUrl(
  image: SanityImageSource | null | undefined,
  width: number,
  height?: number,
  quality = 80,
): string | undefined {
  const safeQuality = Math.min(100, Math.max(1, Math.round(quality)))

  return buildImageUrl(image, (img) => {
    const sized = img
      .width(width) // max width
      .auto("format") // serves WebP or AVIF automatically
      .quality(safeQuality) // quality compression

    return height != null && height > 0
      ? sized.height(height).fit("crop")
      : sized
  })
}

const OG_IMAGE = { width: 1200, height: 630 } as const

/**
 * Image URL for Open Graph / Twitter Card, cropped 1200x630 on the hotspot.
 *
 * Format forced to JPEG: WhatsApp and various social scrapers do not render the
 * WebP/AVIF previews that `auto("format")` would return.
 */
export function getSanityOgImageUrl(
  image: SanityImageSource | null | undefined,
  quality = 75,
): string | undefined {
  const safeQuality = Math.min(100, Math.max(1, Math.round(quality)))

  return buildImageUrl(image, (img) =>
    img
      .width(OG_IMAGE.width)
      .height(OG_IMAGE.height)
      .fit("crop")
      .format("jpg")
      .quality(safeQuality),
  )
}

const HERO_DESKTOP_16_9 = { width: 1920, height: 1080 } as const
const HERO_MOBILE_9_16 = { width: 1080, height: 1920 } as const

/**
 * URL immagine hero con ritaglio 16:9 (desktop) o 9:16 (mobile), usando hotspot Sanity.
 */
export function getAboutHeroBackgroundUrl(
  image: SanityImageSource | null | undefined,
  variant: "desktop16_9" | "mobile9_16",
  quality = 82,
): string | undefined {
  if (!image) return undefined
  const { width, height } =
    variant === "desktop16_9" ? HERO_DESKTOP_16_9 : HERO_MOBILE_9_16
  return getSanityImageUrl(image, width, height, quality)
}
