"use client"

import type { AppLocale } from "@/i18n/routing"
import type { LISTING_BY_ID_QUERY_RESULT } from "@/sanity/types"

import { GalleryModule } from "./subcomponents/GalleryModule"
import { Container } from "../ui/Container"

type ListingDetailProps = {
  listing: NonNullable<LISTING_BY_ID_QUERY_RESULT>
  locale: AppLocale
}

export function ListingDetail({ listing, locale }: ListingDetailProps) {
  return (
    <Container className="pt-20 md:pt-10 pb-24">
      <GalleryModule
        mainImage={listing.content.mainImage}
        gallery={listing.content.gallery}
        locale={locale}
      />
    </Container>
  )
}
