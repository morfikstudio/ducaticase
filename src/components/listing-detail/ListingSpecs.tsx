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
  highlightRows?: string[]
}

export function ListingSpecs({ rows, highlightRows = [] }: ListingSpecsProps) {
  const { ref: wrapRef } = useGsapReveal()
  const tSpecs = useTranslations("listingDetail.specs")

  const visibleRows = rows.filter(
    (row) => !(row.value.kind === "boolean" && !row.value.value),
  )

  if (highlightRows.length === 0 && visibleRows.length === 0) {
    return null
  }

  return (
    <div ref={wrapRef} className="w-full" style={{ opacity: 0 }}>
      <h2 className="type-heading-2">{tSpecs("title")}</h2>

      {highlightRows.length > 0 ? (
        <div className="pt-12 pb-8 flex flex-col gap-4 md:flex-row md:items-center">
          <div className="type-body-2 uppercase font-medium">Highlights</div>
          <ul className="list-none flex gap-2 flex-wrap">
            {highlightRows.map((text, index) => (
              <li
                key={`${text}-${index}`}
                className={cn(
                  "whitespace-nowrap",
                  "type-body-3",
                  "inline-flex items-center justify-between",
                  "border border-[#5D5D5D] rounded-full px-5 py-2",
                )}
              >
                {text}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {visibleRows.length > 0 ? (
        <dl
          className={cn(
            "min-w-0",
            highlightRows.length === 0 && "mt-6",
            "md:columns-2 md:gap-x-6",
          )}
        >
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
              <dd className="type-body-2 min-w-0 text-right wrap-break-word">
                {renderSpecValue(row.value, tSpecs)}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
    </div>
  )
}
