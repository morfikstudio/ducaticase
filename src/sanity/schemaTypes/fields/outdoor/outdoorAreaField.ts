import { defineField } from "sanity"

import {
  FIELD_REQUIRED_IT,
  INVALID_VALUE_MESSAGE_IT,
} from "../../../lib/validationMessages"

export type OutdoorAreaFieldOptions = {
  required?: boolean
  group?: string
}

export function outdoorAreaSqmField(options?: OutdoorAreaFieldOptions) {
  const required = options?.required ?? false

  return defineField({
    ...(options?.group ? { group: options.group } : {}),
    name: "outdoorAreaSqm",
    title: "Superficie terreno (mq)",
    type: "number",
    validation: (Rule) =>
      Rule.custom((value) => {
        if (value === undefined || value === null) {
          return required ? FIELD_REQUIRED_IT : true
        }

        return typeof value !== "number" ||
          !Number.isFinite(value) ||
          value <= 0
          ? INVALID_VALUE_MESSAGE_IT
          : true
      }),
  })
}
