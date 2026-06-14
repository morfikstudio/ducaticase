import imageCompression from "browser-image-compression"

/**
 * Client-side image compression, run in the Studio before upload.
 *
 * Goal: clients may upload very large files; they are automatically normalized
 * to a reasonable size/resolution before reaching Sanity. Agreed settings: longest
 * side max 2560px, target weight ~1MB, original format preserved (Sanity
 * transcodes to WebP/AVIF at delivery time).
 */
export const MAX_IMAGE_DIMENSION = 2560
export const TARGET_IMAGE_SIZE_MB = 1

const TARGET_IMAGE_SIZE_BYTES = TARGET_IMAGE_SIZE_MB * 1024 * 1024

/** Image formats that must NOT be re-encoded (vector / animated). */
const PASSTHROUGH_IMAGE_TYPES = new Set(["image/svg+xml", "image/gif"])

/** True only for compressible raster images (excludes SVG/GIF, PDF, and non-images). */
export function isCompressibleImage(file: File): boolean {
  return (
    file.type.startsWith("image/") && !PASSTHROUGH_IMAGE_TYPES.has(file.type)
  )
}

async function getLongestEdge(file: File): Promise<number | null> {
  try {
    const bitmap = await createImageBitmap(file)
    const longest = Math.max(bitmap.width, bitmap.height)
    bitmap.close()
    return longest
  } catch {
    return null
  }
}

/**
 * Returns a compressed version of the file when needed, otherwise the original.
 * Never throws: on error it falls back to the original so upload is never blocked.
 *
 * - Non-compressible files (PDF, SVG, GIF, non-images) → returned unchanged.
 * - Images already under threshold (size and dimensions) → returned unchanged
 *   (avoids unnecessary lossy re-encoding).
 * - If compression produces a file larger than the original → original is used.
 */
export async function maybeCompressImage(file: File): Promise<File> {
  if (!isCompressibleImage(file)) {
    return file
  }

  const longestEdge = await getLongestEdge(file)
  const withinSize = file.size <= TARGET_IMAGE_SIZE_BYTES
  const withinDimension =
    longestEdge !== null && longestEdge <= MAX_IMAGE_DIMENSION

  if (withinSize && withinDimension) {
    return file
  }

  try {
    const compressed = await imageCompression(file, {
      maxSizeMB: TARGET_IMAGE_SIZE_MB,
      maxWidthOrHeight: MAX_IMAGE_DIMENSION,
      useWebWorker: true,
    })

    if (compressed.size >= file.size) {
      return file
    }

    // Preserve original name and type (the library may alter them).
    return new File([compressed], file.name, {
      type: compressed.type || file.type,
      lastModified: Date.now(),
    })
  } catch (error) {
    console.error("Image compression failed, using original file:", error)
    return file
  }
}
