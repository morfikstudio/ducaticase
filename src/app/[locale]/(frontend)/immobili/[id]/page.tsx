import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { AppLocale } from "@/i18n/routing"

import { getListingById } from "@/sanity/lib/getListingById"
import {
  pickLocalizedPortableTextPlain,
  pickLocalizedString,
} from "@/sanity/lib/locale"

import {
  buildListingDetailMetadata,
  buildPageMetadataByKey,
} from "@/seo/page-metadata"

import { ListingDetailView } from "@/components/listing-detail/ListingDetailView"

type Props = {
  params: Promise<{ locale: string; id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam, id } = await params
  const locale = localeParam as AppLocale

  const listing = await getListingById(id)

  if (!listing?.content) {
    return buildPageMetadataByKey("listings", locale)
  }

  const { content } = listing
  const title = pickLocalizedString(content.title, locale)
  const descriptionPlain = pickLocalizedPortableTextPlain(
    content.excerpt,
    locale,
  )

  return buildListingDetailMetadata({
    locale,
    listingId: id,
    title,
    descriptionPlain: descriptionPlain || undefined,
    mainImage: content.mainImage ?? undefined,
  })
}

export default async function ListingDetailPage({ params }: Props) {
  const { locale: localeParam, id } = await params
  const locale = localeParam as AppLocale

  const listing = await getListingById(id)

  if (!listing) {
    notFound()
  }

  return (
    <ListingDetailView listing={listing} locale={locale} listingId={id} />
  )
}
