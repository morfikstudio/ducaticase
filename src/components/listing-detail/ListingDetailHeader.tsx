"use client"

import { useTranslations } from "next-intl"

import type { AppLocale } from "@/i18n/routing"
import { listingContractTypeLabel } from "@/sanity/lib/listingContractTypeLabel"
import { listingTypologyLabel } from "@/sanity/lib/listingTypologyLabel"
import { pickLocalizedString } from "@/sanity/lib/locale"
import { parseListingLocationCountryCode } from "@/sanity/lib/constants"
import type { LISTING_BY_ID_QUERY_RESULT } from "@/sanity/types"

import { useGsapReveal } from "@/hooks/useGsapReveal"

import { buildListingLocationText } from "@/lib/buildListingLocationText"
import { formatListingPrice } from "@/lib/formatListingPrice"
import { cn } from "@/utils/classNames"

import { Button } from "@/components/ui/Button"

type Listing = NonNullable<LISTING_BY_ID_QUERY_RESULT>

type ListingDetailHeaderProps = {
  content: Listing["content"]
  location: Listing["location"]
  propertySheet: Listing["propertySheet"]
  metadata: Listing["metadata"]
  typology: Listing["typology"]
  locale: AppLocale
}

export function ListingDetailHeader({
  content,
  location,
  propertySheet,
  metadata,
  typology,
  locale,
}: ListingDetailHeaderProps) {
  const { ref: wrapRef } = useGsapReveal({ delay: 0.2 })
  const t = useTranslations("listingDetail")
  const tCountries = useTranslations("listingDetail.countries")

  const title = pickLocalizedString(content.title, locale)
  const countryCode = parseListingLocationCountryCode(location?.country)
  const countryLabel = countryCode ? tCountries(countryCode) : null
  const locationText = buildListingLocationText(location, countryLabel)
  const price = formatListingPrice(
    propertySheet?.price,
    locale,
    metadata.listingContractType as "sale" | "rent" | null,
  )

  const sqm = propertySheet?.commercialAreaSqm
  const contractLabel = listingContractTypeLabel(
    metadata.listingContractType,
    locale,
  )
  const showContractLabel =
    contractLabel && metadata.listingContractType === "rent"
  const typologyLabel = listingTypologyLabel(metadata._type, typology, locale)
  const specParts = [
    typologyLabel,
    sqm ? `${sqm} ${t("squareMeters")}` : null,
  ].filter(Boolean)

  return (
    <section ref={wrapRef} className="w-full" style={{ opacity: 0 }}>
      <div className="flex flex-col items-start justify-between gap-4">
        <div
          className={cn(
            "w-full",
            "flex flex-col gap-4",
            "md:flex-row md:justify-between",
          )}
        >
          {title ? (
            <h1
              className={cn(
                "type-listing-card-title md:type-heading-2",
                "w-full md:w-1/2",
              )}
            >
              {title}
            </h1>
          ) : null}

          <div
            className={cn(
              "w-full md:w-1/2 md:text-right",
              "flex gap-2 md:justify-end",
            )}
          >
            {price ? (
              <p className={cn("type-body-1 md:type-heading-2")}>{price}</p>
            ) : null}

            {showContractLabel ? (
              <p className="type-body-1 md:type-heading-2">({contractLabel})</p>
            ) : null}
          </div>
        </div>

        <div
          className={cn(
            "w-full",
            "flex flex-col gap-4",
            "md:flex-row md:justify-between md:items-end",
          )}
        >
          {locationText ? (
            <div className="flex flex-col gap-2">
              <p className="type-body-2 md:type-body-1">{locationText}</p>

              {specParts.length > 0 ? (
                <p className="type-body-2">{specParts.join(" | ")}</p>
              ) : null}
            </div>
          ) : null}

          <div
            className={cn(
              "flex flex-col items-center gap-4",
              "md:flex-row md:items-start",
            )}
          >
            <Button
              type="button"
              variant="primary"
              icon="download"
              iconPosition="end"
              onClick={() => console.log("downloadBrochure")}
              highlight
              className="w-full md:w-auto"
            >
              {t("downloadBrochure")}
            </Button>

            <Button
              href="/contact"
              variant="primary"
              className="w-full md:w-auto"
            >
              {t("bookVisit")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
