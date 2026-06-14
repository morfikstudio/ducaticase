import { defineArrayMember, defineField, defineType } from "sanity"

import { FIELD_REQUIRED_IT } from "../../lib/validationMessages"

type LocalizedTextValue = { it?: string; en?: string } | undefined

export const teamMemberType = defineType({
  name: "teamMemberType",
  title: "Membro del team",
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
    defineField({
      name: "text",
      title: "Testo",
      type: "localizedText",
      validation: (Rule) =>
        Rule.custom((value: LocalizedTextValue) => {
          const it = value?.it?.trim() ?? ""
          return it !== "" ? true : FIELD_REQUIRED_IT
        }),
    }),
    defineField({
      name: "image",
      title: "Immagine",
      description: "Ritaglio consigliato 5:7.",
      type: "image",
      options: {
        hotspot: {
          previews: [{ title: "Anteprima 5:7", aspectRatio: 5 / 7 }],
        },
      },
      initialValue: {
        hotspot: {
          _type: "sanity.imageHotspot",
          x: 0.5,
          y: 0.5,
          height: 1,
          width: 1,
        },
      },
      fields: [
        defineField({
          name: "alt",
          title: "Testo alternativo",
          description:
            "Per accessibilità e SEO. Descrivi il contenuto visivo dell’immagine.",
          type: "localizedString",
        }),
      ],
      validation: (Rule) =>
        Rule.custom((value) => {
          const ref = (value as { asset?: { _ref?: string } } | undefined)
            ?.asset?._ref
          return ref ? true : FIELD_REQUIRED_IT
        }),
    }),
    defineField({
      name: "roles",
      title: "Ruoli",
      type: "array",
      of: [defineArrayMember({ type: "localizedString" })],
      validation: (Rule) => Rule.min(1).error("Inserisci almeno un ruolo."),
    }),
  ],
  preview: {
    select: {
      titleIt: "title.it",
      media: "image",
    },
    prepare({ titleIt, media }) {
      const title =
        typeof titleIt === "string" && titleIt.trim() !== ""
          ? titleIt.trim()
          : "Membro del team"
      return { title, media }
    },
  },
})
