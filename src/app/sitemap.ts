import type { MetadataRoute } from "next"

import { routing } from "@/i18n/routing"
import type { AppLocale } from "@/i18n/routing"
import { sanityFetch } from "@/sanity/lib/client"
import { LISTING_SITEMAP_IDS_QUERY } from "@/sanity/lib/queries"
import siteSeo from "@/seo/main.json"
import { absoluteUrl, buildLocalizedPathname } from "@/seo/page-metadata"
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
]

type ListingSitemapRow = { _id: string; _updatedAt: string }

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = getSiteOrigin()
  const cfg = siteSeo as SiteSeoConfig
  const entries: MetadataRoute.Sitemap = []

  let listingRows: ListingSitemapRow[] = []

  try {
    listingRows = (await sanityFetch({
      query: LISTING_SITEMAP_IDS_QUERY,
      revalidate: 300,
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
        changeFrequency: key === "home" ? "weekly" : "monthly",
        priority: key === "home" ? 1 : 0.8,
      })
    }

    for (const row of listingRows) {
      const pathname = buildLocalizedPathname(loc, `/immobili/${row._id}`)

      entries.push({
        url: absoluteUrl(origin, pathname),
        lastModified: new Date(row._updatedAt),
        changeFrequency: "weekly",
        priority: 0.7,
      })
    }
  }

  return entries
}
