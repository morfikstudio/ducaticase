import imageUrlBuilder from "@sanity/image-url"
import type { SanityImageSource } from "@sanity/image-url/lib/types/types"

import { client } from "@/sanity/lib/client"

const builder = imageUrlBuilder(client)

/**
 * Image URL helper tuned for PDF print output.
 *
 * Differs from {@link import("@/lib/sanity").getSanityImageUrl}:
 *  - no dpr(2): screen-Retina pixels are wasted in print, they only bloat the PDF
 *  - lower default quality (75): A4 print at ~200 DPI doesn't benefit from q>80
 *
 * Target sizes: pass roughly the final pixel count needed at 200 DPI for the
 * physical size on A4 (1mm ≈ 8px at 200 DPI).
 */
export function getPrintImageUrl(
  image: SanityImageSource | null | undefined,
  width: number,
  height?: number,
  quality = 75,
): string | undefined {
  if (!image) return undefined

  const safeQuality = Math.min(100, Math.max(1, Math.round(quality)))

  const img = builder
    .image(image)
    .width(width)
    .auto("format")
    .quality(safeQuality)

  if (height != null && height > 0) {
    return img.height(height).fit("crop").url()
  }

  return img.url()
}
