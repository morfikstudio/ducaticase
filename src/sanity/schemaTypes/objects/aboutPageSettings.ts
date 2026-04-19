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
    { name: "sectors", title: "I nostri settori" },
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
      name: "sectorsHeading",
      title: "Titolo sezione",
      description: "Titolo sopra l’elenco dei settori (italiano e inglese).",
      type: "localizedString",
      group: "sectors",
      validation: (Rule) =>
        Rule.custom((value: { it?: string; en?: string } | undefined) => {
          const it = value?.it?.trim() ?? ""
          const en = value?.en?.trim() ?? ""
          if (it === "" && en === "") return true
          if (it === "") {
            return "Inserisci il titolo in italiano (o svuota anche l’inglese)."
          }
          if (en === "") {
            return "Inserisci il titolo in inglese (o svuota anche l’italiano)."
          }
          return true
        }),
    }),
    defineField({
      name: "sectorsSection",
      title: "Settori",
      type: "array",
      group: "sectors",
      of: [defineArrayMember({ type: "aboutSectorBlock" })],
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
