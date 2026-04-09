import { notFound } from "next/navigation"
import type { AppLocale } from "@/i18n/routing"

import { sanityFetch } from "@/sanity/lib/client"
import { LISTING_BY_ID_QUERY } from "@/sanity/lib/queries"
import type { LISTING_BY_ID_QUERY_RESULT } from "@/sanity/types"

import ListingDetail from "@/components/listing-detail"

type Props = {
  params: Promise<{ locale: string; id: string }>
}

export default async function ListingDetailPage({ params }: Props) {
  const { locale: localeParam, id } = await params
  const locale = localeParam as AppLocale

  const listing = (await sanityFetch({
    query: LISTING_BY_ID_QUERY,
    params: { id },
    revalidate: 60,
  })) as LISTING_BY_ID_QUERY_RESULT

  if (!listing) {
    notFound()
  }

  return (
    <main>
      <ListingDetail listing={listing} locale={locale} />
    </main>
  )
}
