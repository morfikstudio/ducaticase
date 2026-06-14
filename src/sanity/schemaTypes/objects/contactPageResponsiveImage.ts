import { defineField, defineType } from "sanity"

function contactPageImageField(
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

/** Pagina Contatti: desktop 5:3, mobile 4:5. */
export const contactPageResponsiveImage = defineType({
  name: "contactPageResponsiveImage",
  title: "Immagini Landscape / Portrait",
  type: "object",
  fields: [
    contactPageImageField(
      "imageLandscape",
      "Landscape (desktop)",
      5 / 3,
      "Landscape 5:3",
    ),
    contactPageImageField(
      "imagePortrait",
      "Portrait (mobile)",
      4 / 5,
      "Portrait 4:5",
    ),
  ],
})
