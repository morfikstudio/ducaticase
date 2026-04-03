import { defineField } from "sanity"

import { POOL_OPTIONS } from "../../../lib/constants"
import { FIELD_REQUIRED_IT } from "../../../lib/validationMessages"

export type PoolFieldOptions = {
  required?: boolean
  group?: string
}

export function poolField(options?: PoolFieldOptions) {
  const required = options?.required ?? false

  return defineField({
    ...(options?.group ? { group: options.group } : {}),
    name: "pool",
    title: "Piscina",
    type: "string",
    options: {
      list: [...POOL_OPTIONS],
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
