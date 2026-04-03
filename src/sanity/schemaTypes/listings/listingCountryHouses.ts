import { ALL_FIELDS_GROUP, defineType } from "sanity"

import { listingPreview } from "./shared"

import {
  buildingYearField,
  commercialAreaSqmField,
  energyClassField,
  floorField,
  heatingField,
} from "../fields"

export const listingCountryHouses = defineType({
  name: "listingCountryHouses",
  title: "Dimore oltre la città",
  type: "document",
  groups: [
    { name: "propertySheet", title: "Scheda immobile", default: true },
    { ...ALL_FIELDS_GROUP, hidden: true },
  ],
  fields: [
    commercialAreaSqmField({ required: true, group: "propertySheet" }),
    floorField({ required: true, group: "propertySheet" }),
    buildingYearField({ required: true, group: "propertySheet" }),
    heatingField({ required: true, group: "propertySheet" }),
    energyClassField({ required: true, group: "propertySheet" }),
  ],
  preview: listingPreview(),
})
