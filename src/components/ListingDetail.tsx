"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import type { AppLocale } from "@/i18n/routing"
import type {
  LISTING_BY_ID_QUERY_RESULT,
  LocalizedString,
} from "@/sanity/types"
import { formatListingPrice } from "@/lib/formatListingPrice"
import { getSanityImageUrl } from "@/lib/sanity"
import {
  MACRO_CATEGORY_OPTIONS,
  OPTIONAL_FIELD_LABELS,
} from "@/sanity/lib/constants"
import { listingTypologyLabel } from "@/sanity/lib/listingTypologyLabel"
import { pickLocalizedString } from "@/sanity/lib/locale"

import PortableTextComponent from "@/components/ui/PortableText"

type ListingDetailProps = {
  listing: NonNullable<LISTING_BY_ID_QUERY_RESULT>
  locale: AppLocale
}

function formatOptionalFieldLabel(key: string, locale: AppLocale): string {
  const localized = OPTIONAL_FIELD_LABELS[key]
  if (localized) {
    return localized[locale]
  }

  return key
    .replace(/^has/, "")
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim()
}

function formatOptionalFieldValue(value: unknown, locale: AppLocale): string {
  if (typeof value === "boolean") {
    return value
      ? locale === "en"
        ? "Yes"
        : "Sì"
      : locale === "en"
        ? "No"
        : "No"
  }
  if (typeof value === "number") {
    return String(value)
  }
  if (typeof value === "string") {
    return value
  }
  if (Array.isArray(value)) {
    return locale === "en"
      ? `${value.length} items`
      : `${value.length} elementi`
  }
  if (value && typeof value === "object") {
    const pairs = Object.entries(value as Record<string, unknown>)
      .filter(([, v]) => v !== null && v !== undefined && v !== "")
      .map(([k, v]) => `${formatOptionalFieldLabel(k, locale)}: ${String(v)}`)
    return pairs.join(" · ")
  }
  return "—"
}

export default function ListingDetail({ listing, locale }: ListingDetailProps) {
  const t = useTranslations("listingDetail")
  const macroCategory =
    MACRO_CATEGORY_OPTIONS.find(
      (row) => row.documentType === listing.metadata._type,
    )?.title ?? "—"
  const typology = listingTypologyLabel(
    listing.metadata._type,
    listing.typology,
    locale,
  )
  const priceLabel = formatListingPrice(listing.propertySheet.price, locale)

  const mainImageUrl = getSanityImageUrl(listing.content.mainImage, 1400)
  const mainImageAlt =
    pickLocalizedString(
      listing.content.mainImage?.alt as LocalizedString | undefined,
      locale,
    ) ?? ""

  const cityProvince = [listing.location.city, listing.location.province]
    .filter((part): part is string => typeof part === "string" && part !== "")
    .join(" · ")

  const updatedAt = new Date(listing.metadata._updatedAt).toLocaleString(locale)
  const optionalEntries = Object.entries(
    listing.additionalFields as Record<string, unknown>,
  ).filter(([, value]) => {
    if (value === null || value === undefined || value === "") return false
    if (Array.isArray(value)) return value.length > 0
    if (typeof value === "object")
      return Object.keys(value as object).length > 0
    return true
  })

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
        <p className="text-xs uppercase tracking-wide text-neutral-500">
          {t("badge")}
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-neutral-900 dark:text-white">
          {typology ?? "Immobile"}
        </h1>
        <div className="mt-3 grid gap-3 text-sm text-neutral-700 dark:text-neutral-300 sm:grid-cols-3">
          <div>
            <p className="text-xs text-neutral-500">{t("macroCategory")}</p>
            <p className="font-medium">{macroCategory}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500">{t("typology")}</p>
            <p className="font-medium">{typology ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500">{t("location")}</p>
            <p className="font-medium">{cityProvince || "—"}</p>
          </div>
        </div>
        <div className="mt-3 grid gap-3 text-sm text-neutral-700 dark:text-neutral-300 sm:grid-cols-3">
          <div>
            <p className="text-xs text-neutral-500">{t("price")}</p>
            <p className="font-medium">{priceLabel || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500">{t("surface")}</p>
            <p className="font-medium">
              {listing.propertySheet.commercialAreaSqm} m²
            </p>
          </div>
          <div>
            <p className="text-xs text-neutral-500">{t("updatedAt")}</p>
            <p className="font-medium">{updatedAt}</p>
          </div>
        </div>
      </section>

      {mainImageUrl && (
        <section className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-neutral-100 shadow-sm dark:bg-neutral-900">
            <Image
              src={mainImageUrl}
              alt={mainImageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
              priority
            />
          </div>
        </section>
      )}

      {listing.content.description && (
        <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <PortableTextComponent
              text={listing.content.description}
              locale={locale}
            />
          </div>
        </section>
      )}

      {optionalEntries.length > 0 && (
        <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
          <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
            {optionalEntries.map(([key, value]) => (
              <div key={key}>
                <dt className="text-neutral-500">
                  {formatOptionalFieldLabel(key, locale)}
                </dt>
                <dd className="text-neutral-800 dark:text-neutral-200">
                  {formatOptionalFieldValue(value, locale)}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </div>
  )
}
