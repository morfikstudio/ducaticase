"use client"

import { useTranslations } from "next-intl"

import type { SpecRowData, SpecValue } from "@/lib/listingOptionalSpecs"

import { useGsapReveal } from "@/hooks/useGsapReveal"

import { cn } from "@/utils/classNames"

function translateSlug(
  tSpecs: ReturnType<typeof useTranslations<"listingDetail.specs">>,
  slug: string,
): string {
  const key = `values.${slug}` as const
  return tSpecs.has(key) ? tSpecs(key) : tSpecs("values.unknown")
}

function renderSpecValue(
  v: SpecValue,
  tSpecs: ReturnType<typeof useTranslations<"listingDetail.specs">>,
): string {
  switch (v.kind) {
    case "boolean":
      return tSpecs(v.value ? "booleanYes" : "booleanNo")
    case "slug":
      return translateSlug(tSpecs, v.slug)
    case "sqm":
      return `${v.amount} ${tSpecs("unitSqm")}`
    case "plain":
      return v.text
    case "heating": {
      const typeLabel = translateSlug(tSpecs, v.typeSlug)
      if (v.freeText) {
        return `${typeLabel}: ${v.freeText}`
      }
      return typeLabel
    }
    case "choiceOther": {
      const choiceLabel = translateSlug(tSpecs, v.choiceSlug)
      if (v.freeText) {
        return `${choiceLabel}: ${v.freeText}`
      }
      return choiceLabel
    }
    default:
      return ""
  }
}

type ListingSpecsProps = {
  rows: SpecRowData[]
}

export function ListingSpecs({ rows }: ListingSpecsProps) {
  const { ref: wrapRef } = useGsapReveal()
  const tSpecs = useTranslations("listingDetail.specs")

  const visibleRows = rows.filter(
    (row) => !(row.value.kind === "boolean" && !row.value.value),
  )

  if (visibleRows.length === 0) {
    return null
  }

  return (
    <div ref={wrapRef} className="w-full" style={{ opacity: 0 }}>
      <h2 className="type-heading-2 text-primary">{tSpecs("title")}</h2>

      <dl className={cn("mt-6 min-w-0", "md:columns-2 md:gap-x-6")}>
        {visibleRows.map((row, index) => (
          <div
            key={`${row.label}-${index}`}
            className={cn(
              "flex flex-row items-baseline justify-between gap-4",
              "border-b border-dark py-5",
              "-mx-6 px-6 md:mx-0 md:px-8",
              "break-inside-avoid",
            )}
          >
            <dt className="type-body-2 shrink-0 text-gray">{row.label}</dt>
            <dd className="type-body-2 min-w-0 text-right text-primary wrap-break-word">
              {renderSpecValue(row.value, tSpecs)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
