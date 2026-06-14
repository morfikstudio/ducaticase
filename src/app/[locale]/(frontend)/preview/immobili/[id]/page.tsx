import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { AppLocale } from "@/i18n/routing"

import { getListingById } from "@/sanity/lib/getListingById"
import { pickLocalizedString } from "@/sanity/lib/locale"
import { isValidListingPreviewToken } from "@/lib/listing-preview/validatePreviewToken"

import { ListingDetailView } from "@/components/listing-detail/ListingDetailView"

export const dynamic = "force-dynamic"

type Props = {
  params: Promise<{ locale: string; id: string }>
  searchParams: Promise<{ token?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam, id } = await params
  const locale = localeParam as AppLocale

  const listing = await getListingById(id, { includeArchived: true })
  const title = listing?.content
    ? pickLocalizedString(listing.content.title, locale)
    : undefined

  return {
    title: title ? `Anteprima · ${title}` : "Anteprima annuncio",
    robots: { index: false, follow: false },
  }
}

export default async function ListingPreviewPage({
  params,
  searchParams,
}: Props) {
  const { locale: localeParam, id } = await params
  const { token } = await searchParams
  const locale = localeParam as AppLocale

  if (!isValidListingPreviewToken(token)) {
    notFound()
  }

  const listing = await getListingById(id, { includeArchived: true })

  if (!listing) {
    notFound()
  }

  return (
    <ListingDetailView
      listing={listing}
      locale={locale}
      listingId={id}
      isPreview
    />
  )
}
