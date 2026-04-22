import type { SanityImageSource } from "@sanity/image-url/lib/types/types"

import type { AppLocale } from "@/i18n/routing"

import { listYourPropertyCoverRecommendedCrop } from "@/lib/listYourPropertyCoverImage"

import { cn } from "@/utils/classNames"

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
  const hasMedia = Boolean(imageLandscape ?? imagePortrait)
  if (!hasMedia) {
    return null
  }

  return (
    <div className={cn("relative isolate w-full", className)}>
      <div
        className={cn(
          "relative w-full overflow-hidden",
          "aspect-4/5 md:aspect-video",
        )}
      >
        <SanityImage
          landscape={imageLandscape}
          portrait={imagePortrait}
          locale={locale}
          landscapeParams={{
            width: coverLandscapeCrop.width,
            height: coverLandscapeCrop.height,
            sizes: "100vw",
          }}
          portraitParams={{
            width: coverPortraitCrop.width,
            height: coverPortraitCrop.height,
            sizes: "100vw",
          }}
          fill
          priority={priority}
          altFallback={altFallback}
          className="object-cover object-center"
        />
      </div>
    </div>
  )
}
