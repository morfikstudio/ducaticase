import { EarthGlobeIcon } from "@sanity/icons"
import { defineType } from "sanity"

import { listingLabelField, listingPreview } from "./shared"

export const listingLand = defineType({
  name: "listingLand",
  title: "Terreni",
  type: "document",
  icon: EarthGlobeIcon,
  fields: [listingLabelField],
  preview: listingPreview(),
})
