import { defineField, defineType } from "sanity"

import { FIELD_REQUIRED_IT } from "../../lib/validationMessages"

type LocalizedStringValue = { it?: string; en?: string } | undefined
type LocalizedTextValue = { it?: string; en?: string } | undefined

export const aboutSectorBlock = defineType({
  name: "aboutSectorBlock",
  title: "Settore",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Titolo",
      type: "localizedString",
      validation: (Rule) =>
        Rule.custom((value: LocalizedStringValue) => {
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
      description: "Ritaglio consigliato 16:9.",
      type: "image",
      options: {
        hotspot: {
          previews: [{ title: "Anteprima 16:9", aspectRatio: 16 / 9 }],
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
          : "Settore"
      return { title, media }
    },
  },
})
