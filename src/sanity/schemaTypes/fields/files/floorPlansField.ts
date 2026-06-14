import { defineArrayMember, defineField } from "sanity"

import { FIELD_REQUIRED_IT } from "../../../lib/validationMessages"

export type FloorPlansFieldOptions = {
  required?: boolean
  group?: string
}

export function floorPlansField(options?: FloorPlansFieldOptions) {
  const required = options?.required ?? false

  return defineField({
    ...(options?.group ? { group: options.group } : {}),
    name: "floorPlans",
    title: "Planimetria",
    description:
      "Carica un solo file in PDF, JPG o PNG. Le immagini vengono ottimizzate automaticamente.",
    type: "array",
    of: [
      defineArrayMember({
        type: "file",
        options: {
          accept: "application/pdf,image/jpeg,image/png",
        },
      }),
    ],
    validation: (Rule) => [
      Rule.max(1).error("È consentito un solo file di planimetria."),
      Rule.custom((value) => {
        const items = Array.isArray(value) ? value : []
        if (required) {
          const hasAsset = items.some(
            (item) => !!(item as { asset?: { _ref?: string } })?.asset?._ref,
          )
          if (items.length === 0 || !hasAsset) {
            return FIELD_REQUIRED_IT
          }
        }
        return true
      }),
    ],
  })
}
