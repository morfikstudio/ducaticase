import { defineField } from "sanity"

import {
  FIELD_REQUIRED_IT,
  INVALID_VALUE_MESSAGE_IT,
} from "../../../lib/validationMessages"

export type BuildingYearFieldOptions = {
  required?: boolean
  group?: string
}

export function buildingYearField(options?: BuildingYearFieldOptions) {
  const required = options?.required ?? false

  return defineField({
    ...(options?.group ? { group: options.group } : {}),
    name: "buildingYear",
    title: "Anno di costruzione",
    type: "number",
    validation: (Rule) =>
      Rule.custom((value) => {
        if (value === undefined || value === null) {
          return required ? FIELD_REQUIRED_IT : true
        }

        if (typeof value !== "number") {
          return true
        }

        if (!Number.isInteger(value)) {
          return INVALID_VALUE_MESSAGE_IT
        }

        const currentYear = new Date().getFullYear()
        if (value < 1800 || value > currentYear + 2) {
          return INVALID_VALUE_MESSAGE_IT
        }

        return true
      }),
  })
}
