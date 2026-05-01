"use client"

import { useCallback, useEffect } from "react"

import type { AppLocale } from "@/i18n/routing"

import { pickLocalizedString } from "@/sanity/lib/locale"
import type { LocalizedPortableText, LocalizedString } from "@/sanity/types"

import { useGsapReveal } from "@/hooks/useGsapReveal"

import { cn } from "@/utils/classNames"

import { Button } from "@/components/ui/Button"
import { Container } from "@/components/ui/Container"
import { PortableTextComponent } from "@/components/ui/PortableText"

export type BannerFormProps = {
  locale: AppLocale
  title?: LocalizedString | null
  text?: LocalizedPortableText | null
  ctaLabel?: LocalizedString | null
  ctaHref?: string
  className?: string
}

export function BannerForm({
  locale,
  title,
  text,
  ctaLabel,
  ctaHref,
  className,
}: BannerFormProps) {
  const { ref: wrapRef } = useGsapReveal()

  const resolvedTitle = pickLocalizedString(title ?? undefined, locale) ?? ""
  const resolvedCtaLabel =
    pickLocalizedString(ctaLabel ?? undefined, locale) ?? ""
  const showCta =
    resolvedCtaLabel.trim() !== "" && (ctaHref?.trim() ?? "").startsWith("#")

  const hasContent = resolvedTitle.trim() !== "" || Boolean(text) || showCta
  if (!hasContent) {
    return null
  }

  const onClick = useCallback(() => {
    const id = (ctaHref ?? "").replace(/^#/, "")

    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" })

    setTimeout(() => {
      window.history.pushState({}, "", `${window.location.pathname}#${id}`)
    }, 200)
  }, [ctaHref])

  return (
    <div
      className={cn(
        "w-full py-24 md:py-32 lg:py-48",
        "bg-primary text-accent",
        className,
      )}
    >
      <div ref={wrapRef} style={{ opacity: 0 }}>
        <Container
          className={cn(
            "flex flex-col gap-8",
            "md:gap-12 md:flex-row md:justify-center md:items-start",
            "lg:gap-32",
          )}
        >
          <div>
            {resolvedTitle.trim() !== "" ? (
              <h2
                className={cn(
                  "type-heading-2",
                  "md:flex-1",
                  "lg:max-w-[470px]",
                )}
              >
                {resolvedTitle}
              </h2>
            ) : null}

            {showCta ? (
              <Button
                onClick={onClick}
                variant="reverse"
                className="self-start mt-8"
              >
                {resolvedCtaLabel}
              </Button>
            ) : null}
          </div>

          <div className={cn("md:flex-1", "lg:max-w-[600px]")}>
            <PortableTextComponent
              text={text}
              locale={locale}
              className="type-body-2"
            />
          </div>
        </Container>
      </div>
    </div>
  )
}
