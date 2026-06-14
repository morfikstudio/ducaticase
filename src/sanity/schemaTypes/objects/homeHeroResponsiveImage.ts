import { defineField, defineType } from "sanity"

function homeHeroImageField(
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

/** Hero home: Landscape 16:9, Portrait 9:16. */
export const homeHeroResponsiveImage = defineType({
  name: "homeHeroResponsiveImage",
  title: "Immagini Landscape / Portrait",
  type: "object",
  fields: [
    homeHeroImageField("imageLandscape", "Landscape", 16 / 9, "Landscape 16:9"),
    homeHeroImageField("imagePortrait", "Portrait", 9 / 16, "Portrait 9:16"),
  ],
})
