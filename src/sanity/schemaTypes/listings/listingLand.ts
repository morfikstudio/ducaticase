import { ALL_FIELDS_GROUP, defineType } from "sanity"

import { listingPreview } from "./shared"

import {
  addressField,
  agriculturalField,
  buildableField,
  cityField,
  commercialAreaSqmField,
  countryField,
  descriptionField,
  excerptField,
  hasFencedPropertyField,
  isArchivedField,
  landAccessField,
  listingContractTypeField,
  listingTitleField,
  mainImageField,
  priceField,
  postalCodeField,
  provinceField,
} from "../fields"

export const listingLand = defineType({
  name: "listingLand",
  title: "Terreni",
  type: "document",
  groups: [
    { name: "propertySheet", title: "Scheda immobile", default: true },
    { name: "location", title: "Località" },
    { name: "content", title: "Contenuto" },
    { name: "optionals", title: "Campi aggiuntivi" },
    { ...ALL_FIELDS_GROUP, hidden: true },
  ],
  fields: [
    /* Scheda immobile */
    isArchivedField({ group: "propertySheet" }),
    listingContractTypeField({ required: true, group: "propertySheet" }),
    priceField({ group: "propertySheet" }),
    commercialAreaSqmField({ required: true, group: "propertySheet" }),
    landAccessField({ required: true, group: "propertySheet" }),
    hasFencedPropertyField({ required: true, group: "propertySheet" }),
    /* Località */
    countryField({ required: true, group: "location" }),
    provinceField({ required: true, group: "location" }),
    cityField({ required: true, group: "location" }),
    addressField({ group: "location" }),
    postalCodeField({ group: "location" }),
    /* Contenuto */
    listingTitleField({ group: "content" }),
    mainImageField({ required: true, group: "content" }),
    descriptionField({ group: "content" }),
    excerptField({ group: "content" }),
    /* Campi aggiuntivi */
    buildableField({ group: "optionals" }),
    agriculturalField({ group: "optionals" }),
  ],
  preview: listingPreview(),
})
