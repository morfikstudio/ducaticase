import { defineField, defineType } from "sanity"

export const aboutTodaySection = defineType({
  name: "aboutTodaySection",
  title: "Chi siamo oggi",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Titolo (colonna sinistra)",
      type: "localizedString",
    }),
    defineField({
      name: "subtitle",
      title: "Sottotitolo",
      type: "localizedString",
    }),
    defineField({
      name: "text",
      title: "Testo",
      type: "localizedText",
    }),
  ],
  preview: {
    select: {
      titleIt: "title.it",
      subtitleIt: "subtitle.it",
    },
    prepare({ titleIt, subtitleIt }) {
      const title =
        typeof titleIt === "string" && titleIt.trim() !== ""
          ? titleIt.trim()
          : "Chi siamo oggi"
      const subtitle =
        typeof subtitleIt === "string" && subtitleIt.trim() !== ""
          ? subtitleIt.trim()
          : undefined
      return {
        title,
        subtitle,
      }
    },
  },
})
