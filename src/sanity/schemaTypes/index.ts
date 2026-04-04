import { type SchemaTypeDefinition } from "sanity"

import { listingTypes } from "./listingTypes"
import {
  localizedPortableTextObject,
  localizedStringObject,
  localizedTextObject,
} from "./objects/localized"
import { siteContent } from "./siteContent"

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    localizedStringObject,
    localizedTextObject,
    localizedPortableTextObject,
    siteContent,
    ...listingTypes,
  ],
}
