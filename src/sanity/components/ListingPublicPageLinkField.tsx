"use client"

import { getPublishedId, useEditState, useFormValue } from "sanity"
import type { FieldProps } from "sanity"

export function ListingPublicPageLinkField(props: FieldProps) {
  const rawId = useFormValue(["_id"]) as string
  const docType = useFormValue(["_type"]) as string
  const publishedId = typeof rawId === "string" ? getPublishedId(rawId) : ""
  const { published } = useEditState(publishedId, docType)

  if (!published) return null
  return props.renderDefault(props)
}
