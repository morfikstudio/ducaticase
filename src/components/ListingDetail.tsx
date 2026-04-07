"use client"

import Image from "next/image"
import type { AppLocale } from "@/i18n/routing"
import type {
  LISTING_BY_ID_QUERY_RESULT,
  LocalizedString,
} from "@/sanity/types"
import { formatListingPrice } from "@/lib/formatListingPrice"
import { getSanityImageUrl } from "@/lib/sanity"
import { listingTypologyLabel } from "@/sanity/lib/listingTypologyLabel"
import { pickLocalizedString } from "@/sanity/lib/locale"

import PortableTextComponent from "@/components/ui/PortableText"

type ListingDetailProps = {
  listing: NonNullable<LISTING_BY_ID_QUERY_RESULT>
  locale: AppLocale
}

export default function ListingDetail({ listing, locale }: ListingDetailProps) {
  const typology = listingTypologyLabel(
    listing.metadata._type,
    listing.typology,
    locale,
  )

  const mainImageUrl = getSanityImageUrl(listing.content.mainImage, 1400)
  const mainImageAlt =
    pickLocalizedString(
      listing.content.mainImage?.alt as LocalizedString | undefined,
      locale,
    ) ?? ""

  return (
    <main>
      <h1>Annuncio immobiliare</h1>
      {typology && <h2>{typology}</h2>}

      <section className="mt-4">
        {listing.propertySheet.price && (
          <h2>{formatListingPrice(listing.propertySheet.price, locale)}</h2>
        )}
        <p>{listing.propertySheet.commercialAreaSqm} m²</p>
      </section>

      {mainImageUrl && (
        <section className="mt-4">
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-neutral-100 shadow-sm dark:bg-neutral-900">
            <Image
              src={mainImageUrl}
              alt={mainImageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
              priority
            />
          </div>
        </section>
      )}

      {listing.content.description && (
        <section className="mt-4">
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <PortableTextComponent
              text={listing.content.description}
              locale={locale}
            />
          </div>
        </section>
      )}
    </main>
  )
}
