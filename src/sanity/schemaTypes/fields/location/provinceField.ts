import { defineField } from "sanity"

import { ITALIAN_PROVINCE_OPTIONS } from "../../../lib/constants"
import { FIELD_REQUIRED_IT } from "../../../lib/validationMessages"

export type ProvinceFieldOptions = {
  required?: boolean
  group?: string
}

export function provinceField(options?: ProvinceFieldOptions) {
  const required = options?.required ?? false

  return defineField({
    ...(options?.group ? { group: options.group } : {}),
    name: "province",
    title: "Provincia",
    type: "string",
    hidden: ({ document }) =>
      (document as { country?: string | null } | undefined)?.country !== "IT",
    options: {
      list: [...ITALIAN_PROVINCE_OPTIONS],
    },
    validation: (Rule) =>
      Rule.custom((value, context) => {
        if (!required) {
          return true
        }

        const country = (
          context.document as { country?: string | null } | undefined
        )?.country

        if (country !== "IT") {
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
