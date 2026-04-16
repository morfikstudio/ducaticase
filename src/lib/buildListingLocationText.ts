export type ListingLocationLike = {
  address?: { streetName?: string | null; streetNumber?: string | null } | null
  city?: string | null
  province?: string | null
} | null

export function getListingStreetLine(location: ListingLocationLike): string | null {
  const address = location?.address
  const street = [address?.streetName, address?.streetNumber]
    .map((p) => (typeof p === "string" ? p.trim() : ""))
    .filter(Boolean)
    .join(" ")

  return street || null
}

export function getListingCityLine(location: ListingLocationLike): string | null {
  const city = location?.city?.trim()
  const province = location?.province?.trim()
  const cityWithProvince =
    city && province
      ? `${city} (${province})`
      : city || (province ? `(${province})` : "")

  return cityWithProvince || null
}

export function buildListingLocationText(location: ListingLocationLike): string | null {
  return [getListingStreetLine(location), getListingCityLine(location)]
    .filter(Boolean)
    .join(" · ") || null
}
