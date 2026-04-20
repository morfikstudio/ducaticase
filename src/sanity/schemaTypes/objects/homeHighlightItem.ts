import { defineField, defineType } from "sanity"

import { apiVersion } from "../../env"
import { MAX_IMAGES_BYTES } from "../../lib/constants"
import { FIELD_REQUIRED_IT } from "../../lib/validationMessages"

const maxMb = MAX_IMAGES_BYTES / (1024 * 1024)

type LocalizedStringValue = { it?: string; en?: string } | undefined

type HighlightCtaValue =
  | { label?: LocalizedStringValue; path?: string }
  | undefined

function portableTextHasContent(
  blocks:
    | Array<{ _type?: string; children?: Array<{ text?: string }> }>
    | undefined,
): boolean {
  if (!blocks?.length) {
    return false
  }
  return blocks.some(
    (block) =>
      block._type === "block" &&
      block.children?.some(
        (child) => typeof child.text === "string" && child.text.trim() !== "",
      ),
  )
}

type LocalizedPT = { it?: unknown; en?: unknown } | undefined

export const homeHighlightItem = defineType({
  name: "homeHighlightItem",
  title: "Highlight",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Titolo",
      type: "localizedString",
      validation: (Rule) =>
        Rule.custom((value: LocalizedStringValue) => {
          const it = value?.it?.trim() ?? ""
          return it !== "" ? true : FIELD_REQUIRED_IT
        }),
    }),
    defineField({
      name: "text",
      title: "Testo",
      type: "localizedPortableText",
      validation: (Rule) =>
        Rule.custom((value: LocalizedPT) =>
          portableTextHasContent(
            value?.it as Parameters<typeof portableTextHasContent>[0],
          )
            ? true
            : FIELD_REQUIRED_IT,
        ),
    }),
    defineField({
      name: "image",
      title: "Immagine",
      description: `Massimo ${maxMb} MB. Ritaglio consigliato 1:1.`,
      type: "image",
      options: {
        hotspot: {
          previews: [{ title: "1:1", aspectRatio: 1 }],
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
            return FIELD_REQUIRED_IT
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
      name: "cta",
      title: "Call to action (opzionale)",
      description:
        "Lasciare vuoto per nascondere il pulsante. Se compili un campo, compila entrambi (etichetta e pagina).",
      type: "aboutHighlightCta",
      validation: (Rule) =>
        Rule.custom((value: HighlightCtaValue) => {
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
        }),
    }),
  ],
  preview: {
    select: {
      titleIt: "title.it",
      media: "image",
    },
    prepare({ titleIt, media }) {
      const title =
        typeof titleIt === "string" && titleIt.trim() !== ""
          ? titleIt.trim()
          : "Highlight"
      return { title, media }
    },
  },
})
