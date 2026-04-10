import { defineField } from "sanity"

import { FIELD_REQUIRED_IT } from "../../../lib/validationMessages"

export type ListingTitleFieldOptions = {
  group?: string
}

type LocalizedStringValue = { it?: string; en?: string } | undefined

export function listingTitleField(options?: ListingTitleFieldOptions) {
  return defineField({
    ...(options?.group ? { group: options.group } : {}),
    name: "title",
    title: "Titolo",
    type: "localizedString",
    validation: (Rule) =>
      Rule.custom((value: LocalizedStringValue) => {
        const it = value?.it?.trim() ?? ""
        return it !== "" ? true : FIELD_REQUIRED_IT
      }),
  })
}
