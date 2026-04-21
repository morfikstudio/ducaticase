import {
  ALL_FIELDS_GROUP,
  defineArrayMember,
  defineField,
  defineType,
} from "sanity"

import { LISTING_DOCUMENT_SPECS } from "../../lib/constants"

export const homePageSettings = defineType({
  name: "homePageSettings",
  title: "Home",
  type: "object",
  groups: [
    { ...ALL_FIELDS_GROUP, hidden: true },
    { name: "hero", title: "Hero", default: true },
    { name: "whoWeAre", title: "Chi siamo" },
    { name: "payoff", title: "Payoff" },
    { name: "highlights", title: "Highlights" },
    { name: "featured", title: "In evidenza" },
    { name: "testimonials", title: "Testimonianze" },
    { name: "partners", title: "Partners" },
  ],
  fields: [
    defineField({
      name: "heroImage",
      title: "Immagine",
      type: "homeHeroResponsiveImage",
      group: "hero",
    }),
    defineField({
      name: "heroTitle",
      title: "Titolo",
      type: "localizedString",
      group: "hero",
      validation: (Rule) =>
        Rule.custom((value: { it?: string; en?: string } | undefined) => {
          const it = value?.it?.trim() ?? ""
          const en = value?.en?.trim() ?? ""
          if (it === "" && en === "") return true
          if (it === "") {
            return "Inserisci il titolo in italiano (o svuota anche l’inglese)."
          }
          if (en === "") {
            return "Inserisci il titolo in inglese (o svuota anche l’italiano)."
          }
          return true
        }),
    }),
    defineField({
      name: "whoWeAreText1",
      title: "Testo 1",
      type: "localizedPortableText",
      group: "whoWeAre",
    }),
    defineField({
      name: "whoWeAreText2",
      title: "Testo 2",
      type: "localizedPortableText",
      group: "whoWeAre",
    }),
    defineField({
      name: "whoWeAreCta",
      title: "Call to action",
      type: "aboutHighlightCta",
      group: "whoWeAre",
      validation: (Rule) =>
        Rule.custom(
          (
            value:
              | { label?: { it?: string; en?: string }; path?: string }
              | undefined,
          ) => {
            if (value == null) {
              return true
            }
            const path = typeof value.path === "string" ? value.path.trim() : ""
            const labelIt = value.label?.it?.trim() ?? ""
            const labelEn = value.label?.en?.trim() ?? ""
            const hasLabel = labelIt !== "" || labelEn !== ""
            if (path === "" && !hasLabel) {
              return true
            }
            if (path !== "" && !hasLabel) {
              return "Inserisci l’etichetta se hai selezionato una pagina."
            }
            if (hasLabel && path === "") {
              return "Seleziona una pagina per la call to action."
            }
            return true
          },
        ),
    }),
    defineField({
      name: "payoffImage",
      title: "Immagine",
      type: "homePayoffResponsiveImage",
      group: "payoff",
    }),
    defineField({
      name: "payoffTitle",
      title: "Titolo",
      type: "localizedString",
      group: "payoff",
      validation: (Rule) =>
        Rule.custom((value: { it?: string; en?: string } | undefined) => {
          const it = value?.it?.trim() ?? ""
          const en = value?.en?.trim() ?? ""
          if (it === "" && en === "") return true
          if (it === "") {
            return "Inserisci il titolo in italiano (o svuota anche l'inglese)."
          }
          if (en === "") {
            return "Inserisci il titolo in inglese (o svuota anche l'italiano)."
          }
          return true
        }),
    }),
    defineField({
      name: "highlights",
      title: "Highlights",
      type: "array",
      group: "highlights",
      of: [defineArrayMember({ type: "homeHighlightItem" })],
    }),
    defineField({
      name: "featuredListings",
      title: "Immobili in evidenza",
      type: "array",
      group: "featured",
      of: [
        defineArrayMember({
          type: "reference",
          to: LISTING_DOCUMENT_SPECS.map((spec) => ({ type: spec.name })),
          options: {
            disableNew: true,
          },
        }),
      ],
    }),
    defineField({
      name: "testimonialsTitle",
      title: "Titolo sezione",
      description:
        "Italiano e inglese. Intestazione sopra l’elenco delle testimonianze.",
      type: "localizedString",
      group: "testimonials",
      validation: (Rule) =>
        Rule.custom((value: { it?: string; en?: string } | undefined) => {
          const it = value?.it?.trim() ?? ""
          const en = value?.en?.trim() ?? ""
          if (it === "" && en === "") return true
          if (it === "") {
            return "Inserisci il titolo in italiano (o svuota anche l’inglese)."
          }
          if (en === "") {
            return "Inserisci il titolo in inglese (o svuota anche l’italiano)."
          }
          return true
        }),
    }),
    defineField({
      name: "testimonialsSubtitle",
      title: "Sottotitolo sezione",
      type: "localizedString",
      group: "testimonials",
      validation: (Rule) =>
        Rule.custom((value: { it?: string; en?: string } | undefined) => {
          const it = value?.it?.trim() ?? ""
          const en = value?.en?.trim() ?? ""
          if (it === "" && en === "") return true
          if (it === "") {
            return "Inserisci il sottotitolo in italiano (o svuota anche l’inglese)."
          }
          if (en === "") {
            return "Inserisci il sottotitolo in inglese (o svuota anche l’italiano)."
          }
          return true
        }),
    }),
    defineField({
      name: "testimonials",
      title: "Elenco testimonianze",
      type: "array",
      group: "testimonials",
      of: [defineArrayMember({ type: "homeTestimonialItem" })],
    }),
    defineField({
      name: "partners",
      title: "Partners",
      type: "array",
      group: "partners",
      of: [defineArrayMember({ type: "homePartnerItem" })],
    }),
  ],
})
