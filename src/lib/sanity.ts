import imageUrlBuilder from "@sanity/image-url"
import type { SanityImageSource } from "@sanity/image-url/lib/types/types"

import { client } from "@/sanity/lib/client"

const builder = imageUrlBuilder(client)

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
  if (!image) return undefined

  const safeQuality = Math.min(100, Math.max(1, Math.round(quality)))

  const img = builder
    .image(image) // image asset
    .width(width) // max width
    .auto("format") // serves WebP or AVIF automatically
    .quality(safeQuality) // quality compression

  if (height != null && height > 0) {
    return img.height(height).fit("crop").url()
  }

  return img.url()
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
  if (!image) return undefined

  const safeQuality = Math.min(100, Math.max(1, Math.round(quality)))

  return builder
    .image(image)
    .width(OG_IMAGE.width)
    .height(OG_IMAGE.height)
    .fit("crop")
    .format("jpg")
    .quality(safeQuality)
    .url()
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
