"use client"

import type { SanityImageSource } from "@sanity/image-url/lib/types/types"

import type { AppLocale } from "@/i18n/routing"

import { useGsapReveal } from "@/hooks/useGsapReveal"

import { listYourPropertyCoverRecommendedCrop } from "@/lib/listYourPropertyCoverImage"

import { cn } from "@/utils/classNames"

import { ImageParallax } from "@/components/ui/ImageParallax"
import { SanityImage } from "@/components/ui/SanityImage"

const { landscape: coverLandscapeCrop, portrait: coverPortraitCrop } =
  listYourPropertyCoverRecommendedCrop

export type CoverProps = {
  locale: AppLocale
  imageLandscape?: SanityImageSource | null
  imagePortrait?: SanityImageSource | null
  altFallback?: string
  priority?: boolean
  className?: string
}

export function Cover({
  locale,
  imageLandscape,
  imagePortrait,
  altFallback = "Affidaci il tuo immobile",
  priority = false,
  className,
}: CoverProps) {
  const { ref: wrapRef } = useGsapReveal({ fromY: 0 })

  const hasMedia = Boolean(imageLandscape ?? imagePortrait)

  if (!hasMedia) {
    return null
  }

  return (
    <div
      ref={wrapRef}
      style={{ opacity: 0 }}
      className={cn("relative isolate w-full", className)}
    >
      <ImageParallax
        variant="prominent"
        className={cn("w-full", "aspect-4/5 md:aspect-video")}
      >
        <SanityImage
          landscape={imageLandscape}
          portrait={imagePortrait}
          locale={locale}
          landscapeParams={{
            width: coverLandscapeCrop.width,
            height: coverLandscapeCrop.height,
            sizes: "(min-width: 1px) 100vw",
          }}
          portraitParams={{
            width: coverPortraitCrop.width,
            height: coverPortraitCrop.height,
            sizes: "(min-width: 1px) 100vw",
          }}
          fill
          priority={priority}
          altFallback={altFallback}
          className="object-cover object-center"
        />
      </ImageParallax>
    </div>
  )
}
