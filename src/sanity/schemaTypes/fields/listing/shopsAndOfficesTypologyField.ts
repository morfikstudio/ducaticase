import { defineField } from "sanity"

import {
  SHOPS_AND_OFFICES_TYPOLOGY_OPTIONS,
  typologyOptionsForStudio,
} from "../../../lib/constants"
import { FIELD_REQUIRED_IT } from "../../../lib/validationMessages"

export type ShopsAndOfficesTypologyFieldOptions = {
  required?: boolean
  group?: string
}

export function shopsAndOfficesTypologyField(
  options?: ShopsAndOfficesTypologyFieldOptions,
) {
  const required = options?.required ?? false

  return defineField({
    ...(options?.group ? { group: options.group } : {}),
    name: "shopsAndOfficesTypology",
    title: "Tipologia",
    type: "string",
    options: {
      list: typologyOptionsForStudio(SHOPS_AND_OFFICES_TYPOLOGY_OPTIONS),
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
