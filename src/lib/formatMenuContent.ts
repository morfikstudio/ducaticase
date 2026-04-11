import type { AppLocale } from "@/i18n/routing"
import { pickLocalizedString } from "@/sanity/lib/locale"
import type { MENU_SITE_CONTENT_QUERY_RESULT } from "@/sanity/types"

export type MenuNavLink = {
  label: string
  href: string
}

export type MenuSocialLink = {
  label: string
  href: string
}

export type MenuContent = {
  navLinks: MenuNavLink[]
  socialLinks: MenuSocialLink[]
  /** Payoff nel drawer mobile/menu */
  payoff: string
  /** Tagline centrale sulla barra (desktop) */
  headerTagline: string
}

export function menuContentFromSanity(
  doc: MENU_SITE_CONTENT_QUERY_RESULT,
  locale: AppLocale,
): MenuContent {
  const m = doc?.menu

  const navLinks =
    m?.navLinks
      ?.map((row) => ({
        label: pickLocalizedString(row?.label ?? undefined, locale) ?? "",
        href: row?.path?.trim() ?? "",
      }))
      .filter(
        (item): item is MenuNavLink => item.label !== "" && item.href !== "",
      ) ?? []

  const socialLinks =
    m?.socialLinks
      ?.map((item) => ({
        label: item.label?.trim() ?? "",
        href: item.href?.trim() ?? "",
      }))
      .filter(
        (item): item is MenuSocialLink => item.label !== "" && item.href !== "",
      ) ?? []

  return {
    headerTagline:
      pickLocalizedString(m?.headerTagline ?? undefined, locale) ?? "",
    payoff: pickLocalizedString(m?.payoff ?? undefined, locale) ?? "",
    navLinks,
    socialLinks,
  }
}
