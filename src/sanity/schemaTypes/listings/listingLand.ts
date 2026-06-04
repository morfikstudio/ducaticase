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
  galleryImagesField,
  hasFencedPropertyField,
  isArchivedField,
  landAccessField,
  listingContractTypeField,
  listingHighlightsField,
  listingPublicPageLinkField,
  listingSearchTokensField,
  listingInternalNameField,
  listingTitleField,
  mapField,
  mainImageField,
  positionInfoField,
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
    { name: "optionals", title: "Campi opzionali" },
    { name: "location", title: "Località" },
    { name: "mapPosition", title: "Mappa e posizione" },
    { name: "content", title: "Contenuto" },
    { ...ALL_FIELDS_GROUP, hidden: true },
  ],
  fields: [
    /* Scheda immobile */
    isArchivedField({ group: "propertySheet" }),
    listingPublicPageLinkField({ group: "propertySheet" }),
    listingContractTypeField({ required: true, group: "propertySheet" }),
    listingSearchTokensField({ group: "propertySheet" }),
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
    mapField({ group: "mapPosition" }),
    positionInfoField({ group: "mapPosition" }),
    /* Contenuto */
    listingInternalNameField({ group: "content" }),
    listingTitleField({ group: "content" }),
    mainImageField({ required: true, group: "content" }),
    galleryImagesField({ group: "content" }),
    excerptField({ group: "content" }),
    descriptionField({ group: "content" }),
    /* Campi opzionali */
    buildableField({ group: "optionals" }),
    agriculturalField({ group: "optionals" }),
    listingHighlightsField({ group: "optionals" }),
  ],
  preview: listingPreview(),
})
