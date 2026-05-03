"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { SanityImageSource } from "@sanity/image-url/lib/types/types"

import type { AppLocale } from "@/i18n/routing"

import { useGsapReveal } from "@/hooks/useGsapReveal"

import { cn } from "@/utils/classNames"

import { CONTAINER_LAYOUT_CLASSNAME } from "@/components/ui/Container"
import { ImageParallax } from "@/components/ui/ImageParallax"
import { SanityImage } from "@/components/ui/SanityImage"
import { TitleReveal } from "@/components/ui/TitleReveal"

const tabletDesktopImageWidth =
  "lg:w-[calc(50vw+min(100vw,86rem)/4-12px)] xl:w-[calc(50vw+min(100vw,86rem)/4-24px)]" as const

function sanityImageHasAsset(
  src: SanityImageSource | null | undefined,
): boolean {
  if (!src || typeof src !== "object" || !("asset" in src)) {
    return false
  }
  return Boolean((src as { asset?: unknown }).asset)
}

export type StatementHeroProps = {
  locale: AppLocale
  title: string
  imageLandscape?: SanityImageSource | null
  imagePortrait?: SanityImageSource | null
  className?: string
}

export function StatementHero({
  locale,
  title,
  imageLandscape,
  imagePortrait,
  className,
}: StatementHeroProps) {
  const hasImage =
    sanityImageHasAsset(imageLandscape) || sanityImageHasAsset(imagePortrait)

  const [imageReady, setImageReady] = useState(!hasImage)

  const handleImageSettled = useCallback(() => {
    requestAnimationFrame(() => {
      setImageReady(true)
    })
  }, [])

  const titleRef = useRef<HTMLDivElement>(null)
  const [titleOverflow, setTitleOverflow] = useState(0)

  useEffect(() => {
    const el = titleRef.current
    if (!el) return

    const lgQuery = window.matchMedia("(min-width: 1024px)")

    const update = () => {
      setTitleOverflow(lgQuery.matches ? 0 : el.offsetHeight / 2)
    }

    const ro = new ResizeObserver(update)
    ro.observe(el)
    lgQuery.addEventListener("change", update)
    update()

    return () => {
      ro.disconnect()
      lgQuery.removeEventListener("change", update)
    }
  }, [])

  const { ref: wrapRef, show } = useGsapReveal({
    ready: imageReady,
    clearProps: "opacity,y",
  })

  const imageShellClass = cn(
    "h-[480px] w-full",
    "lg:absolute lg:inset-y-0 lg:left-0 lg:right-auto lg:h-full lg:min-h-0",
    tabletDesktopImageWidth,
  )

  return (
    <div
      ref={wrapRef}
      style={{ opacity: 0, marginBottom: -titleOverflow }}
      className={cn("relative", className)}
    >
      <div className="relative isolate w-full lg:min-h-svh">
        {hasImage ? (
          <ImageParallax className={imageShellClass}>
            <SanityImage
              landscape={imageLandscape}
              portrait={imagePortrait}
              locale={locale}
              landscapeParams={{
                width: 1280,
                height: 1024,
                sizes: "(min-width: 1px) 75vw",
              }}
              portraitParams={{
                width: 720,
                height: 900,
                sizes: "(min-width: 1px) 100vw",
              }}
              breakpoint="lg"
              fill
              altFallback={title.trim() !== "" ? title : undefined}
              className="pointer-events-none absolute inset-0 size-full object-cover object-center lg:min-h-full"
              onLoad={handleImageSettled}
              onError={handleImageSettled}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[rgba(35,35,35,0.25)]"
            />
          </ImageParallax>
        ) : (
          <div className={cn("relative overflow-hidden", imageShellClass)}>
            <div aria-hidden className="absolute inset-0 bg-bg lg:min-h-full" />
          </div>
        )}

        <div
          className={cn(
            "z-10 flex w-full justify-start",
            "relative",
            CONTAINER_LAYOUT_CLASSNAME,
            "lg:absolute lg:inset-0 lg:h-full lg:min-h-0 lg:grid lg:grid-cols-12 lg:items-center lg:py-20",
          )}
        >
          <div
            ref={titleRef}
            className={cn(
              "type-display-1 w-full -translate-y-1/2 text-left whitespace-pre-line text-primary",
              "lg:col-span-10 lg:col-start-3 lg:max-w-none lg:translate-y-0 lg:px-0",
            )}
          >
            <TitleReveal
              title={title.replace(/<br\s*\/?>/gi, "\n")}
              tag="h2"
              show={imageReady && show}
              className="text-balance"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
