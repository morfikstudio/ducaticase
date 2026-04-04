import { defineQuery, groq } from "next-sanity"

export const SITE_CONTENT_QUERY = defineQuery(groq`
  coalesce(
    *[_type == "siteContent" && language == $locale][0]{ _id, title, language },
    *[_type == "siteContent" && language == "it"][0]{ _id, title, language } // fallback to IT if missing
  )
`)

export const LISTINGS_PREVIEW_QUERY = defineQuery(groq`
  *[_type in [
    "listingResidential",
    "listingCountryHouses",
    "listingShopsAndOffices",
    "listingIndustrial",
    "listingHospitality"
  ]] | order(_updatedAt desc) [0...10]{
    ...,
    mainImage {
      ...,
      asset->
    },
    floorPlans[]{
      ...,
      asset->
    }
  }
`)
