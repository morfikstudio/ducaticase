"use client"

import { useEffect } from "react"

import type { AppLocale } from "@/i18n/routing"
import { pickLocalizedString } from "@/sanity/lib/locale"
import type { LocalizedPortableText, LocalizedString } from "@/sanity/types"

import { useGsapReveal } from "@/hooks/useGsapReveal"

import { cn } from "@/utils/classNames"

import { BaseForm } from "@/components/ui/BaseForm"
import { Container } from "@/components/ui/Container"
import { PortableTextComponent } from "@/components/ui/PortableText"

export type ContactFormProps = {
  id: string
  locale: AppLocale
  title?: LocalizedString | null
  subtitle?: LocalizedString | null
  text?: LocalizedPortableText | null
}

export function ContactForm({
  id,
  locale,
  title,
  subtitle,
  text,
}: ContactFormProps) {
  const { ref: wrapRef } = useGsapReveal()

  const resolvedTitle = pickLocalizedString(title ?? undefined, locale) ?? ""
  const resolvedSubtitle =
    pickLocalizedString(subtitle ?? undefined, locale) ?? ""
  const hasSideContent = resolvedSubtitle.trim() !== "" || Boolean(text)

  /* SCROLL TO FORM ON PAGE LOAD */
  useEffect(() => {
    const hash = window.location.hash
    if (!hash) return

    const targetId = hash.replace(/^#/, "")
    const timer = setTimeout(() => {
      document
        .getElementById(targetId)
        ?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  if (!id) {
    return null
  }

  return (
    <div
      ref={wrapRef}
      style={{ opacity: 0 }}
      id={id}
      className="pb-24 md:pb-32 lg:pb-48 pt-18 lg:pt-32"
    >
      <Container className="flex flex-col gap-[60px] md:gap-[140px]">
        {resolvedTitle.trim() !== "" ? (
          <h2 className="type-heading-2 text-gray md:max-w-[1000px]">
            {resolvedTitle}
          </h2>
        ) : null}

        <div
          className={cn(
            "grid grid-cols-1 gap-x-[32px] md:gap-x-[100px] gap-y-8",
            hasSideContent && "md:grid-cols-[minmax(0,1fr)_60%] md:gap-y-5",
          )}
        >
          {hasSideContent ? (
            <div className="flex flex-col gap-[20px]">
              {resolvedSubtitle.trim() !== "" ? (
                <p className="type-body-1 text-white md:type-heading-2">
                  {resolvedSubtitle}
                </p>
              ) : null}

              <PortableTextComponent
                text={text}
                locale={locale}
                className="type-body-2 text-white"
              />
            </div>
          ) : null}

          <div className={cn(!hasSideContent && "md:w-[60%]")}>
            <BaseForm />
          </div>
        </div>
      </Container>
    </div>
  )
}
