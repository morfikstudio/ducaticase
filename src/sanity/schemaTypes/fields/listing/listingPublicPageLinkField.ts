import { defineField } from "sanity"

import { ListingPublicPageLinkField } from "../../../components/ListingPublicPageLinkField"
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
    title: "Pagina live / anteprima",
    type: "string",
    readOnly: true,
    components: {
      input: ListingPublicPageLinkInput,
      field: ListingPublicPageLinkField,
    },
  })
}
