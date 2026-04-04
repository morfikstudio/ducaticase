import { ALL_FIELDS_GROUP, defineType } from "sanity"

import { listingPreview } from "./shared"

import {
  addressField,
  cityField,
  countryField,
  climateControlField,
  commercialAreaSqmField,
  customSpecificationsField,
  descriptionField,
  energyClassField,
  excerptField,
  floorPlansField,
  hasAccessibleAccessField,
  hasAccessibleRestroomField,
  hasFireProtectionSystemField,
  hasFlueField,
  hasAlarmSystemField,
  hasDrivewayAccessField,
  hasLoadingUnloadingField,
  hasTennisCourtField,
  heatingField,
  mainImageField,
  parkingSpacesField,
  poolField,
  postalCodeField,
  provinceField,
  outdoorAreaSqmField,
  roomCountField,
} from "../fields"

export const listingHospitality = defineType({
  name: "listingHospitality",
  title: "Hospitality",
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
    commercialAreaSqmField({ required: true, group: "propertySheet" }),
    roomCountField({ required: true, group: "propertySheet" }),
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
    hasAccessibleRestroomField({ group: "optionals" }),
    hasFlueField({ group: "optionals" }),
    hasFireProtectionSystemField({ group: "optionals" }),
    hasLoadingUnloadingField({ group: "optionals" }),
    hasDrivewayAccessField({ group: "optionals" }),
    parkingSpacesField({ group: "optionals" }),
    hasAlarmSystemField({ group: "optionals" }),
    hasAccessibleAccessField({ group: "optionals" }),
    climateControlField({ group: "optionals" }),
    outdoorAreaSqmField({ group: "optionals" }),
    heatingField({ group: "optionals" }),
    poolField({ group: "optionals" }),
    hasTennisCourtField({ group: "optionals" }),
    customSpecificationsField({ group: "optionals" }),
  ],
  preview: listingPreview(),
})
