import { defineField } from "sanity"

import { CONCIERGE_SERVICE_OPTIONS } from "../../../lib/constants"
import { FIELD_REQUIRED_IT } from "../../../lib/validationMessages"

export type ConciergeServiceFieldOptions = {
  required?: boolean
  group?: string
}

export function conciergeServiceField(options?: ConciergeServiceFieldOptions) {
  const required = options?.required ?? false

  return defineField({
    ...(options?.group ? { group: options.group } : {}),
    name: "conciergeService",
    title: "Servizio portineria",
    type: "string",
    options: {
      list: [...CONCIERGE_SERVICE_OPTIONS],
    },
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
