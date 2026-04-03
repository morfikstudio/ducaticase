import { defineField } from "sanity"

import { EnergyClassObjectInput } from "../../../components/energyClassObjectInput"
import {
  ENERGY_CLASS_DL192_OPTIONS,
  ENERGY_CLASS_LAW90_OPTIONS,
  ENERGY_CLASS_SCHEME_OPTIONS,
} from "../../../lib/constants"
import { FIELD_REQUIRED_IT } from "../../../lib/validationMessages"

type EnergyClassValue = {
  energyClassScheme?: string | null
  energyClassRatingDl192?: string | null
  energyClassRatingLaw90?: string | null
} | null

export type EnergyClassFieldOptions = {
  required?: boolean
  group?: string
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== ""
}

export function energyClassField(options?: EnergyClassFieldOptions) {
  const required = options?.required ?? false

  return defineField({
    ...(options?.group ? { group: options.group } : {}),
    name: "energyClass",
    title: "Classe energetica",
    type: "object",
    components: {
      input: EnergyClassObjectInput,
    },
    validation: (Rule) =>
      Rule.custom((value: Record<string, unknown> | undefined) => {
        if (!required) {
          return true
        }

        if (value == null || typeof value !== "object") {
          return FIELD_REQUIRED_IT
        }

        const scheme = value["energyClassScheme"]
        if (
          scheme === undefined ||
          scheme === null ||
          (typeof scheme === "string" && scheme.trim() === "")
        ) {
          return FIELD_REQUIRED_IT
        }

        if (scheme === "dl192_2005") {
          const rating = value["energyClassRatingDl192"]
          if (!isNonEmptyString(rating)) {
            return FIELD_REQUIRED_IT
          }
        }

        if (scheme === "law90_2013") {
          const rating = value["energyClassRatingLaw90"]
          if (!isNonEmptyString(rating)) {
            return FIELD_REQUIRED_IT
          }
        }

        return true
      }),
    fields: [
      defineField({
        name: "energyClassScheme",
        title: "Schema",
        type: "string",
        options: {
          list: [...ENERGY_CLASS_SCHEME_OPTIONS],
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
        name: "energyClassRatingDl192",
        title: "Classe (DL 192)",
        type: "string",
        hidden: ({ parent }) => parent?.energyClassScheme !== "dl192_2005",
        options: {
          list: [...ENERGY_CLASS_DL192_OPTIONS],
        },
        validation: (Rule) =>
          Rule.custom((value, context) => {
            const parent = context.parent as EnergyClassValue
            if (parent?.energyClassScheme !== "dl192_2005") {
              return true
            }
            if (!isNonEmptyString(value)) {
              return FIELD_REQUIRED_IT
            }
            return true
          }),
      }),
      defineField({
        name: "energyClassRatingLaw90",
        title: "Classe (Legge 90/2013)",
        type: "string",
        hidden: ({ parent }) => parent?.energyClassScheme !== "law90_2013",
        options: {
          list: [...ENERGY_CLASS_LAW90_OPTIONS],
        },
        validation: (Rule) =>
          Rule.custom((value, context) => {
            const parent = context.parent as EnergyClassValue
            if (parent?.energyClassScheme !== "law90_2013") {
              return true
            }
            if (!isNonEmptyString(value)) {
              return FIELD_REQUIRED_IT
            }
            return true
          }),
      }),
    ],
  })
}
