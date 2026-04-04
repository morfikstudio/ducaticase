import { defineField } from "sanity"

export type CustomSpecificationsFieldOptions = {
  group?: string
}

export function customSpecificationsField(
  options?: CustomSpecificationsFieldOptions,
) {
  return defineField({
    ...(options?.group ? { group: options.group } : {}),
    name: "customSpecifications",
    title: "Specifiche aggiuntive",
    type: "array",
    of: [{ type: "customSpecificationItem" }],
  })
}
