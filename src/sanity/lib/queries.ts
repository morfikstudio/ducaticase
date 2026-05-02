import { defineQuery, groq } from "next-sanity"

export const MENU_SITE_CONTENT_QUERY = defineQuery(groq`
  *[_type == "siteContent" && sectionType == "menu"]
    | order(_updatedAt desc)
    [0] {
      _id,
      menu {
        headerTagline,
        payoff
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
        privacyPolicyLabel,
        privacyPolicyPath
      }
    }
`)

export const ABOUT_SITE_CONTENT_QUERY = defineQuery(groq`
  *[_type == "siteContent" && sectionType == "aboutPage"]
    | order(_updatedAt desc)
    [0] {
      _id,
      aboutPage {
        heroImages {
          "imageDesktop": imageDesktop {
            ...,
            asset->
          },
          "imageMobile": imageMobile {
            ...,
            asset->
          }
        },
        heroText,
        historySection[] {
          _key,
          title,
          subtitle,
          body,
          reverse,
          images {
            "imageDesktop": imageDesktop {
              ...,
              asset->
            },
            "imageMobile": imageMobile {
              ...,
              asset->
            }
          }
        },
        todaySection {
          title,
          subtitle,
          text
        },
        highlightsSection[] {
          _key,
          title,
          text,
          image {
            ...,
            asset->
          },
          cta {
            label,
            path
          }
        },
        sectorsHeading,
        sectorsSection[] {
          _key,
          title,
          text,
          image {
            ...,
            asset->
          }
        },
        teamSection {
          title,
          subtitle,
          text,
          cta {
            label,
            path
          },
          teamMember[] {
            _key,
            title,
            text,
            image {
              ...,
              asset->
            },
            roles[]
          }
        }
      }
    }
`)

export const HOME_SITE_CONTENT_QUERY = defineQuery(groq`
  *[_type == "siteContent" && sectionType == "homePage"]
    | order(_updatedAt desc)
    [0] {
      _id,
      homePage {
        heroTitle,
        heroImage {
          "imageLandscape": imageLandscape {
            ...,
            asset->
          },
          "imagePortrait": imagePortrait {
            ...,
            asset->
          }
        },
        whoWeAreText1,
        whoWeAreText2,
        whoWeAreCta {
          label,
          path
        },
        payoffTitle,
        payoffImage {
          "imageLandscape": imageLandscape {
            ...,
            asset->
          },
          "imagePortrait": imagePortrait {
            ...,
            asset->
          }
        },
        highlights[] {
          _key,
          title,
          text,
          image {
            ...,
            asset->
          },
          cta {
            label,
            path
          }
        },
        "featuredListings": featuredListings[]->{
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
        },
        testimonialsTitle,
        testimonialsSubtitle,
        testimonials[] {
          _key,
          text,
          name,
          provider
        },
        partners[] {
          _key,
          name,
          image {
            ...,
            asset->
          }
        }
      }
    }
`)

export const LIST_YOUR_PROPERTY_SITE_CONTENT_QUERY = defineQuery(groq`
  *[_type == "siteContent" && sectionType == "listYourPropertyPage"]
    | order(_updatedAt desc)
    [0] {
      _id,
      listYourPropertyPage {
        heroTitle,
        heroSubtitle,
        heroPayoff1,
        heroPayoff2,
        heroCta {
          label,
          path
        },
        heroImage {
          "recommendedCrop": {
            "landscape": {
              "aspectRatio": "20:9",
              "width": 1920,
              "height": 810
            },
            "portrait": {
              "aspectRatio": "4:5",
              "width": 720,
              "height": 960
            }
          },
          "imageLandscape": imageLandscape {
            ...,
            asset->
          },
          "imagePortrait": imagePortrait {
            ...,
            asset->
          }
        },
        cover1Image {
          "recommendedCrop": {
            "landscape": {
              "aspectRatio": "16:9",
              "width": 1920,
              "height": 1080
            },
            "portrait": {
              "aspectRatio": "4:5",
              "width": 720,
              "height": 960
            }
          },
          "imageLandscape": imageLandscape {
            ...,
            asset->
          },
          "imagePortrait": imagePortrait {
            ...,
            asset->
          }
        },
        cover2Image {
          "recommendedCrop": {
            "landscape": {
              "aspectRatio": "16:9",
              "width": 1920,
              "height": 1080
            },
            "portrait": {
              "aspectRatio": "4:5",
              "width": 720,
              "height": 960
            }
          },
          "imageLandscape": imageLandscape {
            ...,
            asset->
          },
          "imagePortrait": imagePortrait {
            ...,
            asset->
          }
        },
        bannerTitle,
        bannerText,
        bannerCta {
          label,
          path
        },
        valuesTitle,
        valuesSubtitle,
        valuesCta {
          label,
          path
        },
        valuesImage {
          ...,
          asset->
        },
        valuesItems[] {
          _key,
          title
        },
        servicesTitle,
        servicesSubtitle,
        servicesCta {
          label,
          path
        },
        servicesItems[] {
          _key,
          title,
          text
        }
      }
    }
`)

