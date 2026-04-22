import { defineField, defineType } from "sanity"

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
      name: "privacy",
      title: "Privacy",
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
  ],
})
