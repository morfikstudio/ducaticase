import { defineField } from "sanity"

import {
  LISTING_CONTRACT_TYPE_OPTIONS,
} from "../../../lib/constants"
import { FIELD_REQUIRED_IT } from "../../../lib/validationMessages"

export type ListingContractTypeFieldOptions = {
  required?: boolean
  group?: string
}

export function listingContractTypeField(
  options?: ListingContractTypeFieldOptions,
) {
  const required = options?.required ?? false

  return defineField({
    ...(options?.group ? { group: options.group } : {}),
    name: "listingContractType",
    title: "Contratto",
    type: "string",
    options: {
      list: LISTING_CONTRACT_TYPE_OPTIONS.map((option) => ({
        title: option.title.it,
        value: option.value,
      })),
      layout: "radio",
      direction: "horizontal",
    },
    validation: (Rule) =>
      Rule.custom((value: string | undefined) => {
        if (
          !required &&
          (value === undefined || value === null || value === "")
        ) {
          return true
        }

        if (
          value === undefined ||
          value === null ||
          value === "" ||
          !LISTING_CONTRACT_TYPE_OPTIONS.some(
            (option) => option.value === value,
          )
        ) {
          return FIELD_REQUIRED_IT
        }

        return true
      }),
  })
}
