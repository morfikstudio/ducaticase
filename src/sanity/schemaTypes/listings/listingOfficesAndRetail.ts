import { CaseIcon } from "@sanity/icons"
import { defineType } from "sanity"

import { listingLabelField, listingPreview } from "./shared"

export const listingOfficesAndRetail = defineType({
  name: "listingOfficesAndRetail",
  title: "Uffici e Negozi",
  type: "document",
  icon: CaseIcon,
  fields: [listingLabelField],
  preview: listingPreview(),
})
