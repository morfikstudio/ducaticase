import {
  ALL_FIELDS_GROUP,
  defineArrayMember,
  defineField,
  defineType,
} from "sanity"

import { apiVersion } from "../../env"
import { MAX_IMAGES_BYTES } from "../../lib/constants"

const maxMb = MAX_IMAGES_BYTES / (1024 * 1024)

type LocalizedStringValue = { it?: string; en?: string } | undefined
type LocalizedTextValue = { it?: string; en?: string } | undefined
type LocalizedPortableTextValue = { it?: unknown[]; en?: unknown[] } | undefined

type HighlightCtaValue =
  | { label?: LocalizedStringValue; path?: string }
  | undefined

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

function validatePairedLocalizedText(value: LocalizedTextValue): true | string {
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

function validatePairedLocalizedPortableText(
  value: LocalizedPortableTextValue,
): true | string {
  const it = Array.isArray(value?.it) && value.it.length > 0
  const en = Array.isArray(value?.en) && value.en.length > 0
  if (!it && !en) return true
  if (!it) return "Inserisci il testo in italiano (o svuota anche l'inglese)."
  if (!en) return "Inserisci il testo in inglese (o svuota anche l'italiano)."
  return true
}

function validateHighlightCta(value: HighlightCtaValue): true | string {
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
    return "Inserisci l'etichetta se hai selezionato una pagina."
  }
  if (hasLabel && path === "") {
    return "Seleziona una pagina per la call to action."
  }
  return true
}

export const businessPageSettings = defineType({
  name: "businessPageSettings",
  title: "Ducati per le aziende",
  type: "object",
  groups: [
    { ...ALL_FIELDS_GROUP, hidden: true },
    { name: "hero", title: "Hero", default: true },
    { name: "cover1", title: "Cover 1" },
    { name: "services", title: "Services" },
    { name: "cover2", title: "Cover 2" },
    { name: "values", title: "Values" },
    { name: "bannerPartners", title: "Banner Partners" },
  ],
  fields: [
    defineField({
      name: "heroTitle",
      title: "Titolo",
      type: "localizedString",
      group: "hero",
      validation: (Rule) =>
        Rule.custom((value: LocalizedStringValue) =>
          validatePairedLocalizedString(value),
        ),
    }),
    defineField({
      name: "heroSubtitle",
      title: "Sottotitolo",
      type: "localizedString",
      group: "hero",
      validation: (Rule) =>
        Rule.custom((value: LocalizedStringValue) =>
          validatePairedLocalizedString(value),
        ),
    }),
    defineField({
      name: "heroImage",
      title: "Immagine",
      type: "listYourPropertyHeroResponsiveImage",
      group: "hero",
    }),
    defineField({
      name: "heroPayoff1",
      title: "Payoff 1",
      type: "localizedPortableText",
      group: "hero",
    }),
    defineField({
      name: "heroPayoff2",
      title: "Payoff 2",
      type: "localizedPortableText",
      group: "hero",
    }),
    defineField({
      name: "heroCta",
      title: "Call to action",
      type: "aboutHighlightCta",
      group: "hero",
      validation: (Rule) =>
        Rule.custom((value: HighlightCtaValue) => validateHighlightCta(value)),
    }),
    defineField({
      name: "cover1Image",
      title: "Immagine",
      type: "listYourPropertyCoverResponsiveImage",
      group: "cover1",
    }),
    defineField({
      name: "servicesTitle",
      title: "Titolo",
      type: "localizedText",
      group: "services",
      validation: (Rule) =>
        Rule.custom((value: LocalizedTextValue) =>
          validatePairedLocalizedText(value),
        ),
    }),
    defineField({
      name: "servicesSubtitle",
      title: "Sottotitolo",
      type: "localizedPortableText",
      group: "services",
      validation: (Rule) =>
        Rule.custom((value: LocalizedPortableTextValue) =>
          validatePairedLocalizedPortableText(value),
        ),
    }),
    defineField({
      name: "servicesCta",
      title: "Call to action",
      type: "aboutHighlightCta",
      group: "services",
      validation: (Rule) =>
        Rule.custom((value: HighlightCtaValue) => validateHighlightCta(value)),
    }),
    defineField({
      name: "servicesItems",
      title: "Services",
      type: "array",
      group: "services",
      of: [defineArrayMember({ type: "listYourPropertyServiceItem" })],
    }),
    defineField({
      name: "cover2Image",
      title: "Immagine",
      type: "listYourPropertyCoverResponsiveImage",
      group: "cover2",
    }),
    defineField({
      name: "valuesTitle",
      title: "Titolo",
      type: "localizedString",
      group: "values",
      validation: (Rule) =>
        Rule.custom((value: LocalizedStringValue) =>
          validatePairedLocalizedString(value),
        ),
    }),
    defineField({
      name: "valuesSubtitle",
      title: "Sottotitolo",
      type: "localizedString",
      group: "values",
      validation: (Rule) =>
        Rule.custom((value: LocalizedStringValue) =>
          validatePairedLocalizedString(value),
        ),
    }),
    defineField({
      name: "valuesCta",
      title: "Call to action",
      type: "aboutHighlightCta",
      group: "values",
      validation: (Rule) =>
        Rule.custom((value: HighlightCtaValue) => validateHighlightCta(value)),
    }),
    defineField({
      name: "valuesImage",
      title: "Immagine",
      description: `Massimo ${maxMb} MB.`,
      type: "image",
      group: "values",
      options: {
        hotspot: {
          previews: [{ title: "Anteprima", aspectRatio: 4 / 3 }],
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
            "Per accessibilità e SEO. Descrivi il contenuto visivo dell'immagine.",
          type: "localizedString",
        }),
      ],
      validation: (Rule) =>
        Rule.custom(async (value, context) => {
          const ref = (value as { asset?: { _ref?: string } } | undefined)
            ?.asset?._ref
          if (!ref) {
            return true
          }
          const client = context.getClient({ apiVersion })
          const size = await client.fetch<number | null>(
            `*[_id == $id][0].size`,
            { id: ref },
          )
          if (typeof size !== "number") {
            return true
          }
          if (size > MAX_IMAGES_BYTES) {
            return `L'immagine supera il limite di ${maxMb} MB. Carica un file più piccolo.`
          }
          return true
        }),
    }),
    defineField({
      name: "valuesItems",
      title: "Values",
      type: "array",
      group: "values",
      of: [defineArrayMember({ type: "listYourPropertyValueItem" })],
    }),
    defineField({
      name: "bannerPartnersTitle",
      title: "Titolo",
      type: "localizedString",
      group: "bannerPartners",
      validation: (Rule) =>
        Rule.custom((value: LocalizedStringValue) =>
          validatePairedLocalizedString(value),
        ),
    }),
    defineField({
      name: "bannerPartnersText",
      title: "Testo",
      type: "localizedPortableText",
      group: "bannerPartners",
      validation: (Rule) =>
        Rule.custom((value: LocalizedPortableTextValue) =>
          validatePairedLocalizedPortableText(value),
        ),
    }),
    defineField({
      name: "bannerPartnersCta",
      title: "Call to action",
      type: "aboutHighlightCta",
      group: "bannerPartners",
      validation: (Rule) =>
        Rule.custom((value: HighlightCtaValue) => validateHighlightCta(value)),
    }),
    defineField({
      name: "bannerPartnersItems",
      title: "Loghi aziende",
      type: "array",
      group: "bannerPartners",
      of: [defineArrayMember({ type: "homePartnerItem" })],
    }),
  ],
})
