import { defineField, defineType } from "sanity"

import {
  FIELD_REQUIRED_IT,
  INVALID_VALUE_MESSAGE_IT,
} from "../../lib/validationMessages"

const VALUE_KIND_OPTIONS = [
  { title: "Testo", value: "text" },
  { title: "Numero", value: "number" },
] as const

type ValueKind = (typeof VALUE_KIND_OPTIONS)[number]["value"]

type CustomSpecificationParent = {
  label?: string | null
  valueKind?: ValueKind | null
  textValue?: string | null
  numberValue?: number | null
}

export const customSpecificationItem = defineType({
  name: "customSpecificationItem",
  title: "Specifica",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Etichetta",
      type: "string",
      validation: (Rule) => Rule.required().error(FIELD_REQUIRED_IT),
    }),
    defineField({
      name: "valueKind",
      title: "Tipo valore",
      type: "string",
      initialValue: "text",
      options: {
        list: [...VALUE_KIND_OPTIONS],
        layout: "radio",
      },
      validation: (Rule) => Rule.required().error(FIELD_REQUIRED_IT),
    }),
    defineField({
      name: "textValue",
      title: "Valore (testo)",
      type: "string",
      hidden: ({ parent }) =>
        (parent as CustomSpecificationParent | undefined)?.valueKind !== "text",
    }),
    defineField({
      name: "numberValue",
      title: "Valore (numero)",
      type: "number",
      hidden: ({ parent }) =>
        (parent as CustomSpecificationParent | undefined)?.valueKind !==
        "number",
    }),
  ],
  preview: {
    select: {
      label: "label",
      valueKind: "valueKind",
      textValue: "textValue",
      numberValue: "numberValue",
    },
    prepare({ label, valueKind, textValue, numberValue }) {
      const val =
        valueKind === "number"
          ? numberValue === undefined || numberValue === null
            ? ""
            : String(numberValue)
          : typeof textValue === "string"
            ? textValue
            : ""
      return {
        title: typeof label === "string" && label.trim() !== "" ? label : "—",
        subtitle: val,
      }
    },
  },
  validation: (Rule) =>
    Rule.custom((item: CustomSpecificationParent | undefined) => {
      if (item == null || typeof item !== "object") {
        return true
      }

      const kind = item.valueKind
      if (kind === "text") {
        const v = item.textValue
        if (
          v === undefined ||
          v === null ||
          (typeof v === "string" && v.trim() === "")
        ) {
          return FIELD_REQUIRED_IT
        }
        return true
      }

      if (kind === "number") {
        const v = item.numberValue
        if (
          v === undefined ||
          v === null ||
          typeof v !== "number" ||
          !Number.isFinite(v)
        ) {
          return INVALID_VALUE_MESSAGE_IT
        }
        return true
      }

      return INVALID_VALUE_MESSAGE_IT
    }),
})
