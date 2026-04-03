import { defineField } from "sanity"

import { CLIMATE_CONTROL_OPTIONS } from "../../../lib/constants"
import { FIELD_REQUIRED_IT } from "../../../lib/validationMessages"

export type ClimateControlFieldOptions = {
  required?: boolean
  group?: string
}

export function climateControlField(options?: ClimateControlFieldOptions) {
  const required = options?.required ?? false

  return defineField({
    ...(options?.group ? { group: options.group } : {}),
    name: "climateControl",
    title: "Impianto di climatizzazione",
    type: "string",
    options: {
      list: [...CLIMATE_CONTROL_OPTIONS],
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
