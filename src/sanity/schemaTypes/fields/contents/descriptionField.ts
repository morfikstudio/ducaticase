import { defineField } from "sanity"

import { FIELD_REQUIRED_IT } from "../../../lib/validationMessages"

export type DescriptionFieldOptions = {
  required?: boolean
  group?: string
}

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

export function descriptionField(options?: DescriptionFieldOptions) {
  const required = options?.required ?? false

  return defineField({
    ...(options?.group ? { group: options.group } : {}),
    name: "description",
    title: "Descrizione",
    type: "localizedPortableText",
    validation: (Rule) =>
      Rule.custom((value: LocalizedPT) => {
        if (!required) {
          return true
        }

        return portableTextHasContent(
          value?.it as Parameters<typeof portableTextHasContent>[0],
        )
          ? true
          : FIELD_REQUIRED_IT
      }),
  })
}
