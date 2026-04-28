import type { AppLocale } from "@/i18n/routing"
import type { LISTING_BY_ID_QUERY_RESULT } from "@/sanity/types"
import {
  FLOOR_OPTION_LABELS_EN,
  FLOOR_OPTIONS,
  OPTIONAL_FIELD_LABELS,
} from "@/sanity/lib/constants"
import { listingTypologyLabel } from "@/sanity/lib/listingTypologyLabel"

export type SpecValue =
  | { kind: "boolean"; value: boolean }
  | { kind: "slug"; slug: string }
  | { kind: "heating"; typeSlug: string; freeText?: string }
  | { kind: "choiceOther"; choiceSlug: string; freeText?: string }
  | { kind: "sqm"; amount: number }
  | { kind: "plain"; text: string }

export type SpecRowData = {
  label: string
  value: SpecValue
}

type ListingQuery = NonNullable<LISTING_BY_ID_QUERY_RESULT>

export type ListingDocumentType = ListingQuery["metadata"]["_type"]

type AdditionalFieldsSource = ListingQuery["additionalFields"]

type PropertySheetSource = ListingQuery["propertySheet"]
type TypologySource = ListingQuery["typology"]

const SQM_FIELD_KEYS = new Set<string>([
  "outdoorAreaSqm",
  "shedAreaSqm",
  "officeAreaSqm",
  "landAreaSqm",
])

function fieldLabel(fieldKey: string, locale: AppLocale): string {
  const entry = OPTIONAL_FIELD_LABELS[fieldKey]
  if (entry) {
    return locale === "it" ? entry.it : entry.en
  }
  return fieldKey
}

/**
 * Field order matches the Studio "Campi opzionali" group and `LISTING_BY_ID_QUERY` projections.
 */
export const OPTIONAL_FIELD_ORDER_BY_LISTING_TYPE = {
  listingResidential: [
    "furnishing",
    "garden",
    "carBox",
    "parkingSpaces",
    "hasBalcony",
    "hasTerrace",
    "hasCellar",
    "hasAtticRoom",
    "hasTavern",
    "hasAlarmSystem",
    "pool",
    "hasTennisCourt",
    "hasAccessibleAccess",
    "climateControl",
  ],
  listingCountryHouses: [
    "outdoorAreaSqm",
    "furnishing",
    "garden",
    "carBox",
    "parkingSpaces",
    "hasBalcony",
    "hasTerrace",
    "hasCellar",
    "hasAtticRoom",
    "hasTavern",
    "hasAlarmSystem",
    "pool",
    "hasTennisCourt",
    "hasAccessibleAccess",
    "climateControl",
    "condoFees",
  ],
  listingShopsAndOffices: [
    "furnishing",
    "hasAccessibleRestroom",
    "hasFlue",
    "hasFireProtectionSystem",
    "hasLoadingUnloading",
    "hasDrivewayAccess",
    "parkingSpaces",
    "hasAlarmSystem",
    "hasAccessibleAccess",
    "climateControl",
    "conciergeServiceShops",
    "officeLayout",
    "condoFees",
  ],
  listingIndustrial: [
    "hasLoadingDocks",
    "hasOverheadCranes",
    "shedAreaSqm",
    "officeAreaSqm",
    "landAreaSqm",
    "hasChangingRoom",
    "hasFencedProperty",
    "conciergeService",
    "hasAccessibleRestroom",
    "hasLoadingUnloading",
    "hasDrivewayAccess",
    "hasDrivableAccess",
    "parkingSpaces",
    "hasAlarmSystem",
    "hasAccessibleAccess",
    "climateControl",
    "heating",
  ],
  listingHospitality: [
    "hasAccessibleRestroom",
    "hasFlue",
    "hasFireProtectionSystem",
    "hasLoadingUnloading",
    "hasDrivewayAccess",
    "parkingSpaces",
    "hasAlarmSystem",
    "hasAccessibleAccess",
    "climateControl",
    "outdoorAreaSqm",
    "heating",
    "pool",
    "hasTennisCourt",
    "customSpecifications",
  ],
  listingLand: ["isBuildable", "isAgricultural"],
} as const satisfies Record<ListingDocumentType, readonly string[]>

const PROPERTY_SHEET_ORDER_BY_LISTING_TYPE = {
  listingResidential: [
    "condoFees",
    "floor",
    "conciergeService",
    "buildingYear",
    "heating",
  ],
  listingCountryHouses: ["typology", "floor", "buildingYear", "heating"],
  listingShopsAndOffices: [
    "typology",
    "floor",
    "conciergeService",
    "buildingYear",
    "heating",
  ],
  listingIndustrial: ["typology", "floor", "heightMeters"],
  listingHospitality: ["roomCount"],
  listingLand: ["landAccess", "hasFencedProperty"],
} as const satisfies Record<ListingDocumentType, readonly string[]>

