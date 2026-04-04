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
      name: "language",
      title: "Lingua",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "title",
      title: "Titolo",
      type: "string",
      validation: (rule) => rule.required().error(FIELD_REQUIRED_IT),
    }),
  ],
  preview: {
    select: { title: "title", language: "language" },
    prepare({ title, language }) {
      const suffix =
        language === "en" ? " (EN)" : language === "it" ? " (IT)" : ""
      return { title: `${title || "Senza titolo"}${suffix}` }
    },
  },
})
