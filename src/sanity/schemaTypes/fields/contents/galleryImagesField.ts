import { defineArrayMember, defineField } from "sanity"

export type GalleryImagesFieldOptions = {
  group?: string
}

export function galleryImagesField(options?: GalleryImagesFieldOptions) {
  return defineField({
    ...(options?.group ? { group: options.group } : {}),
    name: "gallery",
    title: "Gallery",
    description:
      "Carica immagini per la galleria. Puoi trascinare per riordinare.",
    type: "array",
    options: {
      layout: "grid",
    },
    of: [
      defineArrayMember({
        type: "image",
        options: {
          hotspot: true,
          metadata: ["lqip", "palette", "blurhash"],
        },
        fields: [
          defineField({
            name: "alt",
            title: "Testo alternativo",
            type: "localizedString",
            description: "Descrizione immagine per accessibilità e SEO.",
          }),
          defineField({
            name: "caption",
            title: "Didascalia (opzionale)",
            type: "localizedString",
          }),
        ],
      }),
    ],
  })
}
