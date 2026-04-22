import { DocumentTextIcon } from "@sanity/icons"
import { defineField, defineType } from "sanity"

import { apiVersion } from "../env"

const SECTION_OPTIONS = [
  { title: "Footer", value: "footer" },
  { title: "Menu", value: "menu" },
  { title: "Home", value: "homePage" },
  { title: "Chi siamo", value: "aboutPage" },
  { title: "Affidaci il tuo immobile", value: "listYourPropertyPage" },
] as const

type SectionType = (typeof SECTION_OPTIONS)[number]["value"]

const SITE_CONTENT_LIST_PREVIEW_TITLE: Record<
  "footer" | "menu" | "homePage" | "aboutPage" | "listYourPropertyPage",
  string
> = {
  footer: "Footer",
  menu: "Menu",
  homePage: "Home",
  aboutPage: "Chi siamo",
  listYourPropertyPage: "Affidaci il tuo immobile",
}

type SiteContentDoc = {
  sectionType?: SectionType
}

function titleAndSectionForNewDocument(document: SiteContentDoc | undefined): {
  title: string
  sectionType: SectionType
} {
  if (document?.sectionType === "menu") {
    return { title: "Menu", sectionType: "menu" }
  }
  if (document?.sectionType === "homePage") {
    return { title: "Home", sectionType: "homePage" }
  }
  if (document?.sectionType === "aboutPage") {
    return { title: "Chi siamo", sectionType: "aboutPage" }
  }
  if (document?.sectionType === "listYourPropertyPage") {
    return {
      title: "Affidaci il tuo immobile",
      sectionType: "listYourPropertyPage",
    }
  }
  return { title: "Footer", sectionType: "footer" }
}

export const siteContent = defineType({
  name: "siteContent",
  /** Invisible character to avoid the subtitle "Contenuti Sito" in the document panel. */
  title: "\u200B",
  type: "document",
  icon: DocumentTextIcon,
  initialValue: ({ document }) => {
    const { title, sectionType } = titleAndSectionForNewDocument(
      document as SiteContentDoc | undefined,
    )
    return { title, sectionType }
  },
  validation: (Rule) =>
    Rule.custom(async (_value, context) => {
      const doc = context.document as
        | { _id?: string; sectionType?: string }
        | undefined
      if (!doc?.sectionType) {
        return true
      }
      if (
        doc.sectionType !== "footer" &&
        doc.sectionType !== "menu" &&
        doc.sectionType !== "homePage" &&
        doc.sectionType !== "aboutPage" &&
        doc.sectionType !== "listYourPropertyPage"
      ) {
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
      const section = doc.sectionType
      const duplicateCount = await client.fetch<number>(
        `count(*[_type == "siteContent" && sectionType == $section && !(_id in $ids)])`,
        { ids, section },
      )
      if (duplicateCount > 0) {
        const label =
          section === "footer"
            ? "Footer"
            : section === "menu"
              ? "Menu"
              : section === "homePage"
                ? "Home"
                : section === "aboutPage"
                  ? "Chi siamo"
                  : section === "listYourPropertyPage"
                    ? "Affidaci il tuo immobile"
                    : section
        return `Esiste già un documento ${label}. Elimina quello esistente prima di crearne un altro.`
      }
      return true
    }),
  fields: [
    defineField({
      name: "title",
      title: "Titolo",
      type: "string",
      initialValue: ({ document }) => {
        const { title } = titleAndSectionForNewDocument(
          document as SiteContentDoc | undefined,
        )
        return title
      },
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
      title: "Contenuto",
      type: "footerSettings",
      hidden: ({ document }) =>
        (document as SiteContentDoc)?.sectionType !== "footer",
    }),
    defineField({
      name: "menu",
      title: "Contenuto",
      type: "menuSettings",
      hidden: ({ document }) =>
        (document as SiteContentDoc)?.sectionType !== "menu",
    }),
    defineField({
      name: "homePage",
      title: "Contenuto",
      type: "homePageSettings",
      hidden: ({ document }) =>
        (document as SiteContentDoc)?.sectionType !== "homePage",
    }),
    defineField({
      name: "aboutPage",
      title: "Contenuto",
      type: "aboutPageSettings",
      hidden: ({ document }) =>
        (document as SiteContentDoc)?.sectionType !== "aboutPage",
    }),
    defineField({
      name: "listYourPropertyPage",
      title: "Contenuto",
      type: "listYourPropertyPageSettings",
      hidden: ({ document }) =>
        (document as SiteContentDoc)?.sectionType !== "listYourPropertyPage",
    }),
  ],
  preview: {
    select: {
      title: "title",
      sectionType: "sectionType",
    },
    prepare({ title, sectionType }) {
      if (
        sectionType === "footer" ||
        sectionType === "menu" ||
        sectionType === "homePage" ||
        sectionType === "aboutPage" ||
        sectionType === "listYourPropertyPage"
      ) {
        const key = sectionType as keyof typeof SITE_CONTENT_LIST_PREVIEW_TITLE
        return {
          title: SITE_CONTENT_LIST_PREVIEW_TITLE[key],
        }
      }
      const trimmed = typeof title === "string" ? title.trim() : ""
      if (trimmed !== "") {
        return { title: trimmed }
      }
      const option = SECTION_OPTIONS.find((o) => o.value === sectionType)
      return {
        title: option?.title ?? "Contenuto sito",
      }
    },
  },
})
