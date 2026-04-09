import { Suspense } from "react"
import type { AppLocale } from "@/i18n/routing"

import { sanityFetch } from "@/sanity/lib/client"
import { LISTINGS_PREVIEW_QUERY } from "@/sanity/lib/queries"
import type { LISTINGS_PREVIEW_QUERY_RESULT } from "@/sanity/types"

import ListingsResults from "@/components/listings-results"

type ListingsPageProps = {
  params: Promise<{ locale: string }>
}

export default async function ListingsPage({ params }: ListingsPageProps) {
  const { locale: localeParam } = await params
  const locale = localeParam as AppLocale

  const listings = (await sanityFetch({
    query: LISTINGS_PREVIEW_QUERY,
    revalidate: 60,
  })) as LISTINGS_PREVIEW_QUERY_RESULT

  return (
    <main>
      <Suspense fallback={<div className="mt-6">Caricamento filtri...</div>}>
        <ListingsResults listings={listings} locale={locale} />
      </Suspense>
    </main>
  )
}
