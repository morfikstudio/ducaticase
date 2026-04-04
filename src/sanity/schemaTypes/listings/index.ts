import { type SchemaTypeDefinition } from "sanity"

import { listingCountryHouses } from "./listingCountryHouses"
import { listingResidential } from "./listingResidential"
import { listingShopsAndOffices } from "./listingShopsAndOffices"

export {
  LISTING_DOCUMENT_SPECS,
  type ListingTypeName,
} from "../../lib/constants"

export const listingTypes: SchemaTypeDefinition[] = [
  listingResidential,
  listingCountryHouses,
  listingShopsAndOffices,
]