const CURRENCY_SYMBOLS: Record<string, string> = {
  EUR: "€",
  CHF: "CHF",
}

function formatFloor(value: unknown, locale: AppLocale): SpecValue | null {
  if (typeof value !== "string") {
    return null
  }
  const slug = value.trim()
  if (slug === "") {
    return null
  }

  if (/^(?:[1-9]|10)$/.test(slug)) {
    return { kind: "plain", text: slug }
  }

  const itRow = FLOOR_OPTIONS.find((o) => o.value === slug)
  if (locale === "it" && itRow) {
    return { kind: "plain", text: itRow.title }
  }

  const en = FLOOR_OPTION_LABELS_EN[slug]
  if (en) {
    return { kind: "plain", text: en }
  }

  if (itRow) {
    return { kind: "plain", text: itRow.title }
  }

  return { kind: "plain", text: slug }
}

function formatHeightMeters(value: unknown): SpecValue | null {
  if (
    value === undefined ||
    value === null ||
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    return null
  }
  return { kind: "plain", text: `${value} m` }
}

function formatBuildingYear(value: unknown): SpecValue | null {
  if (
    value === undefined ||
    value === null ||
    typeof value !== "number" ||
    !Number.isInteger(value)
  ) {
    return null
  }
  return { kind: "plain", text: String(value) }
}

function formatRoomCount(value: unknown): SpecValue | null {
  if (
    value === undefined ||
    value === null ||
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    !Number.isInteger(value) ||
    value < 1
  ) {
    return null
  }
  return { kind: "plain", text: String(value) }
}

function formatTypologyPlain(
  listingType: ListingDocumentType,
  typology: TypologySource,
  locale: AppLocale,
): SpecValue | null {
  if (typology == null) {
    return null
  }
  if (typeof typology !== "string" || typology.trim() === "") {
    return null
  }
  const label = listingTypologyLabel(listingType, typology, locale)
  return label ? { kind: "plain", text: label } : null
}

function getPropertySheetRaw(
  key: string,
  propertySheet: PropertySheetSource | null | undefined,
  typology: TypologySource,
): unknown {
  if (key === "typology") {
    return typology
  }

  if (propertySheet === null || propertySheet === undefined) {
    return undefined
  }

  if (typeof propertySheet !== "object") {
    return undefined
  }

  return (propertySheet as Record<string, unknown>)[key]
}

function formatPropertySheetFieldValue(
  key: string,
  raw: unknown,
  listingType: ListingDocumentType,
  locale: AppLocale,
): SpecValue | null {
  switch (key) {
    case "typology":
      return formatTypologyPlain(listingType, raw as TypologySource, locale)
    case "condoFees": {
      const text = formatCondoFeesPlain(raw)
      return text ? { kind: "plain", text } : null
    }
    case "heating":
      return parseHeating(raw)
    case "floor":
      return formatFloor(raw, locale)
    case "conciergeService": {
      if (typeof raw !== "string") {
        return null
      }
      const t = raw.trim()
      if (t === "") {
        return null
      }
      return { kind: "slug", slug: t }
    }
    case "buildingYear":
      return formatBuildingYear(raw)
    case "heightMeters":
      return formatHeightMeters(raw)
    case "roomCount":
      return formatRoomCount(raw)
    case "landAccess":
      return parseChoiceOther(raw)
    case "hasFencedProperty": {
      if (typeof raw !== "boolean") {
        return null
      }
      return { kind: "boolean", value: raw }
    }
    default:
      return null
  }
}

export function buildPropertySheetSpecRows(
  listingType: ListingDocumentType,
  propertySheet: PropertySheetSource | null | undefined,
  typology: TypologySource,
  locale: AppLocale,
): SpecRowData[] {
  const order = PROPERTY_SHEET_ORDER_BY_LISTING_TYPE[listingType]

  if (!order) {
    return []
  }

  const rows: SpecRowData[] = []

  for (const key of order) {
    const raw = getPropertySheetRaw(key, propertySheet, typology)

    const value = formatPropertySheetFieldValue(key, raw, listingType, locale)

    if (value === null || specValueIsEmpty(value)) {
      continue
    }

    rows.push({ label: fieldLabel(key, locale), value })
  }

  return rows
}

function parseHeating(value: unknown): SpecValue | null {
  if (value === null || value === undefined || typeof value !== "object") {
    return null
  }
  const o = value as Record<string, unknown>
  const heatingType = o.heatingType
  if (
    heatingType === undefined ||
    heatingType === null ||
    (typeof heatingType === "string" && heatingType.trim() === "")
  ) {
    return null
  }
  const typeSlug = String(heatingType).trim()
  const other =
    typeof o.heatingOther === "string" && o.heatingOther.trim() !== ""
      ? o.heatingOther.trim()
      : undefined
  return { kind: "heating", typeSlug, freeText: other }
}

