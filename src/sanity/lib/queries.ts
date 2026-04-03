import { defineQuery } from "next-sanity"

export const SITE_CONTENT_QUERY = defineQuery(
  `*[_type == "siteContent"] | order(_updatedAt desc) [0]{ _id, title }`,
)

export const LISTINGS_PREVIEW_QUERY = defineQuery(
  `*[_type in [
    "listingResidential",
    "listingCountryHouses",
    "listingOfficesAndRetail",
    "listingIndustrial",
    "listingHospitality",
    "listingLand"
  ]] | order(_updatedAt desc) [0...10]{ _id, _type, listingLabel, commercialAreaSqm, floor }`,
)
