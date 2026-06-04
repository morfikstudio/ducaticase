import { defineField, useFormValue, type ObjectFieldProps } from "sanity"

import {
  CURRENCY_OPTIONS,
  FIELD_LABELS,
  PRICE_FALLBACK_OPTIONS,
} from "../../lib/constants"
import {
  FIELD_REQUIRED_IT,
  INVALID_VALUE_MESSAGE_IT,
} from "../../lib/validationMessages"

type PriceValue =
  | {
      amount?: number | null
      currency?: string | null
      noPriceReason?: string | null
    }
  | undefined
  | null

export type PriceFieldOptions = {
  required?: boolean
  group?: string
}

function PriceFieldTitleByContract(props: ObjectFieldProps) {
  const contractType = useFormValue(["listingContractType"])
  const title = contractType === "rent" ? "Canone" : "Prezzo di vendita"

  return props.renderDefault({
    ...props,
    title,
    schemaType: {
      ...props.schemaType,
      title,
    },
  })
}

export function priceField(options?: PriceFieldOptions) {
  const required = options?.required ?? false

  return defineField({
    ...(options?.group ? { group: options.group } : {}),
    name: "price",
    title: FIELD_LABELS.priceEur.it,
    type: "object",
    hidden: ({ document }) => {
      const contractType = (
        document as { listingContractType?: unknown } | null
      )?.listingContractType
      return contractType !== "sale" && contractType !== "rent"
    },
    components: {
      field: PriceFieldTitleByContract,
    },
    initialValue: () => ({
      currency: "EUR",
    }),
    validation: (Rule) =>
      Rule.custom((value: PriceValue) => {
        if (!required && (value === undefined || value === null)) {
          return true
        }

        if (value == null || typeof value !== "object") {
          return FIELD_REQUIRED_IT
        }

        const amount = value.amount
        const hasValidAmount =
          typeof amount === "number" && Number.isFinite(amount) && amount > 0

        if (amount !== undefined && amount !== null && !hasValidAmount) {
          return INVALID_VALUE_MESSAGE_IT
        }

        const reason = value.noPriceReason
        const hasValidReason =
          typeof reason === "string" &&
          reason.trim() !== "" &&
          PRICE_FALLBACK_OPTIONS.some((o) => o.value === reason)

        if (
          reason !== undefined &&
          reason !== null &&
          typeof reason === "string" &&
          reason.trim() !== "" &&
          !hasValidReason
        ) {
          return INVALID_VALUE_MESSAGE_IT
        }

        if (required && !hasValidAmount && !hasValidReason) {
          return FIELD_REQUIRED_IT
        }

        return true
      }),
    options: {
      columns: 2,
    },
    fields: [
      defineField({
        name: "amount",
        title: FIELD_LABELS.amount.it,
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
        name: "currency",
        title: FIELD_LABELS.currency.it,
        type: "string",
        initialValue: "EUR",
        options: {
          list: [...CURRENCY_OPTIONS],
        },
      }),
      defineField({
        name: "noPriceReason",
        title: FIELD_LABELS.noPriceReason.it,
        type: "string",
        options: {
          list: PRICE_FALLBACK_OPTIONS.map((o) => ({
            title: o.title.it,
            value: o.value,
          })),
          layout: "dropdown",
        },
      }),
    ],
  })
}
