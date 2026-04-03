import { CogIcon } from "@sanity/icons"
import { defineType } from "sanity"

import { listingLabelField, listingPreview } from "./shared"

export const listingIndustrial = defineType({
  name: "listingIndustrial",
  title: "Industriale",
  type: "document",
  icon: CogIcon,
  fields: [listingLabelField],
  preview: listingPreview(),
})
