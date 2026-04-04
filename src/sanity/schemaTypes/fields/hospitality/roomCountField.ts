import { defineField } from "sanity"

import {
  FIELD_REQUIRED_IT,
  INVALID_VALUE_MESSAGE_IT,
} from "../../../lib/validationMessages"

export type RoomCountFieldOptions = {
  required?: boolean
  group?: string
}

export function roomCountField(options?: RoomCountFieldOptions) {
  const required = options?.required ?? false

  return defineField({
    ...(options?.group ? { group: options.group } : {}),
    name: "roomCount",
    title: "Numero camere",
    type: "number",
    validation: (Rule) =>
      Rule.custom((value) => {
        if (value === undefined || value === null) {
          return required ? FIELD_REQUIRED_IT : true
        }

        if (
          typeof value !== "number" ||
          !Number.isFinite(value) ||
          !Number.isInteger(value) ||
          value < 1
        ) {
          return INVALID_VALUE_MESSAGE_IT
        }

        return true
      }),
  })
}
