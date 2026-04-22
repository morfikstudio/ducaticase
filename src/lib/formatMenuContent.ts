import type { AppLocale } from "@/i18n/routing"
import { pickLocalizedString } from "@/sanity/lib/locale"
import {
  SITE_MENU_SOCIAL_LINKS,
  SITE_MENU_NAV_ITEMS,
} from "@/sanity/lib/internalSitePaths"
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

  const navLinks: MenuNavLink[] = SITE_MENU_NAV_ITEMS.map((row) => ({
    label: row.label[locale],
    href: row.path,
  }))

  const socialLinks: MenuSocialLink[] = SITE_MENU_SOCIAL_LINKS.map((item) => ({
    label: item.label[locale],
    href: item.href,
  }))

  return {
    headerTagline:
      pickLocalizedString(m?.headerTagline ?? undefined, locale) ?? "",
    payoff: pickLocalizedString(m?.payoff ?? undefined, locale) ?? "",
    navLinks,
    socialLinks,
  }
}
