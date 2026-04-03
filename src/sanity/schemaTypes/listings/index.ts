import {
  CaseIcon,
  CubeIcon,
  BlockElementIcon,
  HomeIcon,
  StarIcon,
  SunIcon,
} from "@sanity/icons"
import { type SchemaTypeDefinition } from "sanity"

import { listingResidential } from "./listingResidential"
import { listingCountryHouses } from "./listingCountryHouses"
import { listingOfficesAndRetail } from "./listingOfficesAndRetail"
import { listingIndustrial } from "./listingIndustrial"
import { listingHospitality } from "./listingHospitality"
import { listingLand } from "./listingLand"

export const LISTING_DOCUMENT_SPECS = [
  { name: "listingResidential", title: "Residenziale", icon: HomeIcon },
  { name: "listingCountryHouses", title: "Dimore oltre la città", icon: SunIcon },
  { name: "listingOfficesAndRetail", title: "Uffici e Negozi", icon: CaseIcon },
  { name: "listingIndustrial", title: "Industriale", icon: CubeIcon },
  { name: "listingHospitality", title: "Hospitality", icon: StarIcon },
  { name: "listingLand", title: "Terreni", icon: BlockElementIcon },
] as const

export type ListingTypeName = (typeof LISTING_DOCUMENT_SPECS)[number]["name"]

export const listingTypes: SchemaTypeDefinition[] = [
  listingResidential,
  listingCountryHouses,
  listingOfficesAndRetail,
  listingIndustrial,
  listingHospitality,
  listingLand,
]
