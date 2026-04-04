import { defineField } from "sanity"

import { FIELD_REQUIRED_IT } from "../../../lib/validationMessages"

export type DisplayWindowsFieldOptions = {
  required?: boolean
  group?: string
}

/** Vetrine: valore libero (es. numero o note). */
export function displayWindowsField(options?: DisplayWindowsFieldOptions) {
  const required = options?.required ?? false

  return defineField({
    ...(options?.group ? { group: options.group } : {}),
    name: "displayWindows",
    title: "Vetrine",
    type: "string",
    description: "Indica il numero di vetrine o altre informazioni",
    validation: (Rule) =>
      required ? Rule.required().error(FIELD_REQUIRED_IT) : Rule,
  })
}
