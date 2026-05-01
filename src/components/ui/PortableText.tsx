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
    <div
      className={cn(
        "[&_ul]:my-3 [&_ul]:list-disc [&_ul]:ps-6",
        "[&_ol]:my-3 [&_ol]:list-decimal [&_ol]:ps-6",
        "[&_li]:my-1",
        "[&_p]:min-h-6",
        className,
      )}
    >
      <PortableText
        value={descriptionBlocks}
        components={{
          block: {
            caption: ({ children }) => (
              <p className="type-body-3">{children}</p>
            ),
          },
          marks: {
            strong: ({ children }) => (
              <strong className="font-medium text-inherit">{children}</strong>
            ),
          },
        }}
      />
    </div>
  )
}
