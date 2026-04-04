import { defineField } from "sanity"

import { COUNTRY_HOUSE_TYPOLOGY_OPTIONS } from "../../../lib/constants"
import { FIELD_REQUIRED_IT } from "../../../lib/validationMessages"

export type CountryHouseTypologyFieldOptions = {
  required?: boolean
  group?: string
}

export function countryHouseTypologyField(options?: CountryHouseTypologyFieldOptions) {
  const required = options?.required ?? false

  return defineField({
    ...(options?.group ? { group: options.group } : {}),
    name: "countryHouseTypology",
    title: "Tipologia",
    type: "string",
    options: {
      list: [...COUNTRY_HOUSE_TYPOLOGY_OPTIONS],
    },
    validation: (Rule) =>
      Rule.custom((value: string | undefined) => {
        if (!required) {
          return true
        }

        if (
          value === undefined ||
          value === null ||
          (typeof value === "string" && value.trim() === "")
        ) {
          return FIELD_REQUIRED_IT
        }

        return true
      }),
  })
}