export const BUSINESS_PAGE_SITE_CONTENT_QUERY = defineQuery(groq`
  *[_type == "siteContent" && sectionType == "businessPage"]
    | order(_updatedAt desc)
    [0] {
      _id,
      businessPage {
        heroTitle,
        heroSubtitle,
        heroPayoff1,
        heroPayoff2,
        heroCta {
          label,
          path
        },
        heroImage {
          "recommendedCrop": {
            "landscape": {
              "aspectRatio": "20:9",
              "width": 1920,
              "height": 810
            },
            "portrait": {
              "aspectRatio": "4:5",
              "width": 720,
              "height": 960
            }
          },
          "imageLandscape": imageLandscape {
            ...,
            asset->
          },
          "imagePortrait": imagePortrait {
            ...,
            asset->
          }
        },
        cover1Image {
          "recommendedCrop": {
            "landscape": {
              "aspectRatio": "16:9",
              "width": 1920,
              "height": 1080
            },
            "portrait": {
              "aspectRatio": "4:5",
              "width": 720,
              "height": 960
            }
          },
          "imageLandscape": imageLandscape {
            ...,
            asset->
          },
          "imagePortrait": imagePortrait {
            ...,
            asset->
          }
        },
        cover2Image {
          "recommendedCrop": {
            "landscape": {
              "aspectRatio": "16:9",
              "width": 1920,
              "height": 1080
            },
            "portrait": {
              "aspectRatio": "4:5",
              "width": 720,
              "height": 960
            }
          },
          "imageLandscape": imageLandscape {
            ...,
            asset->
          },
          "imagePortrait": imagePortrait {
            ...,
            asset->
          }
        },
        valuesTitle,
        valuesSubtitle,
        valuesCta {
          label,
          path
        },
        valuesImage {
          ...,
          asset->
        },
        valuesItems[] {
          _key,
          title
        },
        servicesTitle,
        servicesSubtitle,
        servicesCta {
          label,
          path
        },
        servicesItems[] {
          _key,
          title,
          text
        },
        bannerPartnersTitle,
        bannerPartnersText,
        bannerPartnersCta {
          label,
          path
        },
        bannerPartnersItems[] {
          _key,
          name,
          image {
            ...,
            asset->
          }
        }
      }
    }
`)

export const TAILORED_SEARCH_PAGE_SITE_CONTENT_QUERY = defineQuery(groq`
  *[_type == "siteContent" && sectionType == "tailoredSearchPage"]
    | order(_updatedAt desc)
    [0] {
      _id,
      tailoredSearchPage {
        heroTitle,
        heroSubtitle,
        heroPayoff1,
        heroPayoff2,
        heroCta {
          label,
          path
        },
        heroImage {
          "recommendedCrop": {
            "landscape": {
              "aspectRatio": "20:9",
              "width": 1920,
              "height": 810
            },
            "portrait": {
              "aspectRatio": "4:5",
              "width": 720,
              "height": 960
            }
          },
          "imageLandscape": imageLandscape {
            ...,
            asset->
          },
          "imagePortrait": imagePortrait {
            ...,
            asset->
          }
        },
        cover1Image {
          "recommendedCrop": {
            "landscape": {
              "aspectRatio": "16:9",
              "width": 1920,
              "height": 1080
            },
            "portrait": {
              "aspectRatio": "4:5",
              "width": 720,
              "height": 960
            }
          },
          "imageLandscape": imageLandscape {
            ...,
            asset->
          },
          "imagePortrait": imagePortrait {
            ...,
            asset->
          }
        },
        bannerFormTitle,
        bannerFormText,
        bannerFormCtaLabel,
        valuesTitle,
        valuesSubtitle,
        valuesCta {
          label,
          path
        },
        valuesImage {
          ...,
          asset->
        },
        valuesItems[] {
          _key,
          title
        },
        banner2Title,
        banner2Text,
        banner2Cta {
          label,
          path
        }
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

/** Public IDs of listings (sitemap / SEO). */
export const LISTING_SITEMAP_IDS_QUERY = defineQuery(groq`
  *[_type in [
    "listingResidential",
    "listingCountryHouses",
    "listingShopsAndOffices",
    "listingIndustrial",
    "listingHospitality",
    "listingLand"
  ] && coalesce(isArchived, false) != true] {
    _id,
    _updatedAt
  }
`)
