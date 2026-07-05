import { ALL_FIELDS_GROUP, defineField, defineType } from "sanity"

import { mapField } from "../fields"

type LocalizedStringValue = { it?: string; en?: string } | undefined

function validatePairedLocalizedString(
  value: LocalizedStringValue,
): true | string {
  const it = value?.it?.trim() ?? ""
  const en = value?.en?.trim() ?? ""
  if (it === "" && en === "") return true
  if (it === "") {
    return "Inserisci il testo in italiano (o svuota anche l'inglese)."
  }
  if (en === "") {
    return "Inserisci il testo in inglese (o svuota anche l'italiano)."
  }
  return true
}

export const contactPageSettings = defineType({
  name: "contactPageSettings",
  title: "Contatti",
  type: "object",
  groups: [
    { ...ALL_FIELDS_GROUP, hidden: true },
    { name: "content", title: "Contenuto", default: true },
    { name: "contactMap", title: "Contatti e mappa" },
    { name: "banner", title: "Banner" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Titolo",
      type: "localizedString",
      group: "content",
    }),
    defineField({
      name: "heroImage",
      title: "Immagine (landscape / portrait)",
      type: "contactPageResponsiveImage",
      group: "content",
    }),
    defineField({
      name: "subtitle",
      title: "Sottotitolo",
      type: "localizedString",
      group: "content",
    }),
    defineField({
      name: "text",
      title: "Testo",
      type: "localizedPortableText",
      group: "content",
    }),
    defineField({
      name: "info",
      title: "Informazioni di contatto",
      type: "object",
      group: "contactMap",
      fields: [
        defineField({
          name: "email",
          title: "Email",
          type: "string",
          validation: (Rule) =>
            Rule.custom((value: string | undefined) => {
              const v = value?.trim() ?? ""
              if (v === "") return true
              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
                return "Inserisci un indirizzo email valido."
              }
              return true
            }),
        }),
        defineField({
          name: "phone",
          title: "Telefono",
          type: "string",
        }),
        defineField({
          name: "whatsapp",
          title: "WhatsApp",
          type: "string",
          description: "Numero o link (es. https://wa.me/39…)",
        }),
        defineField({
          name: "address",
          title: "Indirizzo",
          type: "string",
        }),
      ],
    }),
    mapField({ group: "contactMap" }),
    defineField({
      name: "bannerTitle",
      title: "Titolo",
      type: "localizedString",
      group: "banner",
      validation: (Rule) =>
        Rule.custom((value: LocalizedStringValue) =>
          validatePairedLocalizedString(value),
        ),
    }),
    defineField({
      name: "bannerText",
      title: "Testo",
      type: "localizedPortableText",
      group: "banner",
    }),
    defineField({
      name: "bannerCtaLabel",
      title: "Etichetta pulsante",
      description:
        "Il link punta automaticamente a info@ducaticase.it. Inserisci solo l'etichetta del pulsante.",
      type: "localizedString",
      group: "banner",
      validation: (Rule) =>
        Rule.custom((value: LocalizedStringValue) =>
          validatePairedLocalizedString(value),
        ),
    }),
  ],
})
