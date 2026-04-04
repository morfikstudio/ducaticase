import { defineField } from "sanity"

import {
  FIELD_REQUIRED_IT,
  INVALID_VALUE_MESSAGE_IT,
} from "../../../lib/validationMessages"

export type HeightMetersFieldOptions = {
  required?: boolean
  group?: string
}

/** Altezza in metri (numero decimale consentito). */
export function heightMetersField(options?: HeightMetersFieldOptions) {
  const required = options?.required ?? false

  return defineField({
    ...(options?.group ? { group: options.group } : {}),
    name: "heightMeters",
    title: "Altezza (m)",
    type: "number",
    validation: (Rule) =>
      Rule.custom((value) => {
        if (value === undefined || value === null) {
          return required ? FIELD_REQUIRED_IT : true
        }

        if (
          typeof value !== "number" ||
          !Number.isFinite(value) ||
          value <= 0 ||
          value > 500
        ) {
          return INVALID_VALUE_MESSAGE_IT
        }

        return true
      }),
  })
}
