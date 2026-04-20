import { defineArrayMember, defineField, defineType } from "sanity"

import { apiVersion } from "../../env"
import { MAX_IMAGES_BYTES } from "../../lib/constants"
import { FIELD_REQUIRED_IT } from "../../lib/validationMessages"

const maxMb = MAX_IMAGES_BYTES / (1024 * 1024)

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
      description: `Massimo ${maxMb} MB. Ritaglio consigliato 5:7.`,
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
