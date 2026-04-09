import type { AppLocale } from "@/i18n/routing"
import { PRICE_FALLBACK_OPTIONS } from "@/sanity/lib/constants"

type PriceValue =
  | {
      amount?: number | null
      noPriceReason?: string | null
    }
  | null
  | undefined

type ListingContractType = "sale" | "rent" | null | undefined

export function formatListingPrice(
  price: PriceValue,
  locale: AppLocale,
  contractType?: ListingContractType,
): string {
  if (!price) {
    return ""
  }

  if (!price.amount && !price.noPriceReason) {
    return ""
  }

  const amount = price?.amount

  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    const reason = price?.noPriceReason
    const reasonLabel =
      typeof reason === "string"
        ? PRICE_FALLBACK_OPTIONS.find((o) => o.value === reason)?.title[locale]
        : undefined

    if (reasonLabel) {
      return reasonLabel
    }

    if (contractType === "rent") {
      return locale === "en" ? "Rent on request" : "Canone su richiesta"
    }

    return PRICE_FALLBACK_OPTIONS[1].title[locale]
  }

  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    })
    const parts = formatter.formatToParts(amount)
    const numericPart = parts
      .filter((part) => part.type !== "currency")
      .map((part) => part.value)
      .join("")
      .trim()
    return `€ ${numericPart}`
  } catch {
    return `€ ${amount}`
  }
}
