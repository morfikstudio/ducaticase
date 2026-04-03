import { defineField } from "sanity"

import { FURNISHING_OPTIONS } from "../../../lib/constants"
import { FIELD_REQUIRED_IT } from "../../../lib/validationMessages"

export type FurnishingFieldOptions = {
  required?: boolean
  group?: string
}

export function furnishingField(options?: FurnishingFieldOptions) {
  const required = options?.required ?? false

  return defineField({
    ...(options?.group ? { group: options.group } : {}),
    name: "furnishing",
    title: "Arredamento",
    type: "string",
    options: {
      list: [...FURNISHING_OPTIONS],
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
