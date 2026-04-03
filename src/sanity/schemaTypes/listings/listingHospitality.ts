import { StarIcon } from "@sanity/icons"
import { defineType } from "sanity"

import { listingLabelField, listingPreview } from "./shared"

export const listingHospitality = defineType({
  name: "listingHospitality",
  title: "Hospitality",
  type: "document",
  icon: StarIcon,
  fields: [listingLabelField],
  preview: listingPreview(),
})
