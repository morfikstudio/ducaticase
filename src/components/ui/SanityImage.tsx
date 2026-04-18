import type { ReactEventHandler } from "react"
import Image from "next/image"
import type { SanityImageSource } from "@sanity/image-url/lib/types/types"

import type { AppLocale } from "@/i18n/routing"
import { pickLocalizedString } from "@/sanity/lib/locale"
import type { LocalizedString } from "@/sanity/types"

import { getSanityImageUrl } from "@/lib/sanity"
import { cn } from "@/utils/classNames"

function localizedAltFromSource(
  image: SanityImageSource | null | undefined,
): LocalizedString | undefined {
  if (!image || typeof image !== "object" || !("alt" in image)) {
    return undefined
  }
  const raw = (image as { alt?: LocalizedString | null }).alt
  return raw ?? undefined
}

/**
 * Resolves the `alt` string: optional `alt` prop wins; otherwise localized
 * `alt` from desktop image, then mobile, using `locale`; if still empty,
 * `altFallback` (e.g. section title).
 */
export function resolveSanityImageAlt(options: {
  alt?: string
  locale?: AppLocale
  desktop?: SanityImageSource | null
  mobile?: SanityImageSource | null
  altFallback?: string
}): string {
  const { alt, locale, desktop, mobile, altFallback } = options

  if (alt !== undefined) {
    return alt
  }

  if (locale) {
    const fromCms =
      pickLocalizedString(localizedAltFromSource(desktop), locale) ??
      pickLocalizedString(localizedAltFromSource(mobile), locale) ??
      ""
    if (fromCms.trim() !== "") {
      return fromCms
    }
  }

  return altFallback?.trim() ?? ""
}

type ImageParams = {
  /** Used both to build the Sanity CDN URL and as the Next.js Image `width` hint. */
  width: number
  /** Optional height for Sanity crop; omit for fluid aspect ratio. */
  height?: number
  /** Compression quality 1–100 (default 80). */
  quality?: number
  /** Next.js `sizes` hint for this breakpoint variant. */
  sizes?: string
}

type SanityImageProps = {
  /** Desktop image source from Sanity (at least one of desktop/mobile required). */
  desktop?: SanityImageSource | null
  /** Mobile image source from Sanity (at least one of desktop/mobile required). */
  mobile?: SanityImageSource | null

  /**
   * When set, overrides `alt` from the Sanity image fields (`alt` localized on
   * desktop, then mobile). Omit to derive from CMS using `locale`.
   */
  alt?: string

  /** Locale used to pick localized `alt` from Sanity when `alt` is omitted. */
  locale?: AppLocale

  /** If CMS `alt` is empty and `alt` prop is omitted, use this string (e.g. heading). */
  altFallback?: string

  /** Params for URL generation and Next.js Image dimensions — desktop variant. */
  desktopParams: ImageParams
  /** Params for URL generation and Next.js Image dimensions — mobile variant.
   *  Falls back to `desktopParams` when omitted. */
  mobileParams?: ImageParams

  /** Tailwind breakpoint at which the desktop image is shown (default "md").
   *  Below the breakpoint the mobile image is shown. */
  breakpoint?: "sm" | "md" | "lg" | "xl"

  /** Use Next.js fill mode — the parent must have `position: relative/absolute/fixed`.
   *  When true, `width` / `height` are not passed to <Image> (only used for Sanity URL). */
  fill?: boolean

  priority?: boolean

  /** Applied to every <Image> rendered by this component. */
  className?: string

  onLoad?: ReactEventHandler<HTMLImageElement>
  onError?: ReactEventHandler<HTMLImageElement>
}

const BREAKPOINT_CLASSES = {
  sm: { desktop: "hidden sm:block", mobile: "sm:hidden" },
  md: { desktop: "hidden md:block", mobile: "md:hidden" },
  lg: { desktop: "hidden lg:block", mobile: "lg:hidden" },
  xl: { desktop: "hidden xl:block", mobile: "xl:hidden" },
} as const

/** Next.js `Image` needs a positive height for aspect ratio when `fill` is false. */
function intrinsicImageHeight(width: number, height?: number): number {
  if (height != null && height > 0) return height
  return Math.round((width * 3) / 4)
}

export function SanityImage({
  desktop,
  mobile,
  alt,
  locale,
  altFallback,
  desktopParams,
  mobileParams,
  breakpoint = "md",
  fill = false,
  priority = false,
  className,
  onLoad,
  onError,
}: SanityImageProps) {
  const dp = desktopParams
  const mp = mobileParams ?? desktopParams

  const resolvedAlt = resolveSanityImageAlt({
    alt,
    locale,
    desktop,
    mobile,
    altFallback,
  })

  const desktopUrl = getSanityImageUrl(desktop, dp.width, dp.height, dp.quality)
  const mobileUrl = getSanityImageUrl(mobile, mp.width, mp.height, mp.quality)

  const hasBoth = Boolean(desktopUrl && mobileUrl)
  const bpClasses = BREAKPOINT_CLASSES[breakpoint]

  const sharedProps = {
    alt: resolvedAlt,
    priority,
    onLoad,
    onError,
  } as const

  if (hasBoth && desktopUrl && mobileUrl) {
    return (
      <>
        <Image
          {...sharedProps}
          src={desktopUrl}
          {...(fill
            ? { fill: true }
            : {
                width: dp.width,
                height: intrinsicImageHeight(dp.width, dp.height),
                style: { width: "100%", height: "auto" },
              })}
          sizes={dp.sizes}
          className={cn(bpClasses.desktop, className)}
        />
        <Image
          {...sharedProps}
          src={mobileUrl}
          {...(fill
            ? { fill: true }
            : {
                width: mp.width,
                height: intrinsicImageHeight(mp.width, mp.height),
                style: { width: "100%", height: "auto" },
              })}
          sizes={mp.sizes}
          className={cn(bpClasses.mobile, className)}
        />
      </>
    )
  }

  const singleUrl = desktopUrl ?? mobileUrl
  const singleParams = desktopUrl ? dp : mp

  if (!singleUrl) return null

  return (
    <Image
      {...sharedProps}
      src={singleUrl}
      {...(fill
        ? { fill: true }
        : {
            width: singleParams.width,
            height: intrinsicImageHeight(
              singleParams.width,
              singleParams.height,
            ),
            style: { width: "100%", height: "auto" },
          })}
      sizes={singleParams.sizes}
      className={className}
    />
  )
}
