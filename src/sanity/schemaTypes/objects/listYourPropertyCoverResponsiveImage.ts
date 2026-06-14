import { defineField, defineType } from "sanity"

function listYourPropertyCoverImageField(
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

/** Cover pagina Affidaci: Landscape 16:9, mobile Portrait 4:5. */
export const listYourPropertyCoverResponsiveImage = defineType({
  name: "listYourPropertyCoverResponsiveImage",
  title: "Immagini Landscape / Portrait",
  type: "object",
  fields: [
    listYourPropertyCoverImageField(
      "imageLandscape",
      "Landscape",
      16 / 9,
      "Landscape 16:9",
    ),
    listYourPropertyCoverImageField(
      "imagePortrait",
      "Portrait (mobile)",
      4 / 5,
      "Portrait 4:5",
    ),
  ],
})
