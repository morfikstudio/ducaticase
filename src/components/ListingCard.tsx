import { useTranslations } from "next-intl"

import { Link } from "@/i18n/navigation"
import type { AppLocale } from "@/i18n/routing"

import { CATEGORY_OPTIONS } from "@/sanity/lib/constants"
import { pickLocalizedString } from "@/sanity/lib/locale"
import { listingTypologyLabel } from "@/sanity/lib/listingTypologyLabel"
import type {
  LISTINGS_PREVIEW_QUERY_RESULT,
  LocalizedString,
} from "@/sanity/types"

import { formatListingPrice } from "@/lib/formatListingPrice"
import { cn } from "@/utils/classNames"

import { SanityImage } from "@/components/ui/SanityImage"

type ListingsEntry = LISTINGS_PREVIEW_QUERY_RESULT[number]

type ListingCardProps = {
  entry: ListingsEntry
  locale: AppLocale
  priority?: boolean
}

export function ListingCard({
  entry,
  locale,
  priority = false,
}: ListingCardProps) {
  const t = useTranslations("listingsResults")
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
    <li className="min-w-0 h-full">
      <Link
        className="group flex flex-col overflow-hidden rounded-md bg-neutral-900 h-full"
        href={`/immobili/${entry._id}`}
        target="_self"
      >
        <div className="relative aspect-square overflow-hidden">
          {entry.mainImage ? (
            <SanityImage
              landscape={entry.mainImage}
              portrait={entry.mainImage}
              locale={locale}
              landscapeParams={{
                width: 720,
                height: 960,
                sizes: "50vw",
                quality: 50,
              }}
              portraitParams={{
                width: 720,
                height: 960,
                sizes: "100vw",
                quality: 50,
              }}
              fill
              loading={priority ? "eager" : undefined}
              className="object-cover object-center transition duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="h-full w-full bg-linear-to-br from-neutral-700 to-neutral-900" />
          )}
        </div>

        <div
          className={cn(
            "relative overflow-hidden flex-1 flex flex-col justify-end",
          )}
        >
          <div className="absolute inset-0">
            {entry.mainImage ? (
              <SanityImage
                landscape={entry.mainImage}
                portrait={entry.mainImage}
                locale={locale}
                landscapeParams={{
                  width: 720,
                  height: 960,
                  sizes: "50vw",
                  quality: 10,
                }}
                portraitParams={{
                  width: 720,
                  height: 960,
                  sizes: "100vw",
                  quality: 10,
                }}
                fill
                loading={priority ? "eager" : undefined}
                className="object-cover object-bottom transition duration-500 group-hover:scale-[1.03]"
              />
            ) : (
              <div className="h-full w-full bg-linear-to-br from-neutral-700 to-neutral-900" />
            )}
          </div>

          <div
            className={cn(
              "relative z-10 min-h-full",
              "flex flex-col gap-3 justify-between",
              "py-6 px-4 md:py-8 md:px-8",
              "bg-black/25 backdrop-blur-xl",
            )}
          >
            <div>
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
                  "type-listing-card-title text-primary mt-1",
                  "line-clamp-2",
                )}
              >
                {title}
              </h3>
            </div>

            <div className="flex items-end justify-between gap-4">
              <p className="truncate type-body-2 text-primary">{infoMeta}</p>
              <p className="shrink-0 truncate type-body-2 text-primary">
                {price}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </li>
  )
}
