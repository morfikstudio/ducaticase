import { defineField } from "sanity"

import { ListingPublicPageLinkInput } from "../../../components/ListingPublicPageLinkInput"

export type ListingPublicPageLinkFieldOptions = {
  group?: string
}

export function listingPublicPageLinkField(
  options?: ListingPublicPageLinkFieldOptions,
) {
  return defineField({
    ...(options?.group ? { group: options.group } : {}),
    name: "sanityStudioListingUrl",
    title: "Pagina live",
    type: "string",
    readOnly: true,
    components: {
      input: ListingPublicPageLinkInput,
    },
  })
}
