import { defineField, defineType } from "sanity"

import { apiVersion } from "../../env"
import { MAX_IMAGES_BYTES } from "../../lib/constants"

const maxMb = MAX_IMAGES_BYTES / (1024 * 1024)

function listYourPropertyHeroImageField(
  name: string,
  title: string,
  previewAspect: number,
  previewTitle: string,
) {
  return defineField({
    name,
    title,
    description: `Massimo ${maxMb} MB. Ritaglio consigliato ${previewTitle}.`,
    type: "image",
    options: {
      hotspot: {
        previews: [{ title: previewTitle, aspectRatio: previewAspect }],
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
        const ref = (value as { asset?: { _ref?: string } } | undefined)?.asset
          ?._ref
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
        if (size > MAX_IMAGES_BYTES) {
          return `L'immagine supera il limite di ${maxMb} MB. Carica un file più piccolo.`
        }
        return true
      }),
  })
}

/** Hero pagina Affidaci: desktop 20:9, mobile 4:5. */
export const listYourPropertyHeroResponsiveImage = defineType({
  name: "listYourPropertyHeroResponsiveImage",
  title: "Immagini Landscape / Portrait",
  type: "object",
  fields: [
    listYourPropertyHeroImageField(
      "imageLandscape",
      "Landscape (desktop)",
      20 / 9,
      "Landscape 20:9",
    ),
    listYourPropertyHeroImageField(
      "imagePortrait",
      "Portrait (mobile)",
      4 / 5,
      "Portrait 4:5",
    ),
  ],
})
