import type { Metadata } from "next"
import type { SanityImageSource } from "@sanity/image-url/lib/types/types"

import type { AppLocale } from "@/i18n/routing"
import { routing } from "@/i18n/routing"

import { getSanityImageUrl } from "@/lib/sanity"

import type {
  SiteSeoConfig,
  SiteSeoPage,
  SiteSeoPageKey,
  SiteSeoSite,
} from "./types"
import { getSiteOrigin } from "./site-url"
import config from "./main.json"

export function absoluteUrl(origin: string, pathOrUrl: string): string {
  const trimmed = pathOrUrl.trim()
  if (!trimmed) {
    return origin
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }
  const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`
  return `${origin}${path}`
}

export function buildLocalizedPathname(
  locale: AppLocale,
  canonicalPath: string,
): string {
  const raw = canonicalPath.trim() || "/"
  if (raw === "/") {
    return `/${locale}`
  }
  const suffix = raw.startsWith("/") ? raw : `/${raw}`
  return `/${locale}${suffix}`
}

function hreflangLanguages(
  origin: string,
  fullConfig: SiteSeoConfig,
  pageKey: SiteSeoPageKey,
): Record<string, string> {
  const languages: Record<string, string> = {}
  for (const loc of routing.locales) {
    const page = fullConfig[pageKey][loc]
    const pathname = buildLocalizedPathname(loc, page.canonicalPath)
    languages[loc] = absoluteUrl(origin, pathname)
  }
  return languages
}

export function buildPageMetadata(
  site: SiteSeoSite,
  page: SiteSeoPage,
  locale: AppLocale,
  options?: { pageKey: SiteSeoPageKey; config: SiteSeoConfig },
): Metadata {
  const origin = getSiteOrigin()

  const brand = site.name.trim()
  const titleSegment = page.title.trim() || brand
  const fullTitle =
    titleSegment === brand ? titleSegment : `${titleSegment} | ${brand}`
  const description =
    page.description.trim() || site.defaultDescription.trim() || undefined

  const ogImage = page.openGraph.image
  const ogImageUrl = absoluteUrl(origin, ogImage.url)
  const ogImageAlt = ogImage.alt.trim() || fullTitle

  const pathname = buildLocalizedPathname(locale, page.canonicalPath)
  const canonical = absoluteUrl(origin, pathname)

  const alternates: Metadata["alternates"] = {
    canonical,
    ...(options
      ? {
          languages: hreflangLanguages(origin, options.config, options.pageKey),
        }
      : {}),
  }

  const metadata: Metadata = {
    title: titleSegment,
    description,
    ...(page.keywords.length > 0 ? { keywords: page.keywords } : {}),
    alternates,
    openGraph: {
      type: page.openGraph.type,
      url: canonical,
      siteName: site.name,
      locale: site.locale,
      title: fullTitle,
      description,
      images: [
        {
          url: ogImageUrl,
          width: ogImage.width,
          height: ogImage.height,
          alt: ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImageUrl],
      ...(site.twitterSite.trim() ? { site: site.twitterSite.trim() } : {}),
      ...(site.twitterCreator.trim()
        ? { creator: site.twitterCreator.trim() }
        : {}),
    },
  }

  return metadata
}

export function buildHomeMetadata(
  fullConfig: SiteSeoConfig,
  locale: AppLocale,
): Metadata {
  return buildPageMetadata(
    fullConfig.site[locale],
    fullConfig.home[locale],
    locale,
    { pageKey: "home", config: fullConfig },
  )
}

export function buildPageMetadataByKey(
  key: SiteSeoPageKey,
  locale: AppLocale,
): Metadata {
  const fullConfig = config as SiteSeoConfig
  const site = fullConfig.site[locale]
  const page = fullConfig[key][locale]
  return buildPageMetadata(site, page, locale, {
    pageKey: key,
    config: fullConfig,
  })
}

export function buildListingDetailMetadata(args: {
  locale: AppLocale
  listingId: string
  title?: string
  descriptionPlain?: string
  mainImage?: SanityImageSource | null
}): Metadata {
  const fullConfig = config as SiteSeoConfig
  const site = fullConfig.site[args.locale]
  const origin = getSiteOrigin()
  const brand = site.name.trim()
  const titleFromListing = args.title?.trim()
  const titleSegment = titleFromListing || brand
  const fullTitle =
    titleSegment === brand ? titleSegment : `${titleSegment} | ${brand}`

  const description =
    args.descriptionPlain?.trim() ||
    site.defaultDescription.trim() ||
    undefined

  const listingPath = `/immobili/${args.listingId}`
  const pathname = buildLocalizedPathname(args.locale, listingPath)
  const canonical = absoluteUrl(origin, pathname)

  const fallbackOg = fullConfig.listings[args.locale].openGraph.image
  const ogFromListing = getSanityImageUrl(args.mainImage ?? undefined, 1200, 630)
  const ogImageUrl =
    ogFromListing ?? absoluteUrl(origin, fallbackOg.url.trim())
  const ogImageWidth = ogFromListing ? 1200 : fallbackOg.width
  const ogImageHeight = ogFromListing ? 630 : fallbackOg.height
  const ogImageAlt = titleSegment

  const languages: Record<string, string> = {}
  for (const loc of routing.locales) {
    languages[loc] = absoluteUrl(
      origin,
      buildLocalizedPathname(loc, listingPath),
    )
  }

  return {
    title: titleSegment,
    description,
    alternates: { canonical, languages },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: site.name,
      locale: site.locale,
      title: fullTitle,
      description,
      images: [
        {
          url: ogImageUrl,
          width: ogImageWidth,
          height: ogImageHeight,
          alt: ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImageUrl],
      ...(site.twitterSite.trim() ? { site: site.twitterSite.trim() } : {}),
      ...(site.twitterCreator.trim()
        ? { creator: site.twitterCreator.trim() }
        : {}),
    },
  }
}
