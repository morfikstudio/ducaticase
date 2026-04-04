import type { AppLocale } from "@/i18n/routing"

type LocalizedStrings = {
  it?: string | null
  en?: string | null
}

/** UI text: EN with fallback to IT if missing. */
export function pickLocalizedString(
  value: LocalizedStrings | null | undefined,
  locale: AppLocale,
): string | undefined {
  if (!value) {
    return undefined
  }
  const it = value.it?.trim() || undefined
  const en = value.en?.trim() || undefined
  if (locale === "en") {
    return en ?? it
  }
  return it ?? en
}

type LocalizedBlocks = {
  it?: unknown
  en?: unknown
}

/** Portable Text: same fallback rule. */
export function pickLocalizedPortableText(
  value: LocalizedBlocks | null | undefined,
  locale: AppLocale,
): unknown {
  if (!value) {
    return undefined
  }
  if (locale === "en") {
    const en = value.en
    if (Array.isArray(en) && en.length > 0) {
      return en
    }
    return value.it
  }
  const it = value.it
  if (Array.isArray(it) && it.length > 0) {
    return it
  }
  return value.en
}
