import { DocumentTextIcon } from "@sanity/icons"
import { defineField, defineType } from "sanity"

import { FIELD_REQUIRED_IT } from "../lib/validationMessages"

export const siteContent = defineType({
  name: "siteContent",
  title: "Contenuti Sito",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      title: "Titolo",
      type: "string",
      validation: (rule) => rule.required().error(FIELD_REQUIRED_IT),
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return { title: title || "Senza titolo" }
    },
  },
})
