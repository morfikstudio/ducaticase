import { DocumentTextIcon } from "@sanity/icons"
import { defineField, defineType } from "sanity"

import { apiVersion } from "../env"

const SECTION_OPTIONS = [{ title: "Footer", value: "footer" }] as const

type SectionType = (typeof SECTION_OPTIONS)[number]["value"]

type SiteContentDoc = {
  sectionType?: SectionType
}

export const siteContent = defineType({
  name: "siteContent",
  /** Invisible character to avoid the subtitle "Contenuti Sito" in the document panel. */
  title: "\u200B",
  type: "document",
  icon: DocumentTextIcon,
  initialValue: () => ({
    /** Used by the editor as document title (avoid "Untitled"). */
    title: "Footer",
    sectionType: "footer",
  }),
  validation: (Rule) =>
    Rule.custom(async (_value, context) => {
      const doc = context.document as
        | { _id?: string; sectionType?: string }
        | undefined
      if (!doc || doc.sectionType !== "footer") {
        return true
      }
      const id = doc._id
      if (!id) {
        return true
      }
      const ids = id.startsWith("drafts.")
        ? [id, id.slice("drafts.".length)]
        : [`drafts.${id}`, id]
      const client = context.getClient({ apiVersion })
      const duplicateCount = await client.fetch<number>(
        `count(*[_type == "siteContent" && sectionType == "footer" && !(_id in $ids)])`,
        { ids },
      )
      if (duplicateCount > 0) {
        return "Esiste già un documento Footer. Elimina quello esistente prima di crearne un altro."
      }
      return true
    }),
  fields: [
    defineField({
      name: "title",
      title: "Titolo",
      type: "string",
      initialValue: "Footer",
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "sectionType",
      title: "Sezione",
      type: "string",
      options: {
        list: [...SECTION_OPTIONS],
        layout: "radio",
      },
    }),
    defineField({
      name: "footer",
      title: "Footer",
      type: "footerSettings",
      hidden: ({ document }) =>
        (document as SiteContentDoc)?.sectionType !== "footer",
    }),
  ],
  preview: {
    select: {
      title: "title",
      sectionType: "sectionType",
    },
    prepare({ title, sectionType }) {
      const trimmed = typeof title === "string" ? title.trim() : ""
      if (trimmed !== "") {
        return { title: trimmed }
      }
      const option = SECTION_OPTIONS.find((o) => o.value === sectionType)
      return {
        title: option?.title ?? "Footer",
      }
    },
  },
})
