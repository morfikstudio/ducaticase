import {
  ALL_FIELDS_GROUP,
  defineArrayMember,
  defineField,
  defineType,
} from "sanity"

export const aboutPageSettings = defineType({
  name: "aboutPageSettings",
  title: "Chi siamo",
  type: "object",
  groups: [
    { ...ALL_FIELDS_GROUP, hidden: true },
    { name: "hero", title: "Hero", default: true },
    { name: "history", title: "La nostra Storia" },
    { name: "today", title: "Chi siamo oggi" },
    { name: "highlights", title: "In evidenza" },
  ],
  fields: [
    defineField({
      name: "heroImages",
      title: "Immagini di sfondo",
      type: "aboutHeroResponsiveImage",
      group: "hero",
    }),
    defineField({
      name: "heroText",
      title: "Testo",
      type: "localizedText",
      group: "hero",
    }),
    defineField({
      name: "historySection",
      title: "Storia",
      type: "array",
      group: "history",
      of: [defineArrayMember({ type: "aboutHistoryBlock" })],
    }),
    defineField({
      name: "todaySection",
      title: "Contenuto",
      type: "aboutTodaySection",
      group: "today",
    }),
    defineField({
      name: "highlightsSection",
      title: "In evidenza",
      type: "array",
      group: "highlights",
      of: [defineArrayMember({ type: "aboutHighlightBlock" })],
    }),
  ],
})
