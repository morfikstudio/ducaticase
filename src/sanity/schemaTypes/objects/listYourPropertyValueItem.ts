import { defineField, defineType } from "sanity"

import { FIELD_REQUIRED_IT } from "../../lib/validationMessages"

type LocalizedTextValue = { it?: string; en?: string } | undefined

export const listYourPropertyValueItem = defineType({
  name: "listYourPropertyValueItem",
  title: "Valore",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Titolo",
      type: "localizedText",
      validation: (Rule) =>
        Rule.custom((value: LocalizedTextValue) => {
          const it = value?.it?.trim() ?? ""
          return it !== "" ? true : FIELD_REQUIRED_IT
        }),
    }),
  ],
  preview: {
    select: {
      titleIt: "title.it",
    },
    prepare({ titleIt }) {
      const title =
        typeof titleIt === "string" && titleIt.trim() !== ""
          ? titleIt.trim()
          : "Valore"
      return { title }
    },
  },
})
