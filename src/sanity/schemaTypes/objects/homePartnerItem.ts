import { defineField, defineType } from "sanity"

import { apiVersion } from "../../env"
import { MAX_IMAGES_BYTES } from "../../lib/constants"
import { FIELD_REQUIRED_IT } from "../../lib/validationMessages"

const maxMb = MAX_IMAGES_BYTES / (1024 * 1024)

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
      description: `Massimo ${maxMb} MB. Ritaglio consigliato 1:1.`,
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
        Rule.custom(async (value, context) => {
          const ref = (value as { asset?: { _ref?: string } } | undefined)
            ?.asset?._ref
          if (!ref) {
            return FIELD_REQUIRED_IT
          }
          const client = context.getClient({ apiVersion })
          const size = await client.fetch<number | null>(
            `*[_id == $id][0].size`,
            { id: ref },
          )
          if (typeof size !== "number") {
            return true
          }
          if (size > MAX_IMAGES_BYTES) {
            return `L'immagine supera il limite di ${maxMb} MB. Carica un file più piccolo.`
          }
          return true
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
