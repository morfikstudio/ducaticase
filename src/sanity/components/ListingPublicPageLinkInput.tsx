"use client"

import { useMemo } from "react"
import { getPublishedId, useFormValue, type StringInputProps } from "sanity"

import { routing } from "@/i18n/routing"
import { getSiteOrigin } from "@/seo/site-url"

const previewSecret = process.env.SANITY_STUDIO_LISTING_PREVIEW_SECRET

export function ListingPublicPageLinkInput(_props: StringInputProps) {
  const rawId = useFormValue(["_id"])
  const isArchived = useFormValue(["isArchived"]) === true

  const link = useMemo(() => {
    if (typeof rawId !== "string" || rawId.trim() === "") {
      return null
    }

    const publishedId = getPublishedId(rawId)
    const origin = getSiteOrigin()
    const locale = routing.defaultLocale

    if (isArchived) {
      if (!previewSecret?.trim()) {
        return null
      }

      const token = encodeURIComponent(previewSecret.trim())
      return {
        href: `${origin}/${locale}/preview/immobili/${encodeURIComponent(publishedId)}?token=${token}`,
        label: "Apri anteprima",
      }
    }

    return {
      href: `${origin}/${locale}/immobili/${encodeURIComponent(publishedId)}`,
      label: "Apri annuncio",
    }
  }, [rawId, isArchived])

  if (!link) {
    const message = isArchived
      ? "Configura SANITY_STUDIO_LISTING_PREVIEW_SECRET per aprire l'anteprima degli annunci archiviati."
      : "Il link sarà disponibile dopo il primo salvataggio del documento."

    return (
      <div
        style={{
          fontSize: 13,
          color: "var(--card-muted-fg-color, rgba(55,55,55,0.65))",
        }}
      >
        {message}
      </div>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontSize: 14,
          fontWeight: 500,
          color: "var(--link-color, #2276fc)",
          textDecoration: "underline",
        }}
      >
        {link.label}
      </a>
    </div>
  )
}
