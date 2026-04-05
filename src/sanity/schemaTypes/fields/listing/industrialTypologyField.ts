import { defineField } from "sanity"

import {
  INDUSTRIAL_TYPOLOGY_OPTIONS,
  typologyOptionsForStudio,
} from "../../../lib/constants"
import { FIELD_REQUIRED_IT } from "../../../lib/validationMessages"

export type IndustrialTypologyFieldOptions = {
  required?: boolean
  group?: string
}

export function industrialTypologyField(
  options?: IndustrialTypologyFieldOptions,
) {
  const required = options?.required ?? false

  return defineField({
    ...(options?.group ? { group: options.group } : {}),
    name: "industrialTypology",
    title: "Tipologia",
    type: "string",
    options: {
      list: typologyOptionsForStudio(INDUSTRIAL_TYPOLOGY_OPTIONS),
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
