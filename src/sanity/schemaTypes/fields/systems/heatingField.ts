import { defineField } from "sanity"

import { HEATING_OPTIONS } from "../../../lib/constants"
import { FIELD_REQUIRED_IT } from "../../../lib/validationMessages"

type HeatingValue = {
  heatingType?: string | null
  heatingOther?: string | null
} | null

export type HeatingFieldOptions = {
  required?: boolean
  group?: string
}

export function heatingField(options?: HeatingFieldOptions) {
  const required = options?.required ?? false

  return defineField({
    ...(options?.group ? { group: options.group } : {}),
    name: "heating",
    title: "Riscaldamento",
    type: "object",
    validation: (Rule) =>
      Rule.custom((value: Record<string, unknown> | undefined) => {
        if (!required) {
          return true
        }

        if (value == null || typeof value !== "object") {
          return FIELD_REQUIRED_IT
        }

        const type = value["heatingType"]
        if (
          type === undefined ||
          type === null ||
          (typeof type === "string" && type.trim() === "")
        ) {
          return FIELD_REQUIRED_IT
        }

        if (type === "other") {
          const other = value["heatingOther"]
          if (
            other === undefined ||
            other === null ||
            (typeof other === "string" && other.trim() === "")
          ) {
            return FIELD_REQUIRED_IT
          }
        }

        return true
      }),
    fields: [
      defineField({
        name: "heatingType",
        title: "Tipo",
        type: "string",
        options: {
          list: [...HEATING_OPTIONS],
        },
        validation: (Rule) =>
          Rule.custom((value) => {
            if (!required) {
              return true
            }
            if (
              value === undefined ||
              value === null ||
              (typeof value === "string" && value.trim() === "")
            ) {
              return FIELD_REQUIRED_IT
            }
            return true
          }),
      }),
      defineField({
        name: "heatingOther",
        title: "Specifica",
        type: "string",
        hidden: ({ parent }) => parent?.heatingType !== "other",
        validation: (Rule) =>
          Rule.custom((value, context) => {
            const parent = context.parent as HeatingValue
            if (parent?.heatingType !== "other") {
              return true
            }
            if (
              value === undefined ||
              value === null ||
              (typeof value === "string" && value.trim() === "")
            ) {
              return FIELD_REQUIRED_IT
            }
            return true
          }),
      }),
    ],
  })
}
