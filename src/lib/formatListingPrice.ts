import type { AppLocale } from "@/i18n/routing"
import { PRICE_FALLBACK_OPTIONS } from "@/sanity/lib/constants"

type PriceValue =
  | {
      amount?: number | null
      currency?: string | null
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

  const reason = price.noPriceReason
  const hasReason =
    typeof reason === "string" && reason.trim() !== ""

  // noPriceReason controls public visibility: if set, show the label regardless of amount
  if (hasReason) {
    const reasonLabel = PRICE_FALLBACK_OPTIONS.find(
      (o) => o.value === reason,
    )?.title[locale]

    if (reasonLabel) {
      return reasonLabel
    }

    if (contractType === "rent") {
      return locale === "en" ? "Rent on request" : "Canone su richiesta"
    }

    return PRICE_FALLBACK_OPTIONS[1].title[locale]
  }

  const amount = price.amount

  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    return ""
  }

  const currency =
    typeof price.currency === "string" && price.currency.trim() !== ""
      ? price.currency
      : "EUR"

  const currencySymbol = currency === "CHF" ? "CHF" : "€"

  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    })
    const parts = formatter.formatToParts(amount)
    const numericPart = parts
      .filter((part) => part.type !== "currency")
      .map((part) => part.value)
      .join("")
      .trim()
    return `${currencySymbol} ${numericPart}`
  } catch {
    return `${currencySymbol} ${amount}`
  }
}
