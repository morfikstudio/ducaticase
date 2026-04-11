import { LinkIcon } from "@sanity/icons"
import { defineArrayMember, defineField, defineType } from "sanity"

export const footerSettings = defineType({
  name: "footerSettings",
  title: "Impostazioni Footer",
  type: "object",
  fieldsets: [
    {
      name: "testi",
      title: "Testi",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "contatti",
      title: "Contatti",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "indirizzo",
      title: "Indirizzo",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "legale",
      title: "Note Legali",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "navigation",
      title: "Navigazione sito",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "privacy",
      title: "Privacy",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "social",
      title: "Social",
      options: { collapsible: true, collapsed: false },
    },
  ],
  fields: [
    defineField({
      name: "payoff",
      title: "Payoff",
      type: "localizedText",
      fieldset: "testi",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      fieldset: "contatti",
    }),
    defineField({
      name: "phone",
      title: "Telefono",
      type: "string",
      fieldset: "contatti",
    }),
    defineField({
      name: "addressLine1",
      title: "Indirizzo (riga 1)",
      type: "string",
      fieldset: "indirizzo",
    }),
    defineField({
      name: "addressLine2",
      title: "Città / CAP (riga 2)",
      type: "string",
      fieldset: "indirizzo",
    }),
    defineField({
      name: "vat",
      title: "P. IVA e note societarie",
      type: "localizedString",
      fieldset: "legale",
    }),
    defineField({
      name: "navLinks",
      title: "Link di navigazione",
      type: "array",
      fieldset: "navigation",
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
      name: "privacyPolicyLabel",
      title: "Testo link Privacy",
      type: "localizedString",
      fieldset: "privacy",
    }),
    defineField({
      name: "privacyPolicyPath",
      title: "Percorso Privacy",
      type: "string",
      fieldset: "privacy",
      placeholder: "/privacy",
    }),
    defineField({
      name: "socialLinks",
      title: "Link Social",
      type: "array",
      fieldset: "social",
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
