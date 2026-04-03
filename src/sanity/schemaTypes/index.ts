import { type SchemaTypeDefinition } from "sanity"

import { listingTypes } from "./listingTypes"
import { siteContent } from "./siteContent"

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [siteContent, ...listingTypes],
}
