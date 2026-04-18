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
 * `alt` from the landscape image, then portrait, using `locale`; if still empty,
 * `altFallback` (e.g. section title).
 */
export function resolveSanityImageAlt(options: {
  alt?: string
  locale?: AppLocale
  landscape?: SanityImageSource | null
  portrait?: SanityImageSource | null
  altFallback?: string
}): string {
  const { alt, locale, landscape, portrait, altFallback } = options

  if (alt !== undefined) {
    return alt
  }

  if (locale) {
    const fromCms =
      pickLocalizedString(localizedAltFromSource(landscape), locale) ??
      pickLocalizedString(localizedAltFromSource(portrait), locale) ??
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
  /** Landscape-oriented asset (shown from `breakpoint` upward). */
  landscape?: SanityImageSource | null
  /** Portrait-oriented asset (shown below `breakpoint`). */
  portrait?: SanityImageSource | null

  /**
   * When set, overrides `alt` from the Sanity image fields (`alt` localized on
   * landscape, then portrait). Omit to derive from CMS using `locale`.
   */
  alt?: string

  /** Locale used to pick localized `alt` from Sanity when `alt` is omitted. */
  locale?: AppLocale

  /** If CMS `alt` is empty and `alt` prop is omitted, use this string (e.g. heading). */
  altFallback?: string

  /** Params for URL generation and Next.js Image dimensions — landscape variant. */
  landscapeParams: ImageParams
  /** Params for URL generation and Next.js Image dimensions — portrait variant.
   *  Falls back to `landscapeParams` when omitted. */
  portraitParams?: ImageParams

  /** Tailwind breakpoint from which the landscape image is shown (default "md").
   *  Below the breakpoint the portrait image is shown. */
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
  sm: { landscape: "hidden sm:block", portrait: "sm:hidden" },
  md: { landscape: "hidden md:block", portrait: "md:hidden" },
  lg: { landscape: "hidden lg:block", portrait: "lg:hidden" },
  xl: { landscape: "hidden xl:block", portrait: "xl:hidden" },
} as const

/** Next.js `Image` needs a positive height for aspect ratio when `fill` is false. */
function intrinsicImageHeight(width: number, height?: number): number {
  if (height != null && height > 0) return height
  return Math.round((width * 3) / 4)
}

export function SanityImage({
  landscape,
  portrait,
  alt,
  locale,
  altFallback,
  landscapeParams,
  portraitParams,
  breakpoint = "md",
  fill = false,
  priority = false,
  className,
  onLoad,
  onError,
}: SanityImageProps) {
  const lp = landscapeParams
  const pp = portraitParams ?? landscapeParams

  const resolvedAlt = resolveSanityImageAlt({
    alt,
    locale,
    landscape,
    portrait,
    altFallback,
  })

  const landscapeUrl = getSanityImageUrl(
    landscape,
    lp.width,
    lp.height,
    lp.quality,
  )
  const portraitUrl = getSanityImageUrl(
    portrait,
    pp.width,
    pp.height,
    pp.quality,
  )

  const hasBoth = Boolean(landscapeUrl && portraitUrl)
  const bpClasses = BREAKPOINT_CLASSES[breakpoint]

  const sharedProps = {
    alt: resolvedAlt,
    priority,
    onLoad,
    onError,
  } as const

  if (hasBoth && landscapeUrl && portraitUrl) {
    return (
      <>
        <Image
          {...sharedProps}
          src={landscapeUrl}
          {...(fill
            ? { fill: true }
            : {
                width: lp.width,
                height: intrinsicImageHeight(lp.width, lp.height),
                style: { width: "100%", height: "auto" },
              })}
          sizes={lp.sizes}
          className={cn(bpClasses.landscape, className)}
        />
        <Image
          {...sharedProps}
          src={portraitUrl}
          {...(fill
            ? { fill: true }
            : {
                width: pp.width,
                height: intrinsicImageHeight(pp.width, pp.height),
                style: { width: "100%", height: "auto" },
              })}
          sizes={pp.sizes}
          className={cn(bpClasses.portrait, className)}
        />
      </>
    )
  }

  const singleUrl = landscapeUrl ?? portraitUrl
  const singleParams = landscapeUrl ? lp : pp

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
