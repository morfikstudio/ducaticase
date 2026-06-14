import { defineField, defineType } from "sanity"

function listYourPropertyHeroImageField(
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
