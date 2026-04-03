import { defineField } from "sanity"

import { FIELD_REQUIRED_IT } from "../../../lib/validationMessages"

export type HasAtticRoomFieldOptions = {
  required?: boolean
  group?: string
}

export function hasAtticRoomField(options?: HasAtticRoomFieldOptions) {
  const required = options?.required ?? false

  return defineField({
    ...(options?.group ? { group: options.group } : {}),
    name: "hasAtticRoom",
    title: "Solaio",
    type: "boolean",
    validation: (Rule) =>
      Rule.custom((value: boolean | undefined) => {
        if (!required) {
          return true
        }

        if (value === undefined || value === null) {
          return FIELD_REQUIRED_IT
        }

        return true
      }),
  })
}
