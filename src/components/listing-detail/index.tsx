"use client"

import type { AppLocale } from "@/i18n/routing"
import type { LISTING_BY_ID_QUERY_RESULT } from "@/sanity/types"

import { Container } from "../ui/Container"
import { Gallery } from "./subcomponents/Gallery"
import { ListingDetailHeader } from "./subcomponents/ListingDetailHeader"
import { Description } from "./subcomponents/Description"
import { ListingSpecs } from "./subcomponents/ListingSpecs"
import { EnergyClassDisplay } from "./subcomponents/EnergyClassDisplay"

type ListingDetailProps = {
  listing: NonNullable<LISTING_BY_ID_QUERY_RESULT>
  locale: AppLocale
}

export function ListingDetail({ listing, locale }: ListingDetailProps) {
  return (
    <Container className="pt-20 md:pt-10 pb-24">
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
    </Container>
  )
}
