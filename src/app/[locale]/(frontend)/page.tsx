import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { formatListingPrice } from "@/lib/formatListingPrice"
import { getSanityImageUrl } from "@/lib/sanity"
import type { AppLocale } from "@/i18n/routing"
import { sanityFetch } from "@/sanity/lib/client"
import { MACRO_CATEGORY_OPTIONS } from "@/sanity/lib/constants"
import { pickLocalizedString } from "@/sanity/lib/locale"
import { listingTypologyLabel } from "@/sanity/lib/listingTypologyLabel"
import { LISTINGS_PREVIEW_QUERY } from "@/sanity/lib/queries"
import type { LISTINGS_PREVIEW_QUERY_RESULT, LocalizedString } from "@/sanity/types"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function Page({ params }: Props) {
  const { locale: localeParam } = await params
  const locale = localeParam as AppLocale

  const listings = (await sanityFetch({
    query: LISTINGS_PREVIEW_QUERY,
    revalidate: 60,
  })) as LISTINGS_PREVIEW_QUERY_RESULT

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <ul className="space-y-2">
        {listings.map((entry) => {
          const thumbUrl = getSanityImageUrl(entry.mainImage, 160, 120)
          const typology = listingTypologyLabel(entry._type, entry.typology, locale)
          const label = pickLocalizedString(
            entry.listingLabel as LocalizedString | null | undefined,
            locale,
          )
          const macroSectionTitle =
            MACRO_CATEGORY_OPTIONS.find((row) => row.documentType === entry._type)
              ?.title ?? "Annuncio"
          const title = label ?? typology ?? macroSectionTitle
          const price = formatListingPrice(entry.price, locale)

          return (
            <li key={entry._id}>
            <Link
              className="block rounded-xl border border-neutral-200 p-3 transition hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600"
              href={`/immobili/${entry._id}`}
              target="_blank"
            >
              <div className="flex items-center gap-3">
                <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-md bg-neutral-100 dark:bg-neutral-900">
                  {thumbUrl ? (
                    <Image
                      src={thumbUrl}
                      alt={title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : null}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium text-neutral-900 dark:text-white">
                    {title}
                  </p>
                  <p className="truncate text-sm text-neutral-600 dark:text-neutral-300">
                    {[price, entry.city].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </div>
            </Link>
          </li>
          )
        })}
      </ul>
    </main>
  )
}
