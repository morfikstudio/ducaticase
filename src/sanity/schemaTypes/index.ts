import { type SchemaTypeDefinition } from "sanity"

import { listingTypes } from "./listingTypes"
import { customSpecificationItem } from "./objects/customSpecificationItem"
import { aboutHeroResponsiveImage } from "./objects/aboutHeroResponsiveImage"
import { aboutHighlightBlock } from "./objects/aboutHighlightBlock"
import { aboutHighlightCta } from "./objects/aboutHighlightCta"
import { aboutHistoryBlock } from "./objects/aboutHistoryBlock"
import { aboutPageSettings } from "./objects/aboutPageSettings"
import { aboutTodaySection } from "./objects/aboutTodaySection"
import { aboutTeamSection } from "./objects/aboutTeamSection"
import { aboutResponsiveImage } from "./objects/aboutResponsiveImage"
import { aboutSectorBlock } from "./objects/aboutSectorBlock"
import { homeHeroResponsiveImage } from "./objects/homeHeroResponsiveImage"
import { homeHighlightItem } from "./objects/homeHighlightItem"
import { homePageSettings } from "./objects/homePageSettings"
import { homePartnerItem } from "./objects/homePartnerItem"
import { homePayoffResponsiveImage } from "./objects/homePayoffResponsiveImage"
import { homeTestimonialItem } from "./objects/homeTestimonialItem"
import { teamMemberType } from "./objects/teamMemberType"
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
    homeHeroResponsiveImage,
    homePayoffResponsiveImage,
    homeHighlightItem,
    homeTestimonialItem,
    homePartnerItem,
    homePageSettings,
    aboutHighlightCta,
    aboutHighlightBlock,
    aboutSectorBlock,
    aboutHistoryBlock,
    aboutTodaySection,
    teamMemberType,
    aboutTeamSection,
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
