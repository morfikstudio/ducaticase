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
 * `alt` from `image` (single mode), else from the landscape source, then
 * portrait, using `locale`; if still empty, `altFallback` (e.g. section title).
 *
 * `landscape` / `portrait` here name responsive slots (shown above / below the
 * component `breakpoint`), not necessarily image orientation.
 */
export function resolveSanityImageAlt(options: {
  alt?: string
  locale?: AppLocale
  /** Single-image mode: used first when set. */
  image?: SanityImageSource | null
  landscape?: SanityImageSource | null
  portrait?: SanityImageSource | null
  altFallback?: string
}): string {
  const { alt, locale, image, landscape, portrait, altFallback } = options

  if (alt !== undefined) {
    return alt
  }

  if (locale) {
    const fromCms =
      pickLocalizedString(localizedAltFromSource(image), locale) ??
      pickLocalizedString(localizedAltFromSource(landscape), locale) ??
      pickLocalizedString(localizedAltFromSource(portrait), locale) ??
      ""
    if (fromCms.trim() !== "") {
      return fromCms
    }
  }

  return altFallback?.trim() ?? ""
}

export type SanityImageParams = {
  /** Used both to build the Sanity CDN URL and as the Next.js Image `width` hint. */
  width: number
  /** Optional height for Sanity crop; omit for fluid aspect ratio. */
  height?: number
  /** Compression quality 1–100 (default 80). */
  quality?: number
  /** Next.js `sizes` hint for this breakpoint variant. */
  sizes?: string
}

type CommonSanityImageProps = {
  /**
   * When set, overrides `alt` from the Sanity image fields. Omit to derive from
   * CMS using `locale`.
   */
  alt?: string

  /** Locale used to pick localized `alt` from Sanity when `alt` is omitted. */
  locale?: AppLocale

  /** If CMS `alt` is empty and `alt` prop is omitted, use this string (e.g. heading). */
  altFallback?: string

  /** Tailwind breakpoint from which the landscape slot is shown (default "md").
   *  Below the breakpoint the portrait slot is shown. */
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

/**
 * Single asset for all viewports. Prefer this when there is no art direction.
 */
export type SanityImageSingleProps = CommonSanityImageProps & {
  image: SanityImageSource | null | undefined
  params: SanityImageParams
  landscape?: never
  portrait?: never
  landscapeParams?: never
  portraitParams?: never
}

/**
 * Responsive art direction: `landscape` is shown from `breakpoint` up; `portrait`
 * below the breakpoint. Names follow common `<picture>` / responsive conventions;
 * they do not guarantee EXIF orientation.
 *
 * Provide `landscapeParams`, or `portraitParams` alone for portrait-only art direction.
 */
export type SanityImageResponsiveProps = CommonSanityImageProps & {
  image?: never
  params?: never
  landscape?: SanityImageSource | null
  portrait?: SanityImageSource | null
} & (
    | { landscapeParams: SanityImageParams; portraitParams?: SanityImageParams }
    | {
        portraitParams: SanityImageParams
        landscapeParams?: undefined
        landscape?: undefined
      }
  )

export type SanityImageProps =
  | SanityImageSingleProps
  | SanityImageResponsiveProps

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

/**
 * Sanity-backed image with optional responsive art direction.
 *
 * - **Single**: pass `image` + `params` when one asset is used at all breakpoints.
 * - **Responsive**: pass `landscape` / `portrait` + `landscapeParams` / optional
 *   `portraitParams`. Those names indicate which slot is shown above vs below
 *   `breakpoint`, not necessarily EXIF orientation.
 */
export function SanityImage(props: SanityImageProps) {
  const {
    alt,
    locale,
    altFallback,
    breakpoint = "md",
    fill = false,
    priority = false,
    className,
    onLoad,
    onError,
  } = props

  if ("image" in props && "params" in props) {
    const { image, params } = props as SanityImageSingleProps
    const resolvedAlt = resolveSanityImageAlt({
      alt,
      locale,
      image,
      altFallback,
    })
    const url = getSanityImageUrl(
      image,
      params.width,
      params.height,
      params.quality,
    )
    if (!url) return null

    const sharedProps = {
      alt: resolvedAlt,
      priority,
      onLoad,
      onError,
    } as const

    return (
      <Image
        {...sharedProps}
        src={url}
        {...(fill
          ? { fill: true }
          : {
              width: params.width,
              height: intrinsicImageHeight(params.width, params.height),
              style: { width: "100%", height: "auto" },
            })}
        sizes={params.sizes}
        className={className}
      />
    )
  }

  const { landscape, portrait } = props
  const lp = props.landscapeParams ?? props.portraitParams!
  const pp = props.portraitParams ?? props.landscapeParams!

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
