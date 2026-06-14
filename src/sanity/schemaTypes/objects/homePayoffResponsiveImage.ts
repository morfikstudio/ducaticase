import { defineField, defineType } from "sanity"

function payoffImageField(
  name: string,
  title: string,
  previewAspect: number,
  previewTitle: string,
) {
  return defineField({
    name,
    title,
    description: `Ritaglio consigliato ${previewTitle}.`,
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
  })
}

/** Payoff home: Landscape 5:4, Portrait 4:5. */
export const homePayoffResponsiveImage = defineType({
  name: "homePayoffResponsiveImage",
  title: "Immagini Landscape / Portrait",
  type: "object",
  fields: [
    payoffImageField("imageLandscape", "Landscape", 5 / 4, "Landscape 5:4"),
    payoffImageField("imagePortrait", "Portrait", 4 / 5, "Portrait 4:5"),
  ],
})
