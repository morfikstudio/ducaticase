"use client"

import { PortableText } from "@portabletext/react"
import type { PortableTextBlock } from "@portabletext/types"
import type { AppLocale } from "@/i18n/routing"
import { pickLocalizedPortableText } from "@/sanity/lib/locale"
import { cn } from "@/utils/classNames"

type Props = {
  text: Parameters<typeof pickLocalizedPortableText>[0]
  locale: AppLocale
  className?: string
}

export function PortableTextComponent({ text, locale, className }: Props) {
  const description = pickLocalizedPortableText(text, locale)

  const descriptionBlocks =
    Array.isArray(description) && description.length > 0
      ? (description as PortableTextBlock[])
      : undefined

  if (!descriptionBlocks) {
    return null
  }

  return (
    <div className={cn(className)}>
      <PortableText value={descriptionBlocks} />
    </div>
  )
}
