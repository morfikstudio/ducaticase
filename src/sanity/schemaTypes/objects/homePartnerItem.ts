import { defineField, defineType } from "sanity"

import { FIELD_REQUIRED_IT } from "../../lib/validationMessages"

export const homePartnerItem = defineType({
  name: "homePartnerItem",
  title: "Partner",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Nome",
      type: "string",
      validation: (Rule) =>
        Rule.custom((value: string | undefined) => {
          const v = value?.trim() ?? ""
          return v !== "" ? true : FIELD_REQUIRED_IT
        }),
    }),
    defineField({
      name: "image",
      title: "Immagine",
      description: "Ritaglio consigliato 1:1.",
      type: "image",
      options: {
        hotspot: {
          previews: [{ title: "1:1", aspectRatio: 1 }],
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
      title: "name",
      media: "image",
    },
    prepare({ title, media }) {
      const t =
        typeof title === "string" && title.trim() !== ""
          ? title.trim()
          : "Partner"
      return { title: t, media }
    },
  },
})
