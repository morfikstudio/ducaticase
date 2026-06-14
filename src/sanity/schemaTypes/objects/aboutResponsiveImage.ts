import { defineField, defineType } from "sanity"

import {
  aboutSplitSectionRecommendedCrop,
  aboutSplitSectionStudioPreviewAspect,
} from "../../../lib/aboutSplitSectionImage"

function aboutImageField(
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

/** Blocchi storia Chi siamo: desktop 1:1 (lg+), mobile 2:1 (sotto lg). */
export const aboutResponsiveImage = defineType({
  name: "aboutResponsiveImage",
  title: "Immagini desktop e mobile",
  type: "object",
  fields: [
    aboutImageField(
      "imageDesktop",
      "Immagine desktop",
      aboutSplitSectionStudioPreviewAspect.desktop,
      aboutSplitSectionRecommendedCrop.desktop.aspectRatio,
    ),
    aboutImageField(
      "imageMobile",
      "Immagine mobile",
      aboutSplitSectionStudioPreviewAspect.mobile,
      aboutSplitSectionRecommendedCrop.mobile.aspectRatio,
    ),
  ],
})
