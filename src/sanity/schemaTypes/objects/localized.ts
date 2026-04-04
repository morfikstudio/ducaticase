import { defineField, defineType } from "sanity"

/**
 * Oggetti it/en per annunci. Dopo il deploy: nei documenti esistenti va migrato
 * il contenuto piatto (stringa / PT) in `{ it: valorePrecedente, en: undefined }`.
 */

/** Etichette brevi (es. titolo in elenco annunci). */
export const localizedStringObject = defineType({
  name: "localizedString",
  title: "Testo IT / EN",
  type: "object",
  fields: [
    defineField({
      name: "it",
      title: "Italiano",
      type: "string",
    }),
    defineField({
      name: "en",
      title: "English",
      type: "string",
    }),
  ],
})

/** Testi lunghi plain text (es. estratto). */
export const localizedTextObject = defineType({
  name: "localizedText",
  title: "Testo IT / EN",
  type: "object",
  fields: [
    defineField({
      name: "it",
      title: "Italiano",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "en",
      title: "English",
      type: "text",
      rows: 4,
    }),
  ],
})

/** Portable Text per lingua (descrizioni). */
export const localizedPortableTextObject = defineType({
  name: "localizedPortableText",
  title: "Descrizione IT / EN",
  type: "object",
  fields: [
    defineField({
      name: "it",
      title: "Italiano",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "en",
      title: "English",
      type: "array",
      of: [{ type: "block" }],
    }),
  ],
})
