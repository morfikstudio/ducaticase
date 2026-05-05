export type ListingLocationLike = {
  address?: { streetName?: string | null; streetNumber?: string | null } | null
  city?: string | null
  province?: string | null
  country?: string | null
} | null

export function getListingStreetLine(
  location: ListingLocationLike,
): string | null {
  const address = location?.address
  const street = [address?.streetName, address?.streetNumber]
    .map((p) => (typeof p === "string" ? p.trim() : ""))
    .filter(Boolean)
    .join(" ")

  return street || null
}

export function getListingCityLine(
  location: ListingLocationLike,
  countryLabel?: string | null,
): string | null {
  const city = location?.city?.trim()
  const province = location?.province?.trim()
  const cityWithProvince =
    city && province
      ? `${city} (${province})`
      : city || (province ? `(${province})` : "")

  const label =
    typeof countryLabel === "string" ? countryLabel.trim() : ""

  if (!cityWithProvince) {
    return label || null
  }

  if (!label) {
    return cityWithProvince
  }

  return `${cityWithProvince}, ${label}`
}

export function buildListingLocationText(
  location: ListingLocationLike,
  countryLabel?: string | null,
): string | null {
  return (
    [getListingStreetLine(location), getListingCityLine(location, countryLabel)]
      .filter(Boolean)
      .join(" · ") || null
  )
}
