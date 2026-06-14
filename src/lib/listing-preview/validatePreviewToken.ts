export function isValidListingPreviewToken(
  token: string | undefined,
): boolean {
  const secret = process.env.SANITY_LISTING_PREVIEW_SECRET
  return Boolean(secret && token && token === secret)
}
