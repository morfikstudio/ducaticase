import Image from "next/image"
import { useTranslations } from "next-intl"

import { Link } from "@/i18n/navigation"
import type { AppLocale } from "@/i18n/routing"
import { formatListingPrice } from "@/lib/formatListingPrice"
import { getSanityImageUrl } from "@/lib/sanity"
import { CATEGORY_OPTIONS } from "@/sanity/lib/constants"
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
  const t = useTranslations("listingsResults")
  const thumbUrl = getSanityImageUrl(entry.mainImage, 1200, 1500)
  const typology = listingTypologyLabel(entry._type, entry.typology, locale)
  const listingTitle = pickLocalizedString(entry.title, locale)
  const label = pickLocalizedString(
    entry.listingLabel as LocalizedString | null | undefined,
    locale,
  )
  const categoryRow = CATEGORY_OPTIONS.find(
    (row) => row.documentType === entry._type,
  )
  const categorySectionTitle =
    categoryRow?.title[locale] ?? t("genericListingCategory")
  const title = listingTitle || label || typology || categorySectionTitle
  const contractType = (entry as { listingContractType?: string | null })
    .listingContractType
  const price = formatListingPrice(
    entry.price,
    locale,
    contractType as "sale" | "rent" | null,
  )
  const infoMeta = [typology, categorySectionTitle].filter(Boolean).join(" | ")
  const address = (
    entry as {
      address?: {
        streetName?: string | null
        streetNumber?: string | null
      } | null
    }
  ).address
  const postalCode = (entry as { postalCode?: string | null }).postalCode
  const province = (entry as { province?: string | null }).province
  const street = [address?.streetName, address?.streetNumber]
    .map((part) => (typeof part === "string" ? part.trim() : ""))
    .filter(Boolean)
    .join(" ")
  const city = entry.city?.trim()
  const provinceCode = province?.trim()
  const cityWithProvince =
    city && provinceCode
      ? `${city} (${provinceCode})`
      : city || (provinceCode ? `(${provinceCode})` : "")
  const locationText =
    [street, postalCode?.trim(), cityWithProvince]
      .filter(Boolean)
      .join(" · ") || t("reservedLocation")

  return (
    <li className="min-w-0">
      <Link
        className="group relative block aspect-4/5 overflow-hidden rounded-md bg-neutral-900"
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
            "absolute inset-x-0 bottom-0 p-8",
            "flex flex-col gap-3",
            "bg-black/25 backdrop-blur-md",
          )}
        >
          <p
            className={cn(
              "font-sans text-[12px] font-medium uppercase",
              "truncate text-primary",
            )}
          >
            {locationText}
          </p>

          <h3
            className={cn(
              "type-listing-card-title text-primary",
              "line-clamp-2",
            )}
          >
            {title}
          </h3>

          <div className="flex items-end justify-between gap-4">
            <p className="truncate type-body-2 text-primary">{infoMeta}</p>
            <p className="shrink-0 truncate type-body-2 text-primary">
              {price}
            </p>
          </div>
        </div>
      </Link>
    </li>
  )
}
