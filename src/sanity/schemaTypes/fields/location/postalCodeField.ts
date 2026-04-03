import { defineField } from "sanity"

import { FIELD_REQUIRED_IT } from "../../../lib/validationMessages"

export type PostalCodeFieldOptions = {
  required?: boolean
  group?: string
}

export function postalCodeField(options?: PostalCodeFieldOptions) {
  const required = options?.required ?? false

  return defineField({
    ...(options?.group ? { group: options.group } : {}),
    name: "postalCode",
    title: "CAP",
    type: "string",
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
