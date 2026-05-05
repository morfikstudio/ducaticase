import { defineField } from "sanity"

export type ListingInternalNameFieldOptions = {
  group?: string
}

export function listingInternalNameField(
  options?: ListingInternalNameFieldOptions,
) {
  return defineField({
    ...(options?.group ? { group: options.group } : {}),
    name: "internalListingName",
    title: "Nome interno",
    type: "string",
    description: "Non viene mostrato sul sito.",
  })
}
