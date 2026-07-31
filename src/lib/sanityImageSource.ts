import type { SanityImageSource } from "@sanity/image-url/lib/types/types"

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== ""
}

/**
 * Tells whether `@sanity/image-url` will be able to build a URL from `source`.
 *
 * Studio can persist an image slot that was never given a file — an array
 * member with only `_key` and `_type: "image"`, typically left behind by an
 * interrupted upload. Such an entry is *truthy*, so a plain `if (!image)` check
 * lets it through, and `builder.image()` then throws "Unable to resolve image
 * URL from source". During a server render that exception escapes the page and
 * Next answers 500.
 *
 * The check is deliberately permissive: it only rejects sources that are
 * certainly unusable, so the less common shapes the builder accepts (bare asset
 * ref strings, asset documents, plain references) keep working.
 */
export function hasResolvableSanityImageAsset(
  source: SanityImageSource | null | undefined,
): boolean {
  if (!source) return false

  // Bare asset ref or image URL.
  if (isNonEmptyString(source)) return true
  if (typeof source !== "object") return false

  const candidate = source as Record<string, unknown>

  // Asset document (`_id`) or plain reference (`_ref`) passed directly.
  if (isNonEmptyString(candidate._id) || isNonEmptyString(candidate._ref)) {
    return true
  }

  const asset = candidate.asset
  if (!asset) return false
  if (isNonEmptyString(asset)) return true
  if (typeof asset !== "object") return false

  const assetFields = asset as Record<string, unknown>

  return (
    isNonEmptyString(assetFields._ref) ||
    isNonEmptyString(assetFields._id) ||
    isNonEmptyString(assetFields.url)
  )
}
