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

export const tailoredSearchPageSettings = defineType({
  name: "tailoredSearchPageSettings",
  title: "Ricerca su misura",
  type: "object",
  groups: [
    { ...ALL_FIELDS_GROUP, hidden: true },
    { name: "hero", title: "Hero", default: true },
    { name: "cover1", title: "Cover 1" },
    { name: "bannerForm", title: "Banner Form Contatti" },
    { name: "values", title: "Values" },
    { name: "banner2", title: "Banner" },
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
      name: "bannerFormTitle",
      title: "Titolo",
      type: "localizedString",
      group: "bannerForm",
      validation: (Rule) =>
        Rule.custom((value: LocalizedStringValue) =>
          validatePairedLocalizedString(value),
        ),
    }),
    defineField({
      name: "bannerFormText",
      title: "Testo",
      type: "localizedPortableText",
      group: "bannerForm",
    }),
    defineField({
      name: "bannerFormCtaLabel",
      title: "Etichetta call to action",
      type: "localizedString",
      group: "bannerForm",
      validation: (Rule) =>
        Rule.custom((value: LocalizedStringValue) =>
          validatePairedLocalizedString(value),
        ),
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
      name: "banner2Title",
      title: "Titolo",
      type: "localizedString",
      group: "banner2",
      validation: (Rule) =>
        Rule.custom((value: LocalizedStringValue) =>
          validatePairedLocalizedString(value),
        ),
    }),
    defineField({
      name: "banner2Text",
      title: "Testo",
      type: "localizedPortableText",
      group: "banner2",
    }),
    defineField({
      name: "banner2Cta",
      title: "Call to action",
      type: "aboutHighlightCta",
      group: "banner2",
      validation: (Rule) =>
        Rule.custom((value: HighlightCtaValue) => validateHighlightCta(value)),
    }),
  ],
})
