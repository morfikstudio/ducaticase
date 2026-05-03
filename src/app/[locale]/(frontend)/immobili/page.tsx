import { Suspense } from "react"
import type { Metadata } from "next"
import type { AppLocale } from "@/i18n/routing"

import { sanityFetch } from "@/sanity/lib/client"
import { LISTINGS_PREVIEW_QUERY } from "@/sanity/lib/queries"
import type { LISTINGS_PREVIEW_QUERY_RESULT } from "@/sanity/types"

import { buildPageMetadataByKey } from "@/seo/page-metadata"

import { cn } from "@/utils/classNames"

import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { ListingsResults } from "@/components/listings-results"
import { ListingsStoreHydrator } from "@/components/listings-results/providers/ListingsStoreHydrator"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: localeParam } = await params
  return buildPageMetadataByKey("listings", localeParam as AppLocale)
}

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
    <main className={cn("w-full overflow-x-clip", "pt-32 md:pt-54", "pb-24")}>
      <ListingsStoreHydrator listings={listings} />
      <Suspense fallback={<LoadingSpinner className="min-h-[40vh]" />}>
        <ListingsResults locale={locale} />
      </Suspense>
    </main>
  )
}
