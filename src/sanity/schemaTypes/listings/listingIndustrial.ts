import { ALL_FIELDS_GROUP, defineType } from "sanity"

import { INDUSTRIAL_TYPOLOGY_OPTIONS } from "../../lib/constants"
import {
  FIELD_REQUIRED_IT,
  INVALID_VALUE_MESSAGE_IT,
} from "../../lib/validationMessages"
import { listingPreview } from "./shared"

import {
  addressField,
  buildingYearField,
  cityField,
  countryField,
  climateControlField,
  commercialAreaSqmField,
  conciergeServiceField,
  descriptionField,
  energyClassField,
  excerptField,
  floorField,
  floorPlansField,
  heightMetersField,
  hasAccessibleAccessField,
  hasAccessibleRestroomField,
  hasAlarmSystemField,
  hasDrivewayAccessField,
  hasChangingRoomField,
  hasDrivableAccessField,
  hasFencedPropertyField,
  hasLoadingDocksField,
  hasLoadingUnloadingField,
  hasOverheadCranesField,
  heatingField,
  industrialTypologyField,
  isArchivedField,
  listingContractTypeField,
  listingSearchTokensField,
  listingTitleField,
  landAreaSqmField,
  officeAreaSqmField,
  mainImageField,
  parkingSpacesField,
  priceField,
  postalCodeField,
  provinceField,
  shedAreaSqmField,
} from "../fields"

type IndustrialDoc = {
  industrialTypology?: string
} | null

export const listingIndustrial = defineType({
  name: "listingIndustrial",
  title: "Industriale",
  type: "document",
  groups: [
    { name: "propertySheet", title: "Scheda immobile", default: true },
    { name: "optionals", title: "Campi opzionali" },
    { name: "location", title: "Località" },
    { name: "content", title: "Contenuto" },
    { name: "floorPlans", title: "Planimetrie" },
    { ...ALL_FIELDS_GROUP, hidden: true },
  ],
  fields: [
    /* Scheda immobile */
    isArchivedField({ group: "propertySheet" }),
    listingContractTypeField({ required: true, group: "propertySheet" }),
    listingSearchTokensField({ group: "propertySheet" }),
    priceField({ group: "propertySheet" }),
    industrialTypologyField({ required: true, group: "propertySheet" }),
    commercialAreaSqmField({ required: true, group: "propertySheet" }),
    floorField({ required: true, group: "propertySheet" }),
    heightMetersField({ required: true, group: "propertySheet" }),
    {
      ...buildingYearField({ required: false, group: "propertySheet" }),
      hidden: ({ document }) =>
        (document as IndustrialDoc)?.industrialTypology !== "warehouses",
      validation: (Rule) =>
        Rule.custom((value: number | undefined, context) => {
          const doc = context.document as IndustrialDoc
          if (doc?.industrialTypology !== "warehouses") {
            return true
          }
          if (value === undefined || value === null) {
            return FIELD_REQUIRED_IT
          }
          if (typeof value !== "number") {
            return true
          }
          if (!Number.isInteger(value)) {
            return INVALID_VALUE_MESSAGE_IT
          }
          const currentYear = new Date().getFullYear()
          if (value < 1800 || value > currentYear + 2) {
            return INVALID_VALUE_MESSAGE_IT
          }
          return true
        }),
    },
    energyClassField({ required: true, group: "propertySheet" }),
    /* Località */
    countryField({ required: true, group: "location" }),
    provinceField({ required: true, group: "location" }),
    cityField({ required: true, group: "location" }),
    addressField({ group: "location" }),
    postalCodeField({ group: "location" }),
    /* Contenuto */
    listingTitleField({ group: "content" }),
    mainImageField({ required: true, group: "content" }),
    excerptField({ group: "content" }),
    descriptionField({ group: "content" }),
    /* Planimetrie */
    floorPlansField({ group: "floorPlans" }),
    /* Campi opzionali (solo per Capannoni) */
    {
      ...hasLoadingDocksField({ group: "optionals", required: false }),
      hidden: ({ document }) =>
        (document as IndustrialDoc)?.industrialTypology !== "sheds",
    },
    {
      ...hasOverheadCranesField({ group: "optionals", required: false }),
      hidden: ({ document }) =>
        (document as IndustrialDoc)?.industrialTypology !== "sheds",
    },
    {
      ...shedAreaSqmField({ group: "optionals", required: false }),
      hidden: ({ document }) =>
        (document as IndustrialDoc)?.industrialTypology !== "sheds",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const doc = context.document as IndustrialDoc
          if (doc?.industrialTypology !== "sheds") {
            return true
          }
          if (value === undefined || value === null) {
            return true
          }
          return typeof value !== "number" ||
            !Number.isFinite(value) ||
            value <= 0
            ? INVALID_VALUE_MESSAGE_IT
            : true
        }),
    },
    {
      ...officeAreaSqmField({ group: "optionals", required: false }),
      hidden: ({ document }) =>
        (document as IndustrialDoc)?.industrialTypology !== "sheds",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const doc = context.document as IndustrialDoc
          if (doc?.industrialTypology !== "sheds") {
            return true
          }
          if (value === undefined || value === null) {
            return true
          }
          return typeof value !== "number" ||
            !Number.isFinite(value) ||
            value <= 0
            ? INVALID_VALUE_MESSAGE_IT
            : true
        }),
    },
    {
      ...landAreaSqmField({ group: "optionals", required: false }),
      hidden: ({ document }) =>
        (document as IndustrialDoc)?.industrialTypology !== "sheds",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const doc = context.document as IndustrialDoc
          if (doc?.industrialTypology !== "sheds") {
            return true
          }
          if (value === undefined || value === null) {
            return true
          }
          return typeof value !== "number" ||
            !Number.isFinite(value) ||
            value <= 0
            ? INVALID_VALUE_MESSAGE_IT
            : true
        }),
    },
    {
      ...hasChangingRoomField({ group: "optionals", required: false }),
      hidden: ({ document }) =>
        (document as IndustrialDoc)?.industrialTypology !== "sheds",
    },
    {
      ...hasFencedPropertyField({ group: "optionals", required: false }),
      hidden: ({ document }) =>
        (document as IndustrialDoc)?.industrialTypology !== "sheds",
    },
    {
      ...conciergeServiceField({ group: "optionals", required: false }),
      hidden: ({ document }) =>
        (document as IndustrialDoc)?.industrialTypology !== "sheds",
    },
    /* Campi opzionali (Magazzini e Capannoni) */
    hasAccessibleRestroomField({ group: "optionals" }),
    {
      ...hasLoadingUnloadingField({ group: "optionals", required: false }),
      hidden: ({ document }) =>
        (document as IndustrialDoc)?.industrialTypology === "sheds",
    },
    hasDrivewayAccessField({ group: "optionals" }),
    hasDrivableAccessField({ group: "optionals" }),
    parkingSpacesField({ group: "optionals" }),
    hasAlarmSystemField({ group: "optionals" }),
    hasAccessibleAccessField({ group: "optionals" }),
    climateControlField({ group: "optionals" }),
    heatingField({ group: "optionals" }),
  ],
  preview: listingPreview({
    typologyField: "industrialTypology",
    typologyOptions: INDUSTRIAL_TYPOLOGY_OPTIONS,
  }),
})
