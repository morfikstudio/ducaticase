import { defineField } from "sanity"

import { FIELD_REQUIRED_IT } from "../../../lib/validationMessages"

export type ExcerptFieldOptions = {
  required?: boolean
  group?: string
  /** Lunghezza massima consigliata (validazione, lingua italiana). */
  maxLength?: number
}

type LocalizedText = { it?: string; en?: string } | undefined

export function excerptField(options?: ExcerptFieldOptions) {
  const required = options?.required ?? false
  const maxLength = options?.maxLength

  return defineField({
    ...(options?.group ? { group: options.group } : {}),
    name: "excerpt",
    title: "Estratto",
    type: "localizedText",
    description: "Breve testo di anteprima",
    validation: (Rule) =>
      Rule.custom((value: LocalizedText) => {
        const it = value?.it?.trim() ?? ""
        const en = value?.en?.trim() ?? ""

        if (!required) {
          if (it === "" && en === "") {
            return true
          }
        } else {
          if (it === "") {
            return FIELD_REQUIRED_IT
          }
        }

        if (maxLength !== undefined && it.length > maxLength) {
          return `Italiano: massimo ${maxLength} caratteri.`
        }

        if (maxLength !== undefined && en !== "" && en.length > maxLength) {
          return `English: massimo ${maxLength} caratteri.`
        }

        return true
      }),
  })
}
