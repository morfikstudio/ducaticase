import { defineField } from "sanity"

import { FIELD_REQUIRED_IT } from "../../../lib/validationMessages"

export type HasDrivableAccessFieldOptions = {
  required?: boolean
  group?: string
}

/** Accesso carrabile (distinto da “Passo carrabile” / `hasDrivewayAccess`). */
export function hasDrivableAccessField(
  options?: HasDrivableAccessFieldOptions,
) {
  const required = options?.required ?? false

  return defineField({
    ...(options?.group ? { group: options.group } : {}),
    name: "hasDrivableAccess",
    title: "Accesso carrabile",
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
