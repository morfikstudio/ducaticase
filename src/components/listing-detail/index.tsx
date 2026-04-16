"use client"

import { useMemo } from "react"
import type { AppLocale } from "@/i18n/routing"
import type { LISTING_BY_ID_QUERY_RESULT } from "@/sanity/types"
import { buildListingLocationText } from "@/lib/buildListingLocationText"

import { Container } from "../ui/Container"
import { Gallery } from "./subcomponents/Gallery"
import { ListingDetailHeader } from "./subcomponents/ListingDetailHeader"
import { Description } from "./subcomponents/Description"
import { ListingSpecs } from "./subcomponents/ListingSpecs"
import { EnergyClassDisplay } from "./subcomponents/EnergyClassDisplay"
import { ListingLocationMap } from "./subcomponents/ListingLocationMap"
import { RelatedListings } from "./subcomponents/RelatedListings"

type ListingDetailProps = {
  listing: NonNullable<LISTING_BY_ID_QUERY_RESULT>
  locale: AppLocale
}

export function ListingDetail({ listing, locale }: ListingDetailProps) {
  const mapLat = listing.location?.map?.lat
  const mapLng = listing.location?.map?.lng
  const hasValidMapPoint = useMemo(() => {
    return (
      typeof mapLat === "number" &&
      typeof mapLng === "number" &&
      Number.isFinite(mapLat) &&
      Number.isFinite(mapLng)
    )
  }, [mapLat, mapLng])

  return (
    <Container className="pt-20 md:pt-10">
      <Gallery
        mainImage={listing.content.mainImage}
        gallery={listing.content.gallery}
        locale={locale}
      />

      <div className="my-8 md:my-14">
        <ListingDetailHeader
          content={listing.content}
          location={listing.location}
          propertySheet={listing.propertySheet}
          metadata={listing.metadata}
          locale={locale}
        />
      </div>

      {"description" in listing.content ? (
        <div className="my-16 md:my-32">
          <Description
            excerpt={listing.content.excerpt}
            description={listing.content.description}
            floorPlans={listing.floorPlans}
            locale={locale}
          />
        </div>
      ) : null}

      <div className="my-16 md:my-32">
        <ListingSpecs />
      </div>

      {"energyClass" in listing.propertySheet ? (
        <div className="my-16 md:my-32">
          <EnergyClassDisplay energyClass={listing.propertySheet.energyClass} />
        </div>
      ) : null}

      {hasValidMapPoint ? (
        <div className="my-16 md:my-32">
          <ListingLocationMap
            lat={mapLat ?? 0}
            lng={mapLng ?? 0}
            locationText={buildListingLocationText(listing.location)}
          />
        </div>
      ) : null}

      {listing.relatedListings.length > 0 ? (
        <div className="my-16 md:my-32">
          <RelatedListings entries={listing.relatedListings} locale={locale} />
        </div>
      ) : null}
    </Container>
  )
}
