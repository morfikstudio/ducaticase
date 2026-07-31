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
        /**
         * An interrupted upload can leave an image slot behind with no file.
         * Such an entry is unrenderable, so block publishing until it is either
         * filled or removed. `Rule.required()` is not enough here: on an image
         * object carrying extra fields it does not check the asset itself.
         */
        validation: (Rule) =>
          Rule.custom((value) => {
            const asset = (value as { asset?: { _ref?: string } } | undefined)
              ?.asset

            return asset?._ref
              ? true
              : "Immagine mancante: carica un file oppure rimuovi il riquadro."
          }),
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
