type ListingLocationLike = {
  address?: { streetName?: string | null; streetNumber?: string | null } | null
  city?: string | null
  province?: string | null
} | null

export function buildListingLocationText(location: ListingLocationLike): string | null {
  const address = location?.address
  const street = [address?.streetName, address?.streetNumber]
    .map((p) => (typeof p === "string" ? p.trim() : ""))
    .filter(Boolean)
    .join(" ")

  const city = location?.city?.trim()
  const province = location?.province?.trim()
  const cityWithProvince =
    city && province
      ? `${city} (${province})`
      : city || (province ? `(${province})` : "")

  return [street, cityWithProvince].filter(Boolean).join(" · ") || null
}
