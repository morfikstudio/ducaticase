import { defineField, defineType } from "sanity"

import { FIELD_REQUIRED_IT } from "../../lib/validationMessages"

type LocalizedStringValue = { it?: string; en?: string } | undefined

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

export const listYourPropertyServiceItem = defineType({
  name: "listYourPropertyServiceItem",
  title: "Servizio",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Titolo",
      type: "localizedString",
      validation: (Rule) =>
        Rule.custom((value: LocalizedStringValue) => {
          const it = value?.it?.trim() ?? ""
          return it !== "" ? true : FIELD_REQUIRED_IT
        }),
    }),
    defineField({
      name: "text",
      title: "Testo",
      type: "localizedPortableText",
      validation: (Rule) =>
        Rule.custom((value: LocalizedPT) =>
          portableTextHasContent(
            value?.it as Parameters<typeof portableTextHasContent>[0],
          )
            ? true
            : FIELD_REQUIRED_IT,
        ),
    }),
  ],
  preview: {
    select: {
      titleIt: "title.it",
    },
    prepare({ titleIt }) {
      const title =
        typeof titleIt === "string" && titleIt.trim() !== ""
          ? titleIt.trim()
          : "Servizio"
      return { title }
    },
  },
})
