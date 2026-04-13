import { defineField } from "sanity"

import { apiVersion } from "../../../env"
import { MAX_MAIN_IMAGE_BYTES } from "../../../lib/constants"
import { FIELD_REQUIRED_IT } from "../../../lib/validationMessages"

export type MainImageFieldOptions = {
  required?: boolean
  group?: string
}

const maxMb = MAX_MAIN_IMAGE_BYTES / (1024 * 1024)

export function mainImageField(options?: MainImageFieldOptions) {
  const required = options?.required ?? false

  return defineField({
    ...(options?.group ? { group: options.group } : {}),
    name: "mainImage",
    title: "Immagine principale",
    description: `Massimo ${maxMb} MB`,
    type: "image",
    options: {
      hotspot: {
        previews: [{ title: "Anteprima sito (4:5)", aspectRatio: 4 / 5 }],
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
          "Descrivi in modo chiaro il contenuto dell'immagine. Serve per chi usa screen reader e aiuta i motori di ricerca (SEO).",
        type: "localizedString",
      }),
    ],
    validation: (Rule) =>
      Rule.custom(async (value, context) => {
        const ref = (value as { asset?: { _ref?: string } } | undefined)?.asset
          ?._ref

        if (required && !ref) {
          return FIELD_REQUIRED_IT
        }

        if (!ref) {
          return true
        }

        const client = context.getClient({ apiVersion })
        const size = await client.fetch<number | null>(
          `*[_id == $id][0].size`,
          { id: ref },
        )
        if (typeof size !== "number") {
          return true
        }
        if (size > MAX_MAIN_IMAGE_BYTES) {
          return `L'immagine supera il limite di ${maxMb} MB. Carica un file più piccolo.`
        }
        return true
      }),
  })
}
