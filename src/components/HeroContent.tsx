"use client"

import { useCallback, useState } from "react"
import type { SanityImageSource } from "@sanity/image-url/lib/types/types"

import type { AppLocale } from "@/i18n/routing"

import { listYourPropertyHeroRecommendedCrop } from "@/lib/listYourPropertyHeroImage"
import { useGsapReveal } from "@/hooks/useGsapReveal"

import { cn } from "@/utils/classNames"

import { Button } from "@/components/ui/Button"
import { Container } from "@/components/ui/Container"
import { SanityImage } from "@/components/ui/SanityImage"

const { landscape: heroLandscapeCrop, portrait: heroPortraitCrop } =
  listYourPropertyHeroRecommendedCrop

export type HeroContentProps = {
  locale: AppLocale
  title: string
  subtitle: string
  payoff1: string
  payoff2: string
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

  const { ref: wrapRef } = useGsapReveal({ ready: imageReady })

  const hasTitle = title.trim() !== ""
  const hasSubtitle = subtitle.trim() !== ""
  const hasPayoff1 = payoff1.trim() !== ""
  const hasPayoff2 = payoff2.trim() !== ""
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
          <h1
            className={cn(
              "type-display-1",
              "max-lg:text-[56px] max-lg:leading-[56px]",
              "md:max-w-[500px] lg:max-w-[900px]",
              "flex-1",
            )}
          >
            {title}
          </h1>
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
          <div
            className={cn(
              "relative w-full overflow-hidden",
              "aspect-square md:aspect-20/9",
            )}
          >
            <SanityImage
              landscape={imageLandscape}
              portrait={imagePortrait}
              locale={locale}
              landscapeParams={{
                width: heroLandscapeCrop.width,
                height: heroLandscapeCrop.height,
                quality: 82,
                sizes: "(min-width: 768px) min(1331px, 90vw), 100vw",
              }}
              portraitParams={{
                width: heroPortraitCrop.width,
                height: heroPortraitCrop.height,
                quality: 82,
                sizes: "100vw",
              }}
              fill
              priority
              altFallback={altFallback}
              className="object-cover object-center"
              onLoad={handleImageSettled}
              onError={handleImageSettled}
            />
          </div>
        </div>
      ) : null}

      {/* CONTENT PART */}
      <Container
        className={cn(
          "flex flex-col gap-8",
          "md:flex-row md:justify-between md:gap-12",
          "py-16 md:py-24 lg:py-48",
        )}
      >
        <div className="md:flex-1">
          {hasPayoff1 ? (
            <p className="type-body-1 lg:type-heading-2 lg:max-w-[500px]">
              {payoff1}
            </p>
          ) : null}
        </div>

        <div className="md:flex-1">
          {hasPayoff2 ? (
            <p
              className={cn(
                "type-body-3 text-gray",
                "lg:max-w-[400px] lg:type-body-2",
              )}
            >
              {payoff2}
            </p>
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
