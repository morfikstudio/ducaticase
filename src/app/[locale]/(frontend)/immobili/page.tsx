import { Suspense } from "react"
import type { AppLocale } from "@/i18n/routing"

import { sanityFetch } from "@/sanity/lib/client"
import { LISTINGS_PREVIEW_QUERY } from "@/sanity/lib/queries"
import type { LISTINGS_PREVIEW_QUERY_RESULT } from "@/sanity/types"

import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { ListingsResults } from "@/components/listings-results"
import { ListingsStoreHydrator } from "@/components/listings-results/providers/ListingsStoreHydrator"

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
      <ListingsStoreHydrator listings={listings} />
      <Suspense fallback={<LoadingSpinner className="min-h-[40vh]" />}>
        <ListingsResults locale={locale} />
      </Suspense>
    </main>
  )
}
