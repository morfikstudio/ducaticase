import {
  getListingCityLine,
  getListingStreetLine,
  type ListingLocationLike,
} from "@/lib/buildListingLocationText"
import { buildCompanyMailtoHref } from "@/lib/buildCompanyMailtoHref"

export function buildListingVisitMailtoHref(
  location: ListingLocationLike,
  formatSubject: (values: { location: string }) => string,
): string {
  const street = getListingStreetLine(location)
  const city = getListingCityLine(location) ?? "—"
  const locationLabel = street ? `${street}, ${city}` : city
  const subject = formatSubject({ location: locationLabel })

  return buildCompanyMailtoHref(subject)
}
