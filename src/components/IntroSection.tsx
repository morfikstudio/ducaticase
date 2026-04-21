"use client"

import type { AppLocale } from "@/i18n/routing"
import { pickLocalizedPortableText } from "@/sanity/lib/locale"

import { useGsapReveal } from "@/hooks/useGsapReveal"

import { cn } from "@/utils/classNames"

import { Button } from "@/components/ui/Button"
import { Container } from "@/components/ui/Container"
import { PortableTextComponent } from "@/components/ui/PortableText"

const text1ClassName = cn(
  "[&_p]:type-body-1",
  "[&_p+p]:mt-4",
  "[&_ul]:type-body-1 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5",
  "[&_ol]:type-body-1 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-5",
  "[&_li]:mt-1",
  "[&_strong]:font-semibold",
)

const text2ClassName = cn(
  "text-gray",
  "[&_p]:type-body-2",
  "[&_p+p]:mt-4",
  "[&_ul]:type-body-2 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5",
  "[&_ol]:type-body-2 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-5",
  "[&_li]:mt-1",
  "[&_strong]:font-semibold",
)

export type IntroSectionPortableText = Parameters<
  typeof pickLocalizedPortableText
>[0]

type IntroSectionProps = {
  locale: AppLocale
  text1?: IntroSectionPortableText
  text2?: IntroSectionPortableText
  ctaLabel?: string
  ctaHref?: string
}

function hasPortableBlocks(
  text: IntroSectionPortableText | undefined,
  locale: AppLocale,
): boolean {
  const blocks = pickLocalizedPortableText(text, locale)
  return Array.isArray(blocks) && blocks.length > 0
}

export function IntroSection({
  locale,
  text1,
  text2,
  ctaLabel,
  ctaHref,
}: IntroSectionProps) {
  const show1 = hasPortableBlocks(text1, locale)
  const show2 = hasPortableBlocks(text2, locale)
  const showCta =
    (ctaLabel?.trim() ?? "") !== "" && (ctaHref?.trim() ?? "") !== ""

  if (!show1 && !show2 && !showCta) {
    return null
  }

  const { ref: wrapRef } = useGsapReveal()

  const rightColumnRowStart =
    show1 && show2 ? "lg:row-start-2" : "lg:row-start-1"
  const ctaOnRight = showCta && (show2 || !show1)
  const ctaOnLeft = showCta && !show2 && show1
  const showRightColumn = show2 || ctaOnRight

  return (
    <Container>
      <div
        ref={wrapRef}
        className={cn(
          "grid w-full grid-cols-1 gap-12",
          "lg:grid-cols-12 lg:gap-x-0 lg:gap-y-20",
        )}
        style={{ opacity: 0 }}
      >
        {show1 ? (
          <div className="flex min-w-0 flex-col gap-8 lg:col-span-7 lg:col-start-1 lg:row-start-1">
            <PortableTextComponent
              text={text1}
              locale={locale}
              className={text1ClassName}
            />
            {ctaOnLeft ? (
              <Button href={ctaHref} variant="primary" className="self-start">
                {ctaLabel}
              </Button>
            ) : null}
          </div>
        ) : null}

        {showRightColumn ? (
          <div
            className={cn(
              "flex min-w-0 flex-col gap-12 lg:gap-24",
              "lg:col-span-7 lg:col-start-6",
              rightColumnRowStart,
            )}
          >
            {show2 ? (
              <PortableTextComponent
                text={text2}
                locale={locale}
                className={text2ClassName}
              />
            ) : null}

            {ctaOnRight ? (
              <Button href={ctaHref} variant="primary" className="self-start">
                {ctaLabel}
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </Container>
  )
}
