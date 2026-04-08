import { Link } from "@/i18n/navigation"
import type { AppLocale } from "@/i18n/routing"
import { ListingsResultsWithFilters } from "@/components/listings/ListingsResultsWithFilters"
import { sanityFetch } from "@/sanity/lib/client"
import { LISTINGS_PREVIEW_QUERY } from "@/sanity/lib/queries"
import type { LISTINGS_PREVIEW_QUERY_RESULT } from "@/sanity/types"
import { Suspense } from "react"

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
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="type-display-1 text-light-gray">Ducati Case Immobili</h1>
      <Link href="/">HOME</Link>

      <Suspense fallback={<div className="mt-6">Caricamento filtri...</div>}>
        <ListingsResultsWithFilters listings={listings} locale={locale} />
      </Suspense>
    </main>
  )
}
