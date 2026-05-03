"use client"

import { useMemo } from "react"
import { getPublishedId, useFormValue, type StringInputProps } from "sanity"

import { routing } from "@/i18n/routing"
import { getSiteOrigin } from "@/seo/site-url"

export function ListingPublicPageLinkInput(_props: StringInputProps) {
  const rawId = useFormValue(["_id"])

  const href = useMemo(() => {
    if (typeof rawId !== "string" || rawId.trim() === "") {
      return null
    }

    const publishedId = getPublishedId(rawId)
    const origin = getSiteOrigin()
    const locale = routing.defaultLocale

    return `${origin}/${locale}/immobili/${encodeURIComponent(publishedId)}`
  }, [rawId])

  if (!href) {
    return (
      <div
        style={{
          fontSize: 13,
          color: "var(--card-muted-fg-color, rgba(55,55,55,0.65))",
        }}
      >
        Il link sarà disponibile dopo il primo salvataggio del documento.
      </div>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontSize: 14,
          fontWeight: 500,
          color: "var(--link-color, #2276fc)",
          textDecoration: "underline",
        }}
      >
        Apri annuncio
      </a>
    </div>
  )
}
