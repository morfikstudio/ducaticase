import { defineField } from "sanity"

import { FLOOR_OPTIONS } from "../../../lib/constants"
import { FIELD_REQUIRED_IT } from "../../../lib/validationMessages"

export type FloorFieldOptions = {
  required?: boolean
  group?: string
}

export function floorField(options?: FloorFieldOptions) {
  const required = options?.required ?? false

  return defineField({
    ...(options?.group ? { group: options.group } : {}),
    name: "floor",
    title: "Piano",
    type: "string",
    options: {
      list: [...FLOOR_OPTIONS],
    },
    /**
     * `rule.required()` su string con `options.list` a volte non mostra l’errore in Studio;
     * una custom rule è più affidabile per select/dropdown.
     */
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
