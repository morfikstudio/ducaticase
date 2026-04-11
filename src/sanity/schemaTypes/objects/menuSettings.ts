import { LinkIcon } from "@sanity/icons"
import { defineArrayMember, defineField, defineType } from "sanity"

export const menuSettings = defineType({
  name: "menuSettings",
  title: "Menu principale",
  type: "object",
  fields: [
    defineField({
      name: "headerTagline",
      title: "Tagline barra (desktop)",
      type: "localizedText",
    }),
    defineField({
      name: "payoff",
      title: "Payoff",
      type: "localizedText",
    }),
    defineField({
      name: "navLinks",
      title: "Voci menu",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          icon: LinkIcon,
          fields: [
            defineField({
              name: "label",
              title: "Etichetta",
              type: "localizedString",
            }),
            defineField({
              name: "path",
              title: "Percorso",
              type: "string",
              description:
                "Path interno senza prefisso lingua (es. /chi-siamo). Stesso valore per entrambe le lingue.",
              placeholder: "/",
            }),
          ],
          preview: {
            select: { path: "path", it: "label.it", en: "label.en" },
            prepare({ path, it, en }) {
              const title = [it, en].filter(Boolean).join(" / ") || "—"
              return { title, subtitle: path }
            },
          },
        }),
      ],
    }),
    defineField({
      name: "socialLinks",
      title: "Link social",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          icon: LinkIcon,
          fields: [
            defineField({
              name: "label",
              title: "Nome",
              type: "string",
            }),
            defineField({
              name: "href",
              title: "URL",
              type: "url",
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "href" },
          },
        }),
      ],
    }),
  ],
})
