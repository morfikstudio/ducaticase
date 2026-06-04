import { useMemo } from "react"

import type { AppLocale } from "@/i18n/routing"
import type { LocalizedPortableText } from "@/sanity/types"

import { useGsapReveal } from "@/hooks/useGsapReveal"
import { cn } from "@/utils/classNames"

import { PortableTextComponent } from "@/components/ui/PortableText"

type TextBlockProps = {
  title: string
  text?: LocalizedPortableText | null
  titleTag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  className?: string
  locale: AppLocale
}

export function TextBlock({
  title,
  text,
  titleTag = "h1",
  className = "",
  locale,
}: TextBlockProps) {
  const { ref: wrapRef } = useGsapReveal()

  const TitleTag = useMemo(() => {
    return titleTag || "h1"
  }, [titleTag])
  return (
    <div
      ref={wrapRef}
      className={cn(
        "px-4 lg:px-0",
        "lg:text-center lg:max-w-4xl lg:mx-auto",
        "flex flex-col gap-4 md:gap-8",
        className,
      )}
    >
      {title ? (
        <TitleTag
          className="type-body-1 md:type-heading-1 text-balance"
          dangerouslySetInnerHTML={{ __html: title }}
        />
      ) : null}

      {text ? (
        <PortableTextComponent
          text={text}
          locale={locale}
          className="type-body-3 md:type-body-1 text-gray"
        />
      ) : null}
    </div>
  )
}
