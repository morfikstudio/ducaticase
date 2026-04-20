import { defineArrayMember, defineField, defineType } from "sanity"

export const aboutTeamSection = defineType({
  name: "aboutTeamSection",
  title: "Il team",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Titolo",
      type: "localizedText",
    }),
    defineField({
      name: "subtitle",
      title: "Sottotitolo",
      type: "localizedText",
    }),
    defineField({
      name: "text",
      title: "Testo",
      type: "localizedText",
    }),
    defineField({
      name: "cta",
      title: "Call to action (opzionale)",
      type: "aboutHighlightCta",
    }),
    defineField({
      name: "teamMember",
      title: "Membri del team",
      type: "array",
      of: [defineArrayMember({ type: "teamMemberType" })],
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
          : "Il team"
      const subtitle =
        typeof subtitleIt === "string" && subtitleIt.trim() !== ""
          ? subtitleIt.trim()
          : undefined
      return { title, subtitle }
    },
  },
})
