import type { PreviewValue } from "@sanity/types"
import { defineField } from "sanity"

export const listingLabelField = defineField({
  name: "listingLabel",
  title: "Etichetta",
  type: "string",
  description: "Opzionale. Se compilata, è il titolo principale in elenco.",
})

type LocationPreviewSelect = {
  streetName?: string | null
  streetNumber?: string | null
  city?: string | null
  province?: string | null
  country?: string | null
}

function formatListingLocationSubtitle(
  parts: LocationPreviewSelect,
): string | undefined {
  const street = [parts.streetName, parts.streetNumber]
    .filter((s): s is string => typeof s === "string" && s.trim() !== "")
    .map((s) => s.trim())
    .join(" ")

  const cityPart =
    typeof parts.city === "string" && parts.city.trim() !== ""
      ? parts.city.trim()
      : ""

  let locality = cityPart
  if (typeof parts.province === "string" && parts.province.trim() !== "") {
    locality = locality
      ? `${locality} (${parts.province.trim()})`
      : `(${parts.province.trim()})`
  }

  const country =
    typeof parts.country === "string" && parts.country.trim() !== ""
      ? parts.country.trim()
      : ""

  const segments = [street, locality, country].filter((s) => s !== "")
  if (segments.length === 0) {
    return undefined
  }

  return segments.join(" · ")
}

function isPreviewImageMedia(value: unknown): boolean {
  if (value === null || value === undefined || typeof value !== "object") {
    return false
  }

  const ref = (value as { asset?: { _ref?: string } }).asset?._ref
  return typeof ref === "string" && ref.length > 0
}

export function listingPreview() {
  return {
    select: {
      listingLabel: "listingLabel",
      media: "mainImage",
      streetName: "address.streetName",
      streetNumber: "address.streetNumber",
      city: "city",
      province: "province",
      country: "country",
    },
    prepare({
      listingLabel,
      media,
      streetName,
      streetNumber,
      city,
      province,
      country,
    }: {
      listingLabel?: string
      media?: unknown
      streetName?: string | null
      streetNumber?: string | null
      city?: string | null
      province?: string | null
      country?: string | null
    }) {
      const locationText = formatListingLocationSubtitle({
        streetName,
        streetNumber,
        city,
        province,
        country,
      })

      const label =
        typeof listingLabel === "string" && listingLabel.trim()
          ? listingLabel.trim()
          : undefined

      if (label) {
        return {
          title: label,
          subtitle: locationText,
          ...(isPreviewImageMedia(media) ? { media } : {}),
        } as PreviewValue
      }

      return {
        title: locationText ?? "—",
        subtitle: undefined,
        ...(isPreviewImageMedia(media) ? { media } : {}),
      } as PreviewValue
    },
  }
}
