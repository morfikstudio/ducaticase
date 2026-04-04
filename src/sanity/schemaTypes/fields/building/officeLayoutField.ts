import { defineField } from "sanity"

import { SelectWithOtherObjectInput } from "../../../components/selectWithOtherObjectInput"
import { OFFICE_LAYOUT_OPTIONS } from "../../../lib/constants"
import { FIELD_REQUIRED_IT } from "../../../lib/validationMessages"

type OfficeLayoutValue = {
  choice?: string | null
  otherSpecification?: string | null
} | null

const officeLayoutObjectOptions = {
  selectWithOther: {
    choiceField: "choice",
    otherField: "otherSpecification",
    otherValue: "other",
  },
} as const

export type OfficeLayoutFieldOptions = {
  required?: boolean
  group?: string
}

export function officeLayoutField(options?: OfficeLayoutFieldOptions) {
  const required = options?.required ?? false

  return defineField({
    ...(options?.group ? { group: options.group } : {}),
    name: "officeLayout",
    title: "Disposizione interni",
    type: "object",
    options: officeLayoutObjectOptions as Record<string, unknown>,
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
        title: "Disposizione",
        type: "string",
        options: {
          list: [...OFFICE_LAYOUT_OPTIONS],
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
            const parent = context.parent as OfficeLayoutValue
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
