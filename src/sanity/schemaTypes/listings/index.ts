import { type SchemaTypeDefinition } from "sanity"

import { listingCountryHouses } from "./listingCountryHouses"
import { listingHospitality } from "./listingHospitality"
import { listingIndustrial } from "./listingIndustrial"
import { listingLand } from "./listingLand"
import { listingOfficesAndRetail } from "./listingOfficesAndRetail"
import { listingResidential } from "./listingResidential"

export {
  LISTING_DOCUMENT_SPECS,
  type ListingTypeName,
} from "../../lib/constants"

export const listingTypes: SchemaTypeDefinition[] = [
  listingResidential,
  listingCountryHouses,
  listingOfficesAndRetail,
  listingIndustrial,
  listingHospitality,
  listingLand,
]
