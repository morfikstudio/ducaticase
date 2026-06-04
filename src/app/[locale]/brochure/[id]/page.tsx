import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"

import type { AppLocale } from "@/i18n/routing"
import { sanityFetch } from "@/sanity/lib/client"
import { LISTING_BY_ID_QUERY } from "@/sanity/lib/queries"
import { pickLocalizedString } from "@/sanity/lib/locale"
import type { LISTING_BY_ID_QUERY_RESULT } from "@/sanity/types"

import {
  buildOptionalSpecRows,
  buildPropertySheetSpecRows,
  type SpecValue,
} from "@/lib/listingOptionalSpecs"
import {
  Brochure,
  type FormattedSpecRow,
} from "@/components/brochure/Brochure"

export const dynamic = "force-dynamic"

type Props = {
  params: Promise<{ locale: string; id: string }>
}

export const metadata = {
  robots: { index: false, follow: false },
}

function renderSpecValue(
  v: SpecValue,
  tSpecs: (k: string) => string,
  tSpecsHas: (k: string) => boolean,
): string {
  const translateSlug = (slug: string) => {
    const key = `values.${slug}`
    return tSpecsHas(key) ? tSpecs(key) : tSpecs("values.unknown")
  }
  switch (v.kind) {
    case "boolean":
      return tSpecs(v.value ? "booleanYes" : "booleanNo")
    case "slug":
      return translateSlug(v.slug)
    case "sqm":
      return `${v.amount} ${tSpecs("unitSqm")}`
    case "plain":
      return v.text
    case "heating": {
      const label = translateSlug(v.typeSlug)
      return v.freeText ? `${label}: ${v.freeText}` : label
    }
    case "choiceOther": {
      const label = translateSlug(v.choiceSlug)
      return v.freeText ? `${label}: ${v.freeText}` : label
    }
  }
}

export default async function BrochurePage({ params }: Props) {
  const { locale: localeParam, id } = await params
  const locale = localeParam as AppLocale

  const listing = (await sanityFetch({
    query: LISTING_BY_ID_QUERY,
    params: { id },
    revalidate: 0,
  })) as LISTING_BY_ID_QUERY_RESULT

  if (!listing) notFound()

  const [t, tSpecs, tCountries] = await Promise.all([
    getTranslations({ locale, namespace: "listingDetail" }),
    getTranslations({ locale, namespace: "listingDetail.specs" }),
    getTranslations({ locale, namespace: "listingDetail.countries" }),
  ])

  const propertyRows = buildPropertySheetSpecRows(
    listing.metadata._type,
    listing.propertySheet,
    listing.typology,
    locale,
  )
  const optionalRows = buildOptionalSpecRows(
    listing.metadata._type,
    listing.additionalFields,
    locale,
  )
  const tSpecsHas = (k: string) =>
    (tSpecs as unknown as { has: (k: string) => boolean }).has(k)

  const specRows: FormattedSpecRow[] = [...propertyRows, ...optionalRows]
    .filter((row) => !(row.value.kind === "boolean" && !row.value.value))
    .map((row) => ({
      label: row.label,
      value: renderSpecValue(row.value, (k) => tSpecs(k), tSpecsHas),
    }))

  const highlightsRaw = listing.additionalFields?.highlights
  const highlights = Array.isArray(highlightsRaw)
    ? highlightsRaw
        .map((entry) => pickLocalizedString(entry, locale)?.trim())
        .filter((s): s is string => Boolean(s))
    : []

  const countries: Record<string, string> = {}
  for (const code of ["IT", "AT", "FR", "DE", "MC", "NL", "ES", "CH"]) {
    countries[code] = tCountries(code)
  }

  const messages = {
    tagline: "Boutique del real estate dal 1989",
    features: tSpecs("title"),
    highlights: "HIGH LIGHTS",
    energyEfficiency: t("energyEfficiency"),
    energyNotClassifiable: t("energyClassNotClassifiable"),
    energyInProgress: t("energyClassInProgress"),
    position: t("positionInfoTitle"),
    squareMeters: t("squareMeters"),
    rentPriceLabel: t("rentPriceLabel"),
    followUsPrefix: t("brochureFollowUsPrefix"),
    followUsSuffix: t("brochureFollowUsSuffix"),
    countries,
  }

  return (
    <Brochure
      listing={listing}
      locale={locale}
      messages={messages}
      specRows={specRows}
      highlights={highlights}
    />
  )
}
