"use client"

import { useCallback, useState } from "react"
import type { SanityImageSource } from "@sanity/image-url/lib/types/types"

import type { AppLocale } from "@/i18n/routing"

import { pickLocalizedPortableText } from "@/sanity/lib/locale"
import type { LocalizedPortableText } from "@/sanity/types"

import { useGsapReveal } from "@/hooks/useGsapReveal"

import { listYourPropertyHeroRecommendedCrop } from "@/lib/listYourPropertyHeroImage"
import { cn } from "@/utils/classNames"

import { Button } from "@/components/ui/Button"
import { Container } from "@/components/ui/Container"
import { ImageParallax } from "@/components/ui/ImageParallax"
import { PortableTextComponent } from "@/components/ui/PortableText"
import { SanityImage } from "@/components/ui/SanityImage"
import { TitleReveal } from "@/components/ui/TitleReveal"

const { landscape: heroLandscapeCrop, portrait: heroPortraitCrop } =
  listYourPropertyHeroRecommendedCrop

export type HeroContentProps = {
  locale: AppLocale
  title: string
  subtitle: string
  payoff1?: LocalizedPortableText | null
  payoff2?: LocalizedPortableText | null
  imageLandscape?: SanityImageSource | null
  imagePortrait?: SanityImageSource | null
  ctaLabel?: string
  ctaHref?: string
}

export function HeroContent({
  locale,
  title,
  subtitle,
  payoff1,
  payoff2,
  imageLandscape,
  imagePortrait,
  ctaLabel,
  ctaHref,
}: HeroContentProps) {
  const hasMedia = Boolean(imageLandscape ?? imagePortrait)
  const [imageReady, setImageReady] = useState(!hasMedia)
  const handleImageSettled = useCallback(() => {
    requestAnimationFrame(() => {
      setImageReady(true)
    })
  }, [])

  const { ref: wrapRef, show } = useGsapReveal({ ready: imageReady })

  const hasTitle = title.trim() !== ""
  const hasSubtitle = subtitle.trim() !== ""
  const hasPayoff1 = Boolean(pickLocalizedPortableText(payoff1, locale))
  const hasPayoff2 = Boolean(pickLocalizedPortableText(payoff2, locale))
  const showCta =
    (ctaLabel?.trim() ?? "") !== "" && (ctaHref?.trim() ?? "") !== ""

  if (
    !hasMedia &&
    !hasTitle &&
    !hasSubtitle &&
    !hasPayoff1 &&
    !hasPayoff2 &&
    !showCta
  ) {
    return null
  }

  const altFallback = hasTitle
    ? title
    : hasSubtitle
      ? subtitle
      : "Affidaci il tuo immobile"

  return (
    <div
      ref={wrapRef}
      style={{ opacity: 0 }}
      className="relative isolate w-full"
    >
      <Container
        className={cn(
          "flex flex-col gap-8",
          "md:flex-row md:justify-between lg:gap-24",
        )}
      >
        {hasTitle ? (
          <TitleReveal
            title={title}
            tag="h1"
            show={show}
            className="max-lg:text-[56px] max-w-[550px] lg:max-w-[900px] flex-1"
          />
        ) : null}

        {hasSubtitle ? (
          <p
            className={cn(
              "type-body-3",
              "md:self-end md:pb-[8px] lg:pb-[14px]",
            )}
          >
            {subtitle}
          </p>
        ) : null}
      </Container>

      {hasMedia ? (
        <div className="mt-12 pl-4 md:pl-8 lg:pl-12">
          <ImageParallax className="w-full aspect-square md:aspect-20/9">
            <SanityImage
              landscape={imageLandscape}
              portrait={imagePortrait}
              locale={locale}
              landscapeParams={{
                width: heroLandscapeCrop.width,
                height: heroLandscapeCrop.height,
                sizes: "(min-width: 1px) 100vw",
              }}
              portraitParams={{
                width: heroPortraitCrop.width,
                height: heroPortraitCrop.height,
                sizes: "(min-width: 1px) 100vw",
              }}
              fill
              priority
              altFallback={altFallback}
              className="object-cover object-center"
              onLoad={handleImageSettled}
              onError={handleImageSettled}
            />
          </ImageParallax>
        </div>
      ) : null}

      {/* CONTENT PART */}
      <Container
        className={cn(
          "flex flex-col gap-8",
          "md:flex-row md:justify-between md:gap-12",
          "py-16 md:py-24 lg:py-48",
          "lg:grid lg:grid-cols-12 lg:items-start lg:gap-4",
        )}
      >
        <div
          className={cn(
            "md:flex-1 lg:flex-auto",
            "lg:col-start-1 lg:col-span-5",
          )}
        >
          {hasPayoff1 ? (
            <PortableTextComponent
              text={payoff1}
              locale={locale}
              className="type-body-1 lg:type-heading-2"
            />
          ) : null}
        </div>

        <div
          className={cn(
            "md:flex-1",
            "lg:flex-auto lg:col-start-8 lg:col-span-4",
          )}
        >
          {hasPayoff2 ? (
            <PortableTextComponent
              text={payoff2}
              locale={locale}
              className={cn("type-body-3 text-gray", "lg:type-body-2")}
            />
          ) : null}

          {showCta ? (
            <Button
              href={ctaHref!}
              variant="primary"
              className="self-start mt-8"
            >
              {ctaLabel}
            </Button>
          ) : null}
        </div>
      </Container>
    </div>
  )
}
