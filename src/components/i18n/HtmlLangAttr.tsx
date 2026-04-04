"use client"

import { useLocale } from "next-intl"
import { useEffect } from "react"

/** Syncs `document.documentElement.lang` with the `[locale]` route
 * (the root `<html>` is shared with /studio). */
export function HtmlLangAttr() {
  const locale = useLocale()

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return null
}
