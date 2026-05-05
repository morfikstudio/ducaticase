import type { AppLocale } from "@/i18n/routing"
import { getSanityImageUrl } from "@/lib/sanity"
import type { LISTING_BY_ID_QUERY_RESULT } from "@/sanity/types"
import siteSeo from "@/seo/main.json"
import { absoluteUrl, buildLocalizedPathname } from "@/seo/page-metadata"
import type { SiteSeoConfig } from "@/seo/types"
import { getSiteOrigin } from "@/seo/site-url"

type PriceBlock = {
  amount?: number
  currency?: "EUR" | "CHF" | null
  noPriceReason?: "priceOnRequest" | "privateNegotiation"
} | null

function collectImageUrls(
  listing: NonNullable<LISTING_BY_ID_QUERY_RESULT>,
): string[] {
  const content = listing.content
  if (!content) return []

  const urls: string[] = []
  const main = getSanityImageUrl(content.mainImage ?? undefined, 1200, 630)
  if (main) urls.push(main)

  for (const img of content.gallery ?? []) {
    if (urls.length >= 8) break
    const u = getSanityImageUrl(img, 1200, 630)
    if (u && !urls.includes(u)) urls.push(u)
  }
  return urls
}

function priceOffer(price: PriceBlock): Record<string, unknown> | undefined {
  if (!price?.amount || price.noPriceReason) return undefined

  const priceCurrency =
    typeof price.currency === "string" && price.currency.trim() !== ""
      ? price.currency
      : "EUR"

  return {
    "@type": "Offer",
    price: price.amount,
    priceCurrency,
    availability: "https://schema.org/InStock",
  }
}

function floorSizeSqm(
  propertySheet: NonNullable<LISTING_BY_ID_QUERY_RESULT>["propertySheet"],
): Record<string, unknown> | undefined {
  if (!propertySheet || !("commercialAreaSqm" in propertySheet))
    return undefined
  const sqm = propertySheet.commercialAreaSqm
  if (sqm == null || !Number.isFinite(sqm)) return undefined
  return {
    "@type": "QuantitativeValue",
    value: sqm,
    unitText: "m²",
  }
}

export function buildListingJsonLdGraph(args: {
  listing: NonNullable<LISTING_BY_ID_QUERY_RESULT>
  locale: AppLocale
  listingId: string
  listingTitle: string
  descriptionPlain?: string
}): Record<string, unknown> {
  const origin = getSiteOrigin()
  const cfg = siteSeo as SiteSeoConfig
  const listingPath = `/immobili/${args.listingId}`
  const pageUrl = absoluteUrl(
    origin,
    buildLocalizedPathname(args.locale, listingPath),
  )

  const homeUrl = absoluteUrl(origin, buildLocalizedPathname(args.locale, "/"))
  const listingsIndexUrl = absoluteUrl(
    origin,
    buildLocalizedPathname(
      args.locale,
      cfg.listings[args.locale].canonicalPath,
    ),
  )

  const images = collectImageUrls(args.listing)
  const loc = args.listing.location
  const addressParts: Record<string, unknown> = {
    "@type": "PostalAddress",
  }
  if (loc?.address) addressParts.streetAddress = loc.address
  if (loc?.city) addressParts.addressLocality = loc.city
  if (loc?.province) addressParts.addressRegion = loc.province
  if (loc?.postalCode) addressParts.postalCode = loc.postalCode
  if (loc?.country) addressParts.addressCountry = loc.country

  const hasAddress =
    addressParts.streetAddress ||
    addressParts.addressLocality ||
    addressParts.addressRegion

  const map = loc?.map
  const geo =
    typeof map?.lat === "number" &&
    typeof map?.lng === "number" &&
    Number.isFinite(map.lat) &&
    Number.isFinite(map.lng)
      ? {
          "@type": "GeoCoordinates",
          latitude: map.lat,
          longitude: map.lng,
        }
      : undefined

  const propertySheet = args.listing.propertySheet
  const priceBlock =
    propertySheet && "price" in propertySheet
      ? (propertySheet.price as PriceBlock)
      : null
  const offers = priceOffer(priceBlock)
  const floorSize = floorSizeSqm(propertySheet)

  const listingNode: Record<string, unknown> = {
    "@type": "RealEstateListing",
    "@id": `${pageUrl}#listing`,
    name: args.listingTitle,
    url: pageUrl,
    datePosted: args.listing.metadata._createdAt,
    dateModified: args.listing.metadata._updatedAt,
  }

  if (args.descriptionPlain) {
    listingNode.description = args.descriptionPlain
  }
  if (images.length > 0) {
    listingNode.image = images
  }
  if (hasAddress) {
    listingNode.address = addressParts
  }
  if (geo) {
    listingNode.geo = geo
  }
  if (offers) {
    listingNode.offers = offers
  }
  if (floorSize) {
    listingNode.floorSize = floorSize
  }

  const homeLabel = cfg.home[args.locale].title
  const listingsLabel = cfg.listings[args.locale].title

  const breadcrumbs: Record<string, unknown> = {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: homeLabel,
        item: homeUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: listingsLabel,
        item: listingsIndexUrl,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: args.listingTitle,
        item: pageUrl,
      },
    ],
  }

  return {
    "@context": "https://schema.org",
    "@graph": [listingNode, breadcrumbs],
  }
}
