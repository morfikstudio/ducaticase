import type { AppLocale } from "@/i18n/routing"

export type SiteSeoOgImage = {
  url: string
  width: number
  height: number
  alt: string
}

export type SiteSeoSite = {
  name: string
  defaultDescription: string
  locale: string
  twitterSite: string
  twitterCreator: string
}

export type SiteSeoPage = {
  title: string
  description: string
  keywords: string[]
  canonicalPath: string
  openGraph: {
    type: "website"
    image: SiteSeoOgImage
  }
}

export type SiteSeoSiteByLocale = Record<AppLocale, SiteSeoSite>

export type SiteSeoPageByLocale = Record<AppLocale, SiteSeoPage>

export type SiteSeoConfig = {
  site: SiteSeoSiteByLocale
  home: SiteSeoPageByLocale
  listYourProperty: SiteSeoPageByLocale
  listings: SiteSeoPageByLocale
  tayloredSearch: SiteSeoPageByLocale
  business: SiteSeoPageByLocale
  about: SiteSeoPageByLocale
  contact: SiteSeoPageByLocale
}

export type SiteSeoPageKey = keyof Omit<SiteSeoConfig, "site">
