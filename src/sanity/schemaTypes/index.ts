import { type SchemaTypeDefinition } from "sanity"

import { listingTypes } from "./listingTypes"
import { customSpecificationItem } from "./objects/customSpecificationItem"
import { aboutHeroResponsiveImage } from "./objects/aboutHeroResponsiveImage"
import { aboutHistoryBlock } from "./objects/aboutHistoryBlock"
import { aboutPageSettings } from "./objects/aboutPageSettings"
import { aboutResponsiveImage } from "./objects/aboutResponsiveImage"
import { menuSettings } from "./objects/menuSettings"
import { footerSettings } from "./objects/footerSettings"
import {
  localizedPortableTextObject,
  localizedStringObject,
  localizedTextObject,
} from "./objects/localized"
import { siteContent } from "./siteContent"

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    customSpecificationItem,
    aboutResponsiveImage,
    aboutHeroResponsiveImage,
    aboutHistoryBlock,
    aboutPageSettings,
    menuSettings,
    footerSettings,
    localizedStringObject,
    localizedTextObject,
    localizedPortableTextObject,
    siteContent,
    ...listingTypes,
  ],
}
