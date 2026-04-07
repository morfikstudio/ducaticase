import type { AppLocale } from "@/i18n/routing"

import { LISTING_CONTRACT_TYPE_OPTIONS } from "./constants"

export function listingContractTypeLabel(
  value: string | null | undefined,
  locale: AppLocale,
): string | undefined {
  if (value == null || value === "") {
    return undefined
  }

  return LISTING_CONTRACT_TYPE_OPTIONS.find((option) => option.value === value)
    ?.title[locale]
}
