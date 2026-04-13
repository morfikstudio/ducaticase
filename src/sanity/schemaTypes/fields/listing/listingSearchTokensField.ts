import { defineField } from "sanity"

import { ListingSearchTokensInput } from "../../../components/listingSearchTokensInput"

export type ListingSearchTokensFieldOptions = {
  group?: string
}

export function listingSearchTokensField(
  options?: ListingSearchTokensFieldOptions,
) {
  return defineField({
    ...(options?.group ? { group: options.group } : {}),
    name: "listingSearchTokens",
    title: "Search tokens",
    description:
      "Campo tecnico usato per la ricerca in lista (es. vendita/affitto).",
    type: "string",
    hidden: true,
    readOnly: true,
    components: {
      input: ListingSearchTokensInput,
    },
  })
}
