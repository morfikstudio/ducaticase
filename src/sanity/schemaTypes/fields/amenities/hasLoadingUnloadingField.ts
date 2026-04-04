import { defineField } from "sanity"

import { FIELD_REQUIRED_IT } from "../../../lib/validationMessages"

export type HasLoadingUnloadingFieldOptions = {
  required?: boolean
  group?: string
}

export function hasLoadingUnloadingField(
  options?: HasLoadingUnloadingFieldOptions,
) {
  const required = options?.required ?? false

  return defineField({
    ...(options?.group ? { group: options.group } : {}),
    name: "hasLoadingUnloading",
    title: "Carico e scarico",
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
