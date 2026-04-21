import { defineField, defineType } from "sanity"

import { INTERNAL_SITE_PATH_OPTIONS } from "../../lib/internalSitePaths"

export const aboutHighlightCta = defineType({
  name: "aboutHighlightCta",
  title: "Call to action",
  description:
    "Opzionale. Compila etichetta e pagina solo se vuoi mostrare il pulsante.",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Etichetta",
      type: "localizedString",
    }),
    defineField({
      name: "path",
      title: "Pagina",
      type: "string",
      options: {
        list: [...INTERNAL_SITE_PATH_OPTIONS],
        layout: "dropdown",
      },
    }),
  ],
})
