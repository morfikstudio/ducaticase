import { defineField, defineType } from "sanity"

function heroImageField(
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

/** Immagini hero: 16:9 desktop, 9:16 mobile (sfondo full-bleed). */
export const aboutHeroResponsiveImage = defineType({
  name: "aboutHeroResponsiveImage",
  title: "Immagine di sfondo",
  type: "object",
  fields: [
    heroImageField("imageDesktop", "Desktop", 16 / 9, "Desktop 16:9"),
    heroImageField("imageMobile", "Mobile", 9 / 16, "Mobile 9:16"),
  ],
})
