import { defineField, defineType } from "sanity"

import { FIELD_REQUIRED_IT } from "../../lib/validationMessages"

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

export const homeTestimonialItem = defineType({
  name: "homeTestimonialItem",
  title: "Testimonianza",
  type: "object",
  fields: [
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
    defineField({
      name: "name",
      title: "Nome",
      type: "string",
      validation: (Rule) =>
        Rule.custom((value: string | undefined) => {
          const v = value?.trim() ?? ""
          return v !== "" ? true : FIELD_REQUIRED_IT
        }),
    }),
    defineField({
      name: "provider",
      title: "Provider",
      type: "string",
      options: {
        list: [{ title: "Google", value: "google" }],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      name: "name",
      provider: "provider",
    },
    prepare({ name, provider }) {
      const n = typeof name === "string" && name.trim() !== "" ? name.trim() : "Testimonianza"
      const p = provider === "google" ? "Google" : provider
      return { title: n, subtitle: p }
    },
  },
})
