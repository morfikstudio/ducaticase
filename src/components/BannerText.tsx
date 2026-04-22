import type { AppLocale } from "@/i18n/routing"

import { pickLocalizedString } from "@/sanity/lib/locale"
import type { LocalizedPortableText, LocalizedString } from "@/sanity/types"

import { cn } from "@/utils/classNames"

import { Button } from "@/components/ui/Button"
import { Container } from "@/components/ui/Container"
import { PortableTextComponent } from "@/components/ui/PortableText"

export type BannerTextProps = {
  locale: AppLocale
  title?: LocalizedString | null
  text?: LocalizedPortableText | null
  ctaLabel?: LocalizedString | null
  ctaHref?: string
  className?: string
}

export function BannerText({
  locale,
  title,
  text,
  ctaLabel,
  ctaHref,
  className,
}: BannerTextProps) {
  const resolvedTitle = pickLocalizedString(title ?? undefined, locale) ?? ""
  const resolvedCtaLabel =
    pickLocalizedString(ctaLabel ?? undefined, locale) ?? ""
  const showCta =
    resolvedCtaLabel.trim() !== "" && (ctaHref?.trim() ?? "") !== ""

  const hasContent = resolvedTitle.trim() !== "" || Boolean(text) || showCta
  if (!hasContent) {
    return null
  }

  return (
    <div
      className={cn(
        "w-full py-24 md:py-32 lg:py-48",
        "bg-primary text-accent",
        className,
      )}
    >
      <Container
        className={cn(
          "flex flex-col gap-8",
          "md:gap-12 md:flex-row md:justify-center md:items-start",
          "lg:gap-32",
        )}
      >
        {resolvedTitle.trim() !== "" ? (
          <h2
            className={cn(
              "type-heading-2 lg:type-heading-1",
              "md:flex-1",
              "lg:max-w-[470px]",
            )}
          >
            {resolvedTitle}
          </h2>
        ) : null}

        <div className={cn("md:flex-1", "lg:max-w-[600px]")}>
          <PortableTextComponent
            text={text}
            locale={locale}
            className="type-body-3 lg:type-body-1"
          />

          {showCta ? (
            <Button
              href={ctaHref!}
              variant="dark"
              className="self-start mt-8 lg:mt-10"
            >
              {resolvedCtaLabel}
            </Button>
          ) : null}
        </div>
      </Container>
    </div>
  )
}
