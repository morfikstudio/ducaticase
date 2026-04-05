import type { AppLocale } from "@/i18n/routing"

import {
  COUNTRY_HOUSE_TYPOLOGY_OPTIONS,
  INDUSTRIAL_TYPOLOGY_OPTIONS,
  SHOPS_AND_OFFICES_TYPOLOGY_OPTIONS,
  type ListingTypeName,
  type LocalizedTypologyOption,
} from "./constants"

function optionTitle(
  options: ReadonlyArray<LocalizedTypologyOption>,
  value: string | null | undefined,
  locale: AppLocale,
): string | undefined {
  if (value == null) return undefined
  return options.find((o) => o.value === value)?.title[locale]
}

export function listingTypologyLabel(
  listingType: ListingTypeName,
  typology: string | null | undefined,
  locale: AppLocale,
): string | undefined {
  switch (listingType) {
    case "listingCountryHouses":
      return optionTitle(COUNTRY_HOUSE_TYPOLOGY_OPTIONS, typology, locale)
    case "listingShopsAndOffices":
      return optionTitle(SHOPS_AND_OFFICES_TYPOLOGY_OPTIONS, typology, locale)
    case "listingIndustrial":
      return optionTitle(INDUSTRIAL_TYPOLOGY_OPTIONS, typology, locale)
    default:
      return undefined
  }
}
