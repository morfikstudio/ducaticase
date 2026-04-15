"use client"

import { useEffect, useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import { useTranslations } from "next-intl"

import type { AppLocale } from "@/i18n/routing"
import { pickLocalizedString } from "@/sanity/lib/locale"
import type { LISTING_BY_ID_QUERY_RESULT } from "@/sanity/types"
import { prefersReducedMotion } from "@/utils/reducedMotion"

import { cn } from "@/utils/classNames"
import { formatListingPrice } from "@/lib/formatListingPrice"

import { Button } from "@/components/ui/Button"

type Listing = NonNullable<LISTING_BY_ID_QUERY_RESULT>

type ListingDetailHeaderProps = {
  content: Listing["content"]
  location: Listing["location"]
  propertySheet: Listing["propertySheet"]
  metadata: Listing["metadata"]
  locale: AppLocale
}

function buildLocationText(location: Listing["location"]): string | null {
  const address = location?.address
  const street = [address?.streetName, address?.streetNumber]
    .map((p) => (typeof p === "string" ? p.trim() : ""))
    .filter(Boolean)
    .join(" ")

  const city = location?.city?.trim()
  const province = location?.province?.trim()
  const cityWithProvince =
    city && province
      ? `${city} (${province})`
      : city || (province ? `(${province})` : "")

  return [street, cityWithProvince].filter(Boolean).join(" · ") || null
}

export function ListingDetailHeader({
  content,
  location,
  propertySheet,
  metadata,
  locale,
}: ListingDetailHeaderProps) {
  const t = useTranslations("listingDetail")
  const sectionRef = useRef<HTMLElement>(null)

  const title = pickLocalizedString(content.title, locale)
  const locationText = buildLocationText(location)
  const price = formatListingPrice(
    propertySheet?.price,
    locale,
    metadata.listingContractType as "sale" | "rent" | null,
  )

  const sqm = propertySheet?.commercialAreaSqm
  const specParts = [
    sqm ? `${sqm} ${t("squareMeters")}` : null,
    `Placeholder 1`,
    `Placeholder 2`,
  ].filter(Boolean)

  /* Initial state */
  useLayoutEffect(() => {
    if (!sectionRef.current) {
      return
    }

    gsap.set(sectionRef.current, { opacity: 0, y: 20 })
  }, [])

  /* Entry animation */
  useEffect(() => {
    if (!sectionRef.current) {
      return
    }

    if (prefersReducedMotion()) {
      gsap.set(sectionRef.current, { opacity: 1, y: 0 })
      return
    }

    gsap.to(sectionRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power2.out",
    })
  }, [])

  return (
    <section ref={sectionRef} className="w-full" style={{ opacity: 0 }}>
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
                "type-listing-card-title md:type-heading-1",
                "text-primary",
                "w-full md:w-1/2",
              )}
            >
              {title}
            </h1>
          ) : null}

          {price ? (
            <p
              className={cn(
                "type-body-1 md:type-heading-1",
                "text-primary",
                "w-full md:w-1/2 md:text-right",
              )}
            >
              {price}
            </p>
          ) : null}
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
              <p className="type-body-2 md:type-body-1 text-primary">
                {locationText}
              </p>

              {specParts.length > 0 ? (
                <p className="type-body-2 text-primary">
                  {specParts.join(" | ")}
                </p>
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
              type="button"
              variant="primary"
              onClick={() => console.log("bookVisit")}
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
