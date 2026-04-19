import { defineField, defineType } from "sanity"

export const aboutHistoryBlock = defineType({
  name: "aboutHistoryBlock",
  title: "Blocco storia",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Titolo",
      type: "localizedString",
    }),
    defineField({
      name: "subtitle",
      title: "Sottotitolo",
      type: "localizedString",
    }),
    defineField({
      name: "body",
      title: "Testo",
      type: "localizedPortableText",
    }),
    defineField({
      name: "images",
      title: "Immagini",
      type: "aboutResponsiveImage",
    }),
    defineField({
      name: "reverse",
      title: "Inverti layout",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      titleIt: "title.it",
      subtitleIt: "subtitle.it",
      imageDesktop: "images.imageDesktop",
      imageMobile: "images.imageMobile",
    },
    prepare({ titleIt, subtitleIt, imageDesktop, imageMobile }) {
      const title =
        typeof titleIt === "string" && titleIt.trim() !== ""
          ? titleIt.trim()
          : "Blocco storia"
      const subtitle =
        typeof subtitleIt === "string" && subtitleIt.trim() !== ""
          ? subtitleIt.trim()
          : undefined
      const media = imageDesktop ?? imageMobile
      return {
        title,
        subtitle,
        media,
      }
    },
  },
})
