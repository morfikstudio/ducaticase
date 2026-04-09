import Image from "next/image"

import { Link } from "@/i18n/navigation"
import type { AppLocale } from "@/i18n/routing"
import { formatListingPrice } from "@/lib/formatListingPrice"
import { getSanityImageUrl } from "@/lib/sanity"
import { MACRO_CATEGORY_OPTIONS } from "@/sanity/lib/constants"
import { listingContractTypeLabel } from "@/sanity/lib/listingContractTypeLabel"
import { pickLocalizedString } from "@/sanity/lib/locale"
import { listingTypologyLabel } from "@/sanity/lib/listingTypologyLabel"
import type {
  LISTINGS_PREVIEW_QUERY_RESULT,
  LocalizedString,
} from "@/sanity/types"
import { cn } from "@/utils/classNames"

type ListingsEntry = LISTINGS_PREVIEW_QUERY_RESULT[number]

type ListingCardProps = {
  entry: ListingsEntry
  locale: AppLocale
}

export function ListingCard({ entry, locale }: ListingCardProps) {
  const thumbUrl = getSanityImageUrl(entry.mainImage, 1200, 1500)
  const typology = listingTypologyLabel(entry._type, entry.typology, locale)
  const label = pickLocalizedString(
    entry.listingLabel as LocalizedString | null | undefined,
    locale,
  )
  const macroSectionTitle =
    MACRO_CATEGORY_OPTIONS.find((row) => row.documentType === entry._type)
      ?.title ?? "Annuncio"
  const title = label ?? typology ?? macroSectionTitle
  const contractType = (entry as { listingContractType?: string | null })
    .listingContractType
  const contractTypeLabel = listingContractTypeLabel(contractType, locale)
  const price = formatListingPrice(
    entry.price,
    locale,
    contractType as "sale" | "rent" | null,
  )
  const topMeta = [entry.city, contractTypeLabel].filter(Boolean).join(" · ")
  const secondaryMeta = [typology, macroSectionTitle].filter(Boolean).join(" | ")

  return (
    <li className="min-w-0">
      <Link
        className="group relative block aspect-4/5 overflow-hidden rounded-sm bg-neutral-900"
        href={`/immobili/${entry._id}`}
        target="_blank"
      >
        <div className="absolute inset-0">
          {thumbUrl ? (
            <Image
              src={thumbUrl}
              alt={title}
              fill
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          ) : (
            <div className="h-full w-full bg-linear-to-br from-neutral-700 to-neutral-900" />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/20 to-transparent" />
        </div>

        <div
          className={cn(
            "absolute inset-x-0 bottom-0",
            "bg-black/25 p-5 backdrop-blur-md md:p-6",
          )}
        >
          <p className="mb-2 truncate text-[11px] uppercase tracking-[0.06em] text-neutral-200 md:text-xs">
            {topMeta || macroSectionTitle}
          </p>
          <h3 className="line-clamp-2 text-3xl leading-[1.1] font-light text-white md:text-[2.25rem]">
            {title}
          </h3>
          <div className="mt-3 flex items-end justify-between gap-4">
            <p className="truncate text-sm text-neutral-200 md:text-base">
              {secondaryMeta}
            </p>
            <p className="shrink-0 text-sm text-white md:text-xl">{price}</p>
          </div>
        </div>
      </Link>
    </li>
  )
}
