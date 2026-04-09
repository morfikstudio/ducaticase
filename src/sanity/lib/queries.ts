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
    "listingHospitality",
    "listingLand"
  ] && coalesce(isArchived, false) != true && country == "IT"] | order(_createdAt desc) [0...10]{
    _id,
    _type,
    listingContractType,
    price,
    city,
    listingLabel,
    "typology": select(
      _type == "listingCountryHouses" => countryHouseTypology,
      _type == "listingShopsAndOffices" => shopsAndOfficesTypology,
      _type == "listingIndustrial" => industrialTypology,
      true => null
    ),
    "mainImage": mainImage {
      ...,
      asset->
    }
  }
`)

export const LISTING_BY_ID_QUERY = defineQuery(groq`
  *[_type in [
    "listingResidential",
    "listingCountryHouses",
    "listingShopsAndOffices",
    "listingIndustrial",
    "listingHospitality",
    "listingLand"
  ] && coalesce(isArchived, false) != true && _id == $id][0]{
    "metadata": {
      _id,
      _type,
      listingContractType,
      _createdAt,
      _updatedAt,
      _rev
    },
    "typology": select(
      _type == "listingCountryHouses" => countryHouseTypology,
      _type == "listingShopsAndOffices" => shopsAndOfficesTypology,
      _type == "listingIndustrial" => industrialTypology,
      true => null
    ),
    "propertySheet": select(
      _type == "listingResidential" => {
        price,
        commercialAreaSqm,
        condoFees,
        floor,
        conciergeService,
        buildingYear,
        heating,
        energyClass
      },
      _type == "listingCountryHouses" => {
        price,
        commercialAreaSqm,
        floor,
        buildingYear,
        heating,
        energyClass
      },
      _type == "listingShopsAndOffices" => {
        price,
        commercialAreaSqm,
        floor,
        displayWindows,
        conciergeService,
        buildingYear,
        heating,
        energyClass
      },
      _type == "listingIndustrial" => {
        price,
        commercialAreaSqm,
        floor,
        heightMeters,
        buildingYear,
        energyClass
      },
      _type == "listingHospitality" => {
        price,
        commercialAreaSqm,
        roomCount,
        energyClass
      },
      _type == "listingLand" => {
        price,
        commercialAreaSqm,
        landAccess,
        hasFencedProperty
      }
    ),
    "location": {
      country,
      province,
      city,
      address,
      postalCode
    },
    "content": {
      listingLabel,
      "mainImage": mainImage {
        ...,
        asset->
      },
      description,
      excerpt
    },
    "floorPlans": select(
      _type == "listingLand" => {
        "items": null
      },
      {
        "items": floorPlans[] {
          ...,
          asset->
        }
      }
    ),
    "additionalFields": select(
      _type == "listingResidential" => {
        furnishing,
        garden,
        carBox,
        parkingSpaces,
        hasBalcony,
        hasTerrace,
        hasCellar,
        hasAtticRoom,
        hasTavern,
        hasAlarmSystem,
        pool,
        hasTennisCourt,
        hasAccessibleAccess,
        climateControl
      },
      _type == "listingCountryHouses" => {
        outdoorAreaSqm,
        furnishing,
        garden,
        carBox,
        parkingSpaces,
        hasBalcony,
        hasTerrace,
        hasCellar,
        hasAtticRoom,
        hasTavern,
        hasAlarmSystem,
        pool,
        hasTennisCourt,
        hasAccessibleAccess,
        climateControl,
        condoFees
      },
      _type == "listingShopsAndOffices" => {
        furnishing,
        hasAccessibleRestroom,
        hasFlue,
        hasFireProtectionSystem,
        hasLoadingUnloading,
        hasDrivewayAccess,
        parkingSpaces,
        hasAlarmSystem,
        hasAccessibleAccess,
        climateControl,
        conciergeServiceShops,
        officeLayout,
        condoFees
      },
      _type == "listingIndustrial" => {
        hasLoadingDocks,
        hasOverheadCranes,
        shedAreaSqm,
        officeAreaSqm,
        landAreaSqm,
        hasChangingRoom,
        hasFencedProperty,
        conciergeService,
        hasAccessibleRestroom,
        hasLoadingUnloading,
        hasDrivewayAccess,
        hasDrivableAccess,
        parkingSpaces,
        hasAlarmSystem,
        hasAccessibleAccess,
        climateControl,
        heating
      },
      _type == "listingHospitality" => {
        hasAccessibleRestroom,
        hasFlue,
        hasFireProtectionSystem,
        hasLoadingUnloading,
        hasDrivewayAccess,
        parkingSpaces,
        hasAlarmSystem,
        hasAccessibleAccess,
        climateControl,
        outdoorAreaSqm,
        heating,
        pool,
        hasTennisCourt,
        customSpecifications
      },
      _type == "listingLand" => {
        buildable,
        agricultural
      }
    )
  }
`)
