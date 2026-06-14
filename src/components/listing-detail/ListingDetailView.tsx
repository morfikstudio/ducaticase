import type { AppLocale } from "@/i18n/routing"
import {
  pickLocalizedPortableTextPlain,
  pickLocalizedString,
} from "@/sanity/lib/locale"
import type { LISTING_BY_ID_QUERY_RESULT } from "@/sanity/types"

import { JsonLd } from "@/components/seo/JsonLd"
import { buildListingJsonLdGraph } from "@/seo/json-ld/listing-graph"

import { Container } from "@/components/ui/Container"
import { Gallery } from "@/components/listing-detail/Gallery"
import { ListingDetailHeader } from "@/components/listing-detail/ListingDetailHeader"
import { ListingDescription } from "@/components/listing-detail/ListingDescription"
import { ListingSpecs } from "@/components/listing-detail/ListingSpecs"
import { EnergyClassDisplay } from "@/components/listing-detail/EnergyClassDisplay"
import { LocationMap } from "@/components/LocationMap"
import { RelatedListings } from "@/components/listing-detail/RelatedListings"

import {
  buildOptionalSpecRows,
  buildPropertySheetSpecRows,
} from "@/lib/listingOptionalSpecs"

type ListingDetailViewProps = {
  listing: NonNullable<LISTING_BY_ID_QUERY_RESULT>
  locale: AppLocale
  listingId: string
  isPreview?: boolean
}

export function ListingDetailView({
  listing,
  locale,
  listingId,
  isPreview = false,
}: ListingDetailViewProps) {
  const hasValidGallery =
    listing.content?.mainImage && listing.content?.gallery

  const hasValidHeader =
    listing.content &&
    listing.location &&
    listing.propertySheet &&
    listing.metadata

  const hasValidDescription =
    listing.content?.excerpt &&
    listing.content?.description &&
    listing.floorPlans

  const energyClass =
    listing.propertySheet && "energyClass" in listing.propertySheet
      ? listing.propertySheet.energyClass
      : undefined

  const mapLat = listing.location?.map?.lat
  const mapLng = listing.location?.map?.lng
  const hasValidMapPoint =
    typeof mapLat === "number" &&
    typeof mapLng === "number" &&
    Number.isFinite(mapLat) &&
    Number.isFinite(mapLng)

  const hasValidRelatedListings = listing.relatedListings.length > 0

  const propertySheetRows = buildPropertySheetSpecRows(
    listing.metadata._type,
    listing.propertySheet,
    listing.typology,
    locale,
  )

  const optionalSpecRows = buildOptionalSpecRows(
    listing.metadata._type,
    listing.additionalFields,
    locale,
  )
  const specRows = [...propertySheetRows, ...optionalSpecRows]

  const highlightsRaw = listing.additionalFields?.highlights
  const highlightRows =
    Array.isArray(highlightsRaw) && highlightsRaw.length > 0
      ? highlightsRaw
          .map((entry) => pickLocalizedString(entry, locale)?.trim())
          .filter((text): text is string => Boolean(text))
      : []

  const hasValidSpecs = specRows.length > 0 || highlightRows.length > 0

  const listingTitle = listing.content
    ? pickLocalizedString(listing.content.title, locale)
    : ""
  const descriptionPlain = listing.content
    ? pickLocalizedPortableTextPlain(listing.content.excerpt, locale)
    : ""
  const listingJsonLd =
    !isPreview && listing.content && listingTitle
      ? buildListingJsonLdGraph({
          listing,
          locale,
          listingId,
          listingTitle,
          descriptionPlain: descriptionPlain || undefined,
        })
      : null

  return (
    <main className="w-full overflow-x-clip md:pt-32">
      {listingJsonLd ? <JsonLd data={listingJsonLd} /> : null}
      <Container className="pt-20 md:pt-10">
        {isPreview ? (
          <div
            role="status"
            className="mb-6 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950"
          >
            Anteprima — annuncio archiviato, non indicizzato
          </div>
        ) : null}

        {hasValidGallery ? (
          <section>
            <Gallery
              mainImage={listing.content.mainImage}
              gallery={listing.content.gallery}
              locale={locale}
            />
          </section>
        ) : null}

        {hasValidHeader ? (
          <section className="my-8 md:my-14">
            <ListingDetailHeader
              content={listing.content}
              location={listing.location}
              propertySheet={listing.propertySheet}
              metadata={listing.metadata}
              typology={listing.typology}
              locale={locale}
            />
          </section>
        ) : null}

        {hasValidDescription ? (
          <section className="my-16 md:my-32">
            <ListingDescription
              excerpt={listing.content.excerpt}
              description={listing.content.description}
              floorPlans={listing.floorPlans}
              locale={locale}
            />
          </section>
        ) : null}

        {hasValidSpecs ? (
          <section className="my-16 md:my-32">
            <ListingSpecs rows={specRows} highlightRows={highlightRows} />
          </section>
        ) : null}

        {energyClass ? (
          <section className="my-16 md:my-32">
            <EnergyClassDisplay energyClass={energyClass} />
          </section>
        ) : null}

        {hasValidMapPoint ? (
          <section className="my-16 md:my-32">
            <LocationMap
              lat={mapLat ?? 0}
              lng={mapLng ?? 0}
              location={listing.location}
              positionInfoText={
                listing.location?.positionInfo?.[locale] || undefined
              }
            />
          </section>
        ) : null}

        {hasValidRelatedListings ? (
          <section className="my-16 md:my-32">
            <RelatedListings
              entries={listing.relatedListings}
              locale={locale}
            />
          </section>
        ) : null}
      </Container>
    </main>
  )
}
