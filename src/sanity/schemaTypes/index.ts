import { type SchemaTypeDefinition } from "sanity"

import { listingTypes } from "./listingTypes"
import { customSpecificationItem } from "./objects/customSpecificationItem"
import {
  localizedPortableTextObject,
  localizedStringObject,
  localizedTextObject,
} from "./objects/localized"
import { siteContent } from "./siteContent"

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    customSpecificationItem,
    localizedStringObject,
    localizedTextObject,
    localizedPortableTextObject,
    siteContent,
    ...listingTypes,
  ],
}
