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
    return "Inserisci il testo in italiano (o svuota anche l’inglese)."
  }
  if (en === "") {
    return "Inserisci il testo in inglese (o svuota anche l’italiano)."
  }
  return true
}

function validatePairedLocalizedText(value: LocalizedTextValue): true | string {
  const it = value?.it?.trim() ?? ""
  const en = value?.en?.trim() ?? ""
  if (it === "" && en === "") return true
  if (it === "") {
    return "Inserisci il testo in italiano (o svuota anche l’inglese)."
  }
  if (en === "") {
    return "Inserisci il testo in inglese (o svuota anche l’italiano)."
  }
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
    return "Inserisci l’etichetta se hai selezionato una pagina."
  }
  if (hasLabel && path === "") {
    return "Seleziona una pagina per la call to action."
  }
  return true
}

export const listYourPropertyPageSettings = defineType({
  name: "listYourPropertyPageSettings",
  title: "Affidaci il tuo immobile",
  type: "object",
  groups: [
    { ...ALL_FIELDS_GROUP, hidden: true },
    { name: "hero", title: "Hero", default: true },
    { name: "cover1", title: "Cover 1" },
    { name: "servizi", title: "Servizi" },
    { name: "cover2", title: "Cover 2" },
    { name: "valori", title: "Valori" },
    { name: "banner", title: "Banner" },
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
      type: "localizedText",
      group: "hero",
      validation: (Rule) =>
        Rule.custom((value: LocalizedTextValue) =>
          validatePairedLocalizedText(value),
        ),
    }),
    defineField({
      name: "heroPayoff2",
      title: "Payoff 2",
      type: "localizedText",
      group: "hero",
      validation: (Rule) =>
        Rule.custom((value: LocalizedTextValue) =>
          validatePairedLocalizedText(value),
        ),
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
      name: "serviziTitle",
      title: "Titolo",
      type: "localizedText",
      group: "servizi",
      validation: (Rule) =>
        Rule.custom((value: LocalizedTextValue) =>
          validatePairedLocalizedText(value),
        ),
    }),
    defineField({
      name: "serviziSubtitle",
      title: "Sottotitolo",
      type: "localizedText",
      group: "servizi",
      validation: (Rule) =>
        Rule.custom((value: LocalizedTextValue) =>
          validatePairedLocalizedText(value),
        ),
    }),
    defineField({
      name: "serviziCta",
      title: "Call to action",
      type: "aboutHighlightCta",
      group: "servizi",
      validation: (Rule) =>
        Rule.custom((value: HighlightCtaValue) => validateHighlightCta(value)),
    }),
    defineField({
      name: "serviziItems",
      title: "Servizi",
      type: "array",
      group: "servizi",
      of: [defineArrayMember({ type: "listYourPropertyServiceItem" })],
    }),
    defineField({
      name: "cover2Image",
      title: "Immagine",
      type: "listYourPropertyCoverResponsiveImage",
      group: "cover2",
    }),
    defineField({
      name: "valoriTitle",
      title: "Titolo",
      type: "localizedString",
      group: "valori",
      validation: (Rule) =>
        Rule.custom((value: LocalizedStringValue) =>
          validatePairedLocalizedString(value),
        ),
    }),
    defineField({
      name: "valoriSubtitle",
      title: "Sottotitolo",
      type: "localizedString",
      group: "valori",
      validation: (Rule) =>
        Rule.custom((value: LocalizedStringValue) =>
          validatePairedLocalizedString(value),
        ),
    }),
    defineField({
      name: "valoriCta",
      title: "Call to action",
      type: "aboutHighlightCta",
      group: "valori",
      validation: (Rule) =>
        Rule.custom((value: HighlightCtaValue) => validateHighlightCta(value)),
    }),
    defineField({
      name: "valoriImage",
      title: "Immagine",
      description: `Massimo ${maxMb} MB.`,
      type: "image",
      group: "valori",
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
            "Per accessibilità e SEO. Descrivi il contenuto visivo dell’immagine.",
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
      name: "valoriItems",
      title: "Valori",
      type: "array",
      group: "valori",
      of: [defineArrayMember({ type: "listYourPropertyValueItem" })],
    }),
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
      name: "bannerCta",
      title: "Call to action",
      type: "aboutHighlightCta",
      group: "banner",
      validation: (Rule) =>
        Rule.custom((value: HighlightCtaValue) => validateHighlightCta(value)),
    }),
  ],
})
