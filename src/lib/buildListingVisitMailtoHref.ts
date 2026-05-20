import { COMPANY_EMAIL } from "@/sanity/lib/constants"

import {
  getListingCityLine,
  getListingStreetLine,
  type ListingLocationLike,
} from "@/lib/buildListingLocationText"

export function buildListingVisitMailtoHref(
  location: ListingLocationLike,
  formatSubject: (values: { location: string }) => string,
): string {
  const street = getListingStreetLine(location)
  const city = getListingCityLine(location) ?? "—"
  const locationLabel = street ? `${street}, ${city}` : city
  const subject = formatSubject({ location: locationLabel })

  return `mailto:${COMPANY_EMAIL}?subject=${encodeURIComponent(subject)}`
}
