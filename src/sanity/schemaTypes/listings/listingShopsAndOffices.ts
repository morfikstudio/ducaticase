import { ALL_FIELDS_GROUP, defineType } from "sanity"

import { SHOPS_AND_OFFICES_TYPOLOGY_OPTIONS } from "../../lib/constants"
import { FIELD_REQUIRED_IT } from "../../lib/validationMessages"
import { listingPreview } from "./shared"

import {
  addressField,
  buildingYearField,
  cityField,
  countryField,
  climateControlField,
  commercialAreaSqmField,
  conciergeServiceField,
  condoFeesField,
  descriptionField,
  displayWindowsField,
  energyClassField,
  excerptField,
  floorField,
  floorPlansField,
  furnishingField,
  hasAccessibleAccessField,
  hasAccessibleRestroomField,
  hasAlarmSystemField,
  hasDrivewayAccessField,
  hasFireProtectionSystemField,
  hasFlueField,
  hasLoadingUnloadingField,
  heatingField,
  mainImageField,
  officeLayoutField,
  parkingSpacesField,
  postalCodeField,
  provinceField,
  shopsAndOfficesTypologyField,
} from "../fields"

type ShopsAndOfficesDoc = {
  shopsAndOfficesTypology?: string
} | null

function isOfficesTypology(doc: ShopsAndOfficesDoc): boolean {
  return doc?.shopsAndOfficesTypology === "offices"
}

export const listingShopsAndOffices = defineType({
  name: "listingShopsAndOffices",
  title: "Negozi e uffici",
  type: "document",
  groups: [
    { name: "propertySheet", title: "Scheda immobile", default: true },
    { name: "location", title: "Località" },
    { name: "content", title: "Contenuto" },
    { name: "floorPlans", title: "Planimetrie" },
    { name: "optionals", title: "Campi aggiuntivi" },
    { ...ALL_FIELDS_GROUP, hidden: true },
  ],
  fields: [
    /* Scheda immobile */
    shopsAndOfficesTypologyField({ required: true, group: "propertySheet" }),
    commercialAreaSqmField({ required: true, group: "propertySheet" }),
    floorField({ required: true, group: "propertySheet" }),
    {
      ...displayWindowsField({ group: "propertySheet" }),
      hidden: ({ document }) =>
        (document as ShopsAndOfficesDoc)?.shopsAndOfficesTypology !== "shops",
    },
    {
      ...conciergeServiceField({ group: "propertySheet", required: false }),
      hidden: ({ document }) =>
        (document as ShopsAndOfficesDoc)?.shopsAndOfficesTypology !== "offices",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const doc = context.document as ShopsAndOfficesDoc
          if (!isOfficesTypology(doc)) {
            return true
          }
          if (
            value === undefined ||
            value === null ||
            (typeof value === "string" && value.trim() === "")
          ) {
            return FIELD_REQUIRED_IT
          }
          return true
        }),
    },
    buildingYearField({ required: true, group: "propertySheet" }),
    heatingField({ required: true, group: "propertySheet" }),
    energyClassField({ required: true, group: "propertySheet" }),
    /* Località */
    countryField({ required: true, group: "location" }),
    provinceField({ required: true, group: "location" }),
    cityField({ required: true, group: "location" }),
    addressField({ group: "location" }),
    postalCodeField({ group: "location" }),
    /* Contenuto */
    mainImageField({ required: true, group: "content" }),
    descriptionField({ group: "content" }),
    excerptField({ group: "content" }),
    /* Planimetrie */
    floorPlansField({ group: "floorPlans" }),
    /* Campi aggiuntivi */
    furnishingField({ group: "optionals" }),
    hasAccessibleRestroomField({ group: "optionals" }),
    hasFlueField({ group: "optionals" }),
    hasFireProtectionSystemField({ group: "optionals" }),
    hasLoadingUnloadingField({ group: "optionals" }),
    hasDrivewayAccessField({ group: "optionals" }),
    parkingSpacesField({ group: "optionals" }),
    hasAlarmSystemField({ group: "optionals" }),
    hasAccessibleAccessField({ group: "optionals" }),
    climateControlField({ group: "optionals" }),
    {
      ...conciergeServiceField({
        name: "conciergeServiceShops",
        group: "optionals",
        required: false,
      }),
      hidden: ({ document }) =>
        (document as ShopsAndOfficesDoc)?.shopsAndOfficesTypology !== "shops",
    },
    {
      ...officeLayoutField({ required: false, group: "optionals" }),
      hidden: ({ document }) =>
        (document as ShopsAndOfficesDoc)?.shopsAndOfficesTypology !== "offices",
    },
    condoFeesField({ group: "optionals" }),
  ],
  preview: listingPreview({
    typologyField: "shopsAndOfficesTypology",
    typologyOptions: SHOPS_AND_OFFICES_TYPOLOGY_OPTIONS,
  }),
})
