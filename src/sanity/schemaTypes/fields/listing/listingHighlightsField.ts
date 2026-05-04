import { defineArrayMember, defineField } from "sanity"

export type ListingHighlightsFieldOptions = {
  group?: string
}

export function listingHighlightsField(
  options?: ListingHighlightsFieldOptions,
) {
  return defineField({
    ...(options?.group ? { group: options.group } : {}),
    name: "highlights",
    title: "Highlights",
    type: "array",
    of: [defineArrayMember({ type: "localizedString" })],
  })
}
