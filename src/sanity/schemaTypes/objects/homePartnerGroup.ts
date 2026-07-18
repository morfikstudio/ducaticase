import { defineArrayMember, defineField, defineType } from "sanity"

export const homePartnerGroup = defineType({
  name: "homePartnerGroup",
  title: "Gruppo partner",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Titolo",
      description:
        "Italiano e inglese. Intestazione sopra il carosello dei loghi.",
      type: "localizedString",
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
      name: "partners",
      title: "Partners",
      type: "array",
      of: [defineArrayMember({ type: "homePartnerItem" })],
    }),
  ],
  preview: {
    select: {
      title: "title.it",
      partners: "partners",
    },
    prepare({ title, partners }) {
      const t =
        typeof title === "string" && title.trim() !== ""
          ? title.trim()
          : "Gruppo partner"
      const count = Array.isArray(partners) ? partners.length : 0
      return {
        title: t,
        subtitle: count === 1 ? "1 logo" : `${count} loghi`,
      }
    },
  },
})