function parseChoiceOther(value: unknown): SpecValue | null {
  if (value === null || value === undefined || typeof value !== "object") {
    return null
  }
  const o = value as Record<string, unknown>
  const choice = o.choice
  if (
    choice === undefined ||
    choice === null ||
    (typeof choice === "string" && choice.trim() === "")
  ) {
    return null
  }
  const choiceSlug = String(choice).trim()
  const freeText =
    typeof o.otherSpecification === "string" &&
    o.otherSpecification.trim() !== ""
      ? o.otherSpecification.trim()
      : undefined
  return { kind: "choiceOther", choiceSlug, freeText }
}

function formatCondoFeesPlain(value: unknown): string | null {
  if (value === null || value === undefined || typeof value !== "object") {
    return null
  }

  const o = value as Record<string, unknown>
  const amount = o.condoFeesAmount

  if (
    amount === undefined ||
    amount === null ||
    typeof amount !== "number" ||
    !Number.isFinite(amount)
  ) {
    return null
  }

  const currency = o.condoFeesCurrency

  if (typeof currency === "string" && currency.trim() !== "") {
    const symbol = CURRENCY_SYMBOLS[currency.trim()] ?? currency.trim()
    const formattedAmount = amount.toFixed(2)
    return `${formattedAmount} ${symbol}`
  }

  return String(amount)
}

type CustomSpecItem = {
  label?: string | null
  valueKind?: string | null
  textValue?: string | null
  numberValue?: number | null
}

function formatCustomSpecificationsPlain(value: unknown): string | null {
  if (!Array.isArray(value) || value.length === 0) {
    return null
  }
  const parts: string[] = []
  for (const item of value) {
    if (item === null || typeof item !== "object") continue
    const row = item as CustomSpecItem
    const label = typeof row.label === "string" ? row.label.trim() : ""
    let val = ""
    if (row.valueKind === "number") {
      const n = row.numberValue
      val =
        n !== undefined &&
        n !== null &&
        typeof n === "number" &&
        Number.isFinite(n)
          ? String(n)
          : ""
    } else {
      val = typeof row.textValue === "string" ? row.textValue.trim() : ""
    }
    if (label && val) {
      parts.push(`${label}: ${val}`)
    } else if (label) {
      parts.push(label)
    } else if (val) {
      parts.push(val)
    }
  }
  return parts.length > 0 ? parts.join("; ") : null
}

function formatOptionalFieldValue(
  fieldKey: string,
  raw: unknown,
): SpecValue | null {
  if (raw === null || raw === undefined) {
    return null
  }

  if (typeof raw === "boolean") {
    return { kind: "boolean", value: raw }
  }

  if (typeof raw === "number") {
    if (!Number.isFinite(raw)) {
      return null
    }
    return SQM_FIELD_KEYS.has(fieldKey)
      ? { kind: "sqm", amount: raw }
      : { kind: "plain", text: String(raw) }
  }

  if (typeof raw === "string") {
    const t = raw.trim()
    if (t === "") {
      return null
    }
    return { kind: "slug", slug: t }
  }

  if (typeof raw !== "object") {
    return null
  }

  if (Array.isArray(raw)) {
    if (fieldKey === "customSpecifications") {
      const text = formatCustomSpecificationsPlain(raw)
      return text ? { kind: "plain", text } : null
    }
    return null
  }

  if (fieldKey === "heating") {
    return parseHeating(raw)
  }

  if (fieldKey === "carBox" || fieldKey === "parkingSpaces") {
    return parseChoiceOther(raw)
  }

  if (fieldKey === "condoFees") {
    const text = formatCondoFeesPlain(raw)
    return text ? { kind: "plain", text } : null
  }

  return null
}

function specValueIsEmpty(v: SpecValue): boolean {
  switch (v.kind) {
    case "plain":
      return v.text.trim() === ""
    case "slug":
      return v.slug.trim() === ""
    case "sqm":
      return !Number.isFinite(v.amount)
    case "boolean":
      return false
    case "heating":
      return v.typeSlug.trim() === ""
    case "choiceOther":
      return v.choiceSlug.trim() === ""
    default:
      return true
  }
}

export function buildOptionalSpecRows(
  listingType: ListingDocumentType,
  additionalFields: AdditionalFieldsSource | null | undefined,
  locale: AppLocale,
): SpecRowData[] {
  if (additionalFields === null || additionalFields === undefined) {
    return []
  }

  const order = OPTIONAL_FIELD_ORDER_BY_LISTING_TYPE[listingType]

  if (!order) {
    return []
  }

  const data = additionalFields as Record<string, unknown>
  const rows: SpecRowData[] = []

  for (const key of order) {
    const raw = data[key]
    const value = formatOptionalFieldValue(key, raw)

    if (value === null || specValueIsEmpty(value)) {
      continue
    }

    rows.push({ label: fieldLabel(key, locale), value })
  }

  return rows
}
