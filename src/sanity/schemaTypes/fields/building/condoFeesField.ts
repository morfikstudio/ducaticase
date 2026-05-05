import { defineField } from "sanity"

import { CURRENCY_OPTIONS } from "../../../lib/constants"
import {
  FIELD_REQUIRED_IT,
  INVALID_VALUE_MESSAGE_IT,
} from "../../../lib/validationMessages"

type CondoFeesValue =
  | {
      condoFeesAmount?: number | null
      condoFeesCurrency?: string | null
    }
  | undefined
  | null

export type CondoFeesFieldOptions = {
  required?: boolean
  group?: string
}

export function condoFeesField(options?: CondoFeesFieldOptions) {
  const required = options?.required ?? false

  return defineField({
    ...(options?.group ? { group: options.group } : {}),
    name: "condoFees",
    title: "Spese condominiali",
    type: "object",
    initialValue: () => ({
      condoFeesCurrency: "EUR",
    }),
    validation: (Rule) =>
      Rule.custom((value: CondoFeesValue) => {
        if (!required) {
          return true
        }

        if (value == null || typeof value !== "object") {
          return FIELD_REQUIRED_IT
        }

        const amount = value.condoFeesAmount
        if (amount === undefined || amount === null) {
          return FIELD_REQUIRED_IT
        }

        if (
          typeof amount !== "number" ||
          !Number.isFinite(amount) ||
          amount <= 0
        ) {
          return INVALID_VALUE_MESSAGE_IT
        }

        const currency = value.condoFeesCurrency
        if (
          currency === undefined ||
          currency === null ||
          (typeof currency === "string" && currency.trim() === "")
        ) {
          return FIELD_REQUIRED_IT
        }

        return true
      }),
    options: {
      columns: 2,
    },
    fields: [
      defineField({
        name: "condoFeesAmount",
        title: "Importo",
        type: "number",
        validation: (Rule) =>
          Rule.custom((value) => {
            if (value === undefined || value === null) {
              return true
            }

            return typeof value !== "number" ||
              !Number.isFinite(value) ||
              value <= 0
              ? INVALID_VALUE_MESSAGE_IT
              : true
          }),
      }),
      defineField({
        name: "condoFeesCurrency",
        title: "Valuta",
        type: "string",
        options: {
          list: [...CURRENCY_OPTIONS],
        },
      }),
    ],
  })
}
