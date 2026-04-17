import { defineQuery, groq } from "next-sanity"

export const MENU_SITE_CONTENT_QUERY = defineQuery(groq`
  *[_type == "siteContent" && sectionType == "menu"]
    | order(_updatedAt desc)
    [0] {
      _id,
      menu {
        headerTagline,
        payoff,
        navLinks[] { label, path },
        socialLinks[] { label, href }
      }
    }
`)

export const FOOTER_SITE_CONTENT_QUERY = defineQuery(groq`
  *[_type == "siteContent" && sectionType == "footer"]
    | order(_updatedAt desc)
    [0] {
      _id,
      footer {
        payoff,
        email,
        phone,
        addressLine1,
        addressLine2,
        vat,
        navLinks[] { label, path },
        privacyPolicyLabel,
        privacyPolicyPath,
        socialLinks[] { label, href }
      }
    }
`)

export const LISTINGS_PREVIEW_QUERY = defineQuery(groq`
  *[_type in [
    "listingResidential",
    "listingCountryHouses",
    "listingShopsAndOffices",
    "listingIndustrial",
    "listingHospitality",
    "listingLand"
  ] && coalesce(isArchived, false) != true] | order(_createdAt desc) { // ... order(_createdAt desc) [0...10]{
    _id,
    _type,
    title,
    listingContractType,
    price,
    country,
    city,
    province,
    address,
    postalCode,
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
      postalCode,
      map,
      positionInfo
    },
    "content": {
      title,
      listingLabel,
      "mainImage": mainImage {
        ...,
        asset->
      },
      "gallery": gallery[] {
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
        isBuildable,
        isAgricultural
      }
    ),
    "relatedListings": *[
      _type in [
        "listingResidential",
        "listingCountryHouses",
        "listingShopsAndOffices",
        "listingIndustrial",
        "listingHospitality",
        "listingLand"
      ] &&
      coalesce(isArchived, false) != true &&
      _id != ^._id &&
      _type == ^._type &&
      city == ^.city
    ] | order(_createdAt desc)[0...2] {
      _id,
      _type,
      title,
      listingContractType,
      price,
      city,
      province,
      address,
      postalCode,
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
  }
`)
