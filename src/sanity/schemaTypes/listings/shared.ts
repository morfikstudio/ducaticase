import type { PreviewValue } from "@sanity/types"
import { defineField } from "sanity"

import {
  CATEGORY_OPTIONS,
  LISTING_CONTRACT_TYPE_OPTIONS,
  type LocalizedTypologyOption,
} from "../../lib/constants"

export const listingLabelField = defineField({
  name: "listingLabel",
  title: "Etichetta",
  type: "localizedString",
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

export type ListingPreviewOptions = {
  /** Se presente, la tipologia ha priorità sul titolo macro categoria nel sottotitolo. */
  typologyField?: string
  typologyOptions?: ReadonlyArray<LocalizedTypologyOption>
}

function listingTypologyTitle(
  value: unknown,
  typologyOptions: ReadonlyArray<LocalizedTypologyOption>,
): string | undefined {
  if (typeof value !== "string" || value.trim() === "") {
    return undefined
  }

  return typologyOptions.find((o) => o.value === value)?.title.it
}

function listingCategoryTitle(_type: unknown): string | undefined {
  if (typeof _type !== "string" || _type === "") {
    return undefined
  }

  const row = CATEGORY_OPTIONS.find((o) => o.documentType === _type)
  return row?.title.it
}

function listingContractTypeLabel(value: unknown): string | undefined {
  if (typeof value !== "string" || value.trim() === "") {
    return undefined
  }

  return LISTING_CONTRACT_TYPE_OPTIONS.find((o) => o.value === value)?.title.it
}

export function listingPreview(options?: ListingPreviewOptions) {
  const typologyField = options?.typologyField
  const typologyOptions = options?.typologyOptions ?? []

  return {
    select: {
      listingLabelIt: "listingLabel.it",
      listingLabelEn: "listingLabel.en",
      media: "mainImage",
      _type: "_type",
      listingContractType: "listingContractType",
      ...(typologyField ? { typologyValue: typologyField } : {}),
      streetName: "address.streetName",
      streetNumber: "address.streetNumber",
      city: "city",
      province: "province",
      country: "country",
    },
    prepare({
      listingLabelIt,
      listingLabelEn,
      media,
      _type,
      listingContractType,
      typologyValue,
      streetName,
      streetNumber,
      city,
      province,
      country,
    }: {
      listingLabelIt?: string | null
      listingLabelEn?: string | null
      media?: unknown
      _type?: string | null
      listingContractType?: string | null
      typologyValue?: string | null
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

      const typologyTitle = typologyField
        ? listingTypologyTitle(typologyValue, typologyOptions)
        : undefined
      const categoryTitle = listingCategoryTitle(_type)
      const contractLabel = listingContractTypeLabel(listingContractType)

      const labelIt =
        typeof listingLabelIt === "string" ? listingLabelIt.trim() : ""
      const labelEn =
        typeof listingLabelEn === "string" ? listingLabelEn.trim() : ""
      const label = labelIt || labelEn || undefined

      const mediaMaybe = isPreviewImageMedia(media) ? { media } : {}

      if (label) {
        const subtitle = [contractLabel, typologyTitle]
          .filter((s): s is string => typeof s === "string" && s !== "")
          .join(" · ")

        return {
          title: label,
          ...(subtitle ? { subtitle } : {}),
          ...mediaMaybe,
        } as PreviewValue
      }

      const baseTitle = locationText ?? typologyTitle ?? categoryTitle ?? "—"
      const title = baseTitle
      const subtitle = [
        contractLabel,
        typologyTitle,
      ]
        .filter((s): s is string => typeof s === "string" && s !== "")
        .join(" · ")

      return {
        title,
        ...(subtitle !== "" ? { subtitle } : {}),
        ...mediaMaybe,
      } as PreviewValue
    },
  }
}
