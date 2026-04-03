import { defineField } from "sanity"

import { AddressObjectInput } from "../../../components/splitObjectInput"
import { FIELD_REQUIRED_IT } from "../../../lib/validationMessages"

type AddressValue =
  | {
      streetName?: string | null
      streetNumber?: string | null
    }
  | undefined
  | null

export type AddressFieldOptions = {
  required?: boolean
  group?: string
}

export function addressField(options?: AddressFieldOptions) {
  const required = options?.required ?? false

  return defineField({
    ...(options?.group ? { group: options.group } : {}),
    name: "address",
    title: "Indirizzo",
    type: "object",
    components: {
      input: AddressObjectInput,
    },
    validation: (Rule) =>
      Rule.custom((value: AddressValue) => {
        if (!required) {
          return true
        }

        if (value == null || typeof value !== "object") {
          return FIELD_REQUIRED_IT
        }

        const streetName = value.streetName
        const streetNumber = value.streetNumber

        if (
          streetName === undefined ||
          streetName === null ||
          (typeof streetName === "string" && streetName.trim() === "")
        ) {
          return FIELD_REQUIRED_IT
        }

        if (
          streetNumber === undefined ||
          streetNumber === null ||
          (typeof streetNumber === "string" && streetNumber.trim() === "")
        ) {
          return FIELD_REQUIRED_IT
        }

        return true
      }),
    fields: [
      defineField({
        name: "streetName",
        title: "Nome",
        type: "string",
      }),
      defineField({
        name: "streetNumber",
        title: "N. civico",
        type: "string",
      }),
    ],
  })
}
