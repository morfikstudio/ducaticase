import { defineField } from "sanity"

import { SelectWithOtherObjectInput } from "../../../components/selectWithOtherObjectInput"
import { LAND_ACCESS_OPTIONS } from "../../../lib/constants"
import { FIELD_REQUIRED_IT } from "../../../lib/validationMessages"

type LandAccessValue = {
  choice?: string | null
  otherSpecification?: string | null
} | null

const landAccessObjectOptions = {
  selectWithOther: {
    choiceField: "choice",
    otherField: "otherSpecification",
    otherValue: "other",
  },
} as const

export type LandAccessFieldOptions = {
  required?: boolean
  group?: string
}

export function landAccessField(options?: LandAccessFieldOptions) {
  const required = options?.required ?? false

  return defineField({
    ...(options?.group ? { group: options.group } : {}),
    name: "landAccess",
    title: "Accesso",
    type: "object",
    options: landAccessObjectOptions as Record<string, unknown>,
    components: {
      input: SelectWithOtherObjectInput,
    },
    validation: (Rule) =>
      Rule.custom((value: Record<string, unknown> | undefined) => {
        if (!required) {
          return true
        }

        if (value == null || typeof value !== "object") {
          return FIELD_REQUIRED_IT
        }

        const choice = value["choice"]
        if (
          choice === undefined ||
          choice === null ||
          (typeof choice === "string" && choice.trim() === "")
        ) {
          return FIELD_REQUIRED_IT
        }

        if (choice === "other") {
          const spec = value["otherSpecification"]
          if (
            spec === undefined ||
            spec === null ||
            (typeof spec === "string" && spec.trim() === "")
          ) {
            return FIELD_REQUIRED_IT
          }
        }

        return true
      }),
    fields: [
      defineField({
        name: "choice",
        title: "Tipo",
        type: "string",
        options: {
          list: [...LAND_ACCESS_OPTIONS],
        },
        validation: (Rule) =>
          Rule.custom((fieldValue) => {
            if (!required) {
              return true
            }
            if (
              fieldValue === undefined ||
              fieldValue === null ||
              (typeof fieldValue === "string" && fieldValue.trim() === "")
            ) {
              return FIELD_REQUIRED_IT
            }
            return true
          }),
      }),
      defineField({
        name: "otherSpecification",
        title: "Specifica",
        type: "string",
        validation: (Rule) =>
          Rule.custom((fieldValue, context) => {
            const parent = context.parent as LandAccessValue
            if (parent?.choice !== "other") {
              return true
            }
            if (
              fieldValue === undefined ||
              fieldValue === null ||
              (typeof fieldValue === "string" && fieldValue.trim() === "")
            ) {
              return FIELD_REQUIRED_IT
            }
            return true
          }),
      }),
    ],
  })
}
