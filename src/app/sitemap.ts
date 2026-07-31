import type { MetadataRoute } from "next"

import { routing } from "@/i18n/routing"
import type { AppLocale } from "@/i18n/routing"
import { sanityFetch } from "@/sanity/lib/client"
import { CACHE_TAGS } from "@/sanity/lib/cache-tags"
import { LISTING_SITEMAP_IDS_QUERY } from "@/sanity/lib/queries"
import siteSeo from "@/seo/main.json"
import { absoluteUrl, buildLocalizedPathname } from "@/seo/page-metadata"
import { isSeoEnabled } from "@/seo/seo-flag"
import type { SiteSeoConfig, SiteSeoPageKey } from "@/seo/types"
import { getSiteOrigin } from "@/seo/site-url"

const STATIC_PAGE_KEYS: SiteSeoPageKey[] = [
  "home",
  "listYourProperty",
  "listings",
  "tayloredSearch",
  "business",
  "about",
  "contact",
  "privacyPolicy",
]

type ListingSitemapRow = { _id: string; _updatedAt: string }

/** Mappa `locale -> URL` + `x-default` per gli `xhtml:link` alternate. */
function alternateLanguages(
  origin: string,
  canonicalPath: string,
): Record<string, string> {
  const languages: Record<string, string> = {}

  for (const locale of routing.locales) {
    languages[locale] = absoluteUrl(
      origin,
      buildLocalizedPathname(locale as AppLocale, canonicalPath),
    )
  }

  languages["x-default"] = languages[routing.defaultLocale]

  return languages
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isSeoEnabled()) {
    return []
  }

  const origin = getSiteOrigin()
  const cfg = siteSeo as SiteSeoConfig
  const entries: MetadataRoute.Sitemap = []
  const buildDate = new Date()

  let listingRows: ListingSitemapRow[] = []

  try {
    listingRows = (await sanityFetch({
      query: LISTING_SITEMAP_IDS_QUERY,
      revalidate: 300,
      tags: [CACHE_TAGS.listing],
    })) as ListingSitemapRow[]
  } catch {
    listingRows = []
  }

  for (const locale of routing.locales) {
    const loc = locale as AppLocale

    for (const key of STATIC_PAGE_KEYS) {
      const page = cfg[key][loc]
      const pathname = buildLocalizedPathname(loc, page.canonicalPath)

      entries.push({
        url: absoluteUrl(origin, pathname),
        lastModified: buildDate,
        changeFrequency: key === "home" ? "weekly" : "monthly",
        priority: key === "home" ? 1 : 0.8,
        alternates: {
          languages: alternateLanguages(origin, page.canonicalPath),
        },
      })
    }

    for (const row of listingRows) {
      const listingPath = `/immobili/${row._id}`
      const pathname = buildLocalizedPathname(loc, listingPath)

      entries.push({
        url: absoluteUrl(origin, pathname),
        lastModified: new Date(row._updatedAt),
        changeFrequency: "weekly",
        priority: 0.7,
        alternates: { languages: alternateLanguages(origin, listingPath) },
      })
    }
  }

  return entries
}
