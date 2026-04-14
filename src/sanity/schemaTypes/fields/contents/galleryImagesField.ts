import { defineArrayMember, defineField } from "sanity"

import { apiVersion } from "../../../env"
import { MAX_IMAGES_BYTES } from "../../../lib/constants"

export type GalleryImagesFieldOptions = {
  group?: string
}

const maxMb = MAX_IMAGES_BYTES / (1024 * 1024)

export function galleryImagesField(options?: GalleryImagesFieldOptions) {
  return defineField({
    ...(options?.group ? { group: options.group } : {}),
    name: "gallery",
    title: "Gallery",
    description: `Carica immagini per la galleria (max ${maxMb} MB per immagine). Puoi trascinare per riordinare.`,
    type: "array",
    options: {
      layout: "grid",
    },
    of: [
      defineArrayMember({
        type: "image",
        options: {
          hotspot: true,
          metadata: ["lqip", "palette", "blurhash"],
        },
        fields: [
          defineField({
            name: "alt",
            title: "Testo alternativo",
            type: "localizedString",
            description: "Descrizione immagine per accessibilità e SEO.",
          }),
          defineField({
            name: "caption",
            title: "Didascalia (opzionale)",
            type: "localizedString",
          }),
        ],
      }),
    ],
    validation: (Rule) =>
      Rule.custom(async (value, context) => {
        const items = Array.isArray(value) ? value : []
        if (items.length === 0) {
          return true
        }

        const client = context.getClient({ apiVersion })

        for (const item of items) {
          const ref = (item as { asset?: { _ref?: string } })?.asset?._ref
          if (!ref) {
            continue
          }

          const size = await client.fetch<number | null>(
            `*[_id == $id][0].size`,
            { id: ref },
          )
          if (typeof size === "number" && size > MAX_IMAGES_BYTES) {
            return `Ogni immagine della gallery non può superare ${maxMb} MB. Comprimi il file prima di caricarlo.`
          }
        }

        return true
      }),
  })
}
