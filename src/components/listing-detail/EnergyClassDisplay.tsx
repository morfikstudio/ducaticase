"use client"

import { useTranslations } from "next-intl"

import type { LISTING_BY_ID_QUERY_RESULT } from "@/sanity/types"

import { useGsapReveal } from "@/hooks/useGsapReveal"

import { cn } from "@/utils/classNames"

/** `propertySheet` is a per-typology union; `listingLand` has no `energyClass`. */
type ListingWithEnergyClassField = Extract<
  NonNullable<LISTING_BY_ID_QUERY_RESULT>,
  { propertySheet: { energyClass: unknown } }
>

type EnergyClassDisplayProps = {
  energyClass: ListingWithEnergyClassField["propertySheet"]["energyClass"]
}

const SEGMENTS = ["A", "B", "C", "D", "E", "F", "G"] as const

const SEGMENT_COLORS: Record<string, string> = {
  A: "#31561E",
  B: "#42A236",
  C: "#FAF447",
  D: "#F6B939",
  E: "#EFA133",
  F: "#EB802C",
  G: "#CC2D1D",
}

function getActiveIndex(
  energyClass: NonNullable<EnergyClassDisplayProps["energyClass"]>,
): number | null {
  const scheme = energyClass.energyClassScheme
  if (scheme === "notClassifiable" || scheme === "inProgress") return null

  const rating =
    scheme === "dl192_2005"
      ? energyClass.energyClassRatingDl192
      : energyClass.energyClassRatingLaw90

  if (!rating) return null

  if (
    rating === "A+" ||
    rating === "A" ||
    rating === "A4" ||
    rating === "A3" ||
    rating === "A2" ||
    rating === "A1"
  )
    return 0
  if (rating === "B") return 1
  if (rating === "C") return 2
  if (rating === "D") return 3
  if (rating === "E") return 4
  if (rating === "F") return 5
  if (rating === "G") return 6

  return null
}

function getRatingLabel(
  energyClass: NonNullable<EnergyClassDisplayProps["energyClass"]>,
): string | null {
  const scheme = energyClass.energyClassScheme
  if (!scheme) return null
  if (scheme === "dl192_2005") return energyClass.energyClassRatingDl192 ?? null
  if (scheme === "law90_2013") return energyClass.energyClassRatingLaw90 ?? null
  return null
}

export function EnergyClassDisplay({ energyClass }: EnergyClassDisplayProps) {
  const { ref: wrapRef } = useGsapReveal()
  const t = useTranslations("listingDetail")

  if (!energyClass) {
    return null
  }

  const scheme = energyClass.energyClassScheme
  const activeIndex = getActiveIndex(energyClass)
  const ratingLabel = getRatingLabel(energyClass)

  const isIndeterminate =
    scheme === "notClassifiable" || scheme === "inProgress"

  const valueLabel =
    scheme === "notClassifiable"
      ? t("energyClassNotClassifiable")
      : scheme === "inProgress"
        ? t("energyClassInProgress")
        : (ratingLabel ?? null)

  return (
    <div ref={wrapRef} className="w-full" style={{ opacity: 0 }}>
      <h2 className="type-heading-1 text-primary">
        {t("energyEfficiency")}
        {valueLabel && `: ${valueLabel}`}
      </h2>

      <div className="flex flex-row items-center gap-2 w-full mt-8">
        {SEGMENTS.map((letter, index) => {
          const backgroundColor = SEGMENT_COLORS[letter]
          return isIndeterminate ? (
            <div
              key={letter}
              className="flex-1 opacity-40 h-3"
              style={{ backgroundColor }}
            />
          ) : (
            <div
              key={letter}
              className={cn(
                "h-3",
                activeIndex === index
                  ? "flex-1 opacity-100"
                  : "w-4 md:w-12 opacity-40",
              )}
              style={{ backgroundColor }}
            />
          )
        })}
      </div>
    </div>
  )
}
