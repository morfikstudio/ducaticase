import { getTranslations } from "next-intl/server"

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

export async function menuContentFromSanity(
  doc: MENU_SITE_CONTENT_QUERY_RESULT,
  locale: AppLocale,
): Promise<MenuContent> {
  const m = doc?.menu
  const t = await getTranslations({ locale, namespace: "footer" })

  const navLinks: MenuNavLink[] = [
    ...SITE_MENU_NAV_ITEMS.map((row) => ({
      label: row.label[locale],
      href: row.path,
    })),
    {
      label: t("joinOurTeam"),
      href: "/contact#dc-lavora-con-noi",
    },
  ]

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
