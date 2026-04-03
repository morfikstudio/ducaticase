import { defineField } from "sanity"

import { FIELD_REQUIRED_IT } from "../../../lib/validationMessages"

export type ExcerptFieldOptions = {
  required?: boolean
  group?: string
  /** Lunghezza massima consigliata (validazione). */
  maxLength?: number
}

export function excerptField(options?: ExcerptFieldOptions) {
  const required = options?.required ?? false
  const maxLength = options?.maxLength

  return defineField({
    ...(options?.group ? { group: options.group } : {}),
    name: "excerpt",
    title: "Estratto",
    type: "text",
    rows: 3,
    description: "Breve testo di anteprima",
    validation: (Rule) =>
      Rule.custom((value: string | undefined) => {
        if (!required) {
          if (value === undefined || value === null || value.trim() === "") {
            return true
          }
        } else {
          if (
            value === undefined ||
            value === null ||
            (typeof value === "string" && value.trim() === "")
          ) {
            return FIELD_REQUIRED_IT
          }
        }

        if (
          maxLength !== undefined &&
          typeof value === "string" &&
          value.length > maxLength
        ) {
          return `Massimo ${maxLength} caratteri.`
        }

        return true
      }),
  })
}
