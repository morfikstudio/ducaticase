import type { AppLocale } from "@/i18n/routing"
import { pickLocalizedString } from "@/sanity/lib/locale"
import {
  SITE_MENU_SOCIAL_LINKS,
  SITE_MENU_NAV_ITEMS,
} from "@/sanity/lib/internalSitePaths"
import type { FOOTER_SITE_CONTENT_QUERY_RESULT } from "@/sanity/types"

export type FooterContent = {
  payoff: string
  email: string
  phone: string
  addressLine1: string
  addressLine2: string
  mapsUrl: string
  vat: string
  socialLinks: Array<{ label: string; href: string }>
  privacyPolicyLabel: string
  privacyPolicyUrl: string
  navLinks: Array<{ label: string; href: string }>
}

export function footerContentFromSanity(
  doc: FOOTER_SITE_CONTENT_QUERY_RESULT,
  locale: AppLocale,
): FooterContent {
  const f = doc?.footer
  const addressLine1 = f?.addressLine1?.trim() ?? ""
  const addressLine2 = f?.addressLine2?.trim() ?? ""
  const mapsUrl =
    addressLine1 !== "" && addressLine2 !== ""
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${addressLine1}, ${addressLine2}, Italia`,
        )}`
      : "#"

  const navLinks = SITE_MENU_NAV_ITEMS.map((row) => ({
    label: row.label[locale],
    href: row.path,
  }))

  const socialLinks = SITE_MENU_SOCIAL_LINKS.map((item) => ({
    label: item.label[locale],
    href: item.href,
  }))

  return {
    payoff: pickLocalizedString(f?.payoff ?? undefined, locale) ?? "",
    email: f?.email?.trim() ?? "",
    phone: f?.phone?.trim() ?? "",
    addressLine1,
    addressLine2,
    mapsUrl,
    vat: pickLocalizedString(f?.vat ?? undefined, locale) ?? "",
    socialLinks,
    privacyPolicyLabel:
      pickLocalizedString(f?.privacyPolicyLabel ?? undefined, locale) ?? "",
    privacyPolicyUrl: f?.privacyPolicyPath?.trim() ?? "",
    navLinks,
  }
}
