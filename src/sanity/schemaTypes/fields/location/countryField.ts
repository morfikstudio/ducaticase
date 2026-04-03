import { defineField } from "sanity"

import { LOCATION_COUNTRY_OPTIONS } from "../../../lib/constants"
import { FIELD_REQUIRED_IT } from "../../../lib/validationMessages"

export type CountryFieldOptions = {
  required?: boolean
  group?: string
}

export function countryField(options?: CountryFieldOptions) {
  const required = options?.required ?? false

  return defineField({
    ...(options?.group ? { group: options.group } : {}),
    name: "country",
    title: "Paese",
    type: "string",
    options: {
      list: [...LOCATION_COUNTRY_OPTIONS],
    },
    validation: (Rule) =>
      Rule.custom((value) => {
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
