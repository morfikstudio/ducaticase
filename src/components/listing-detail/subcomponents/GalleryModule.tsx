"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import Image from "next/image"
import gsap from "gsap"
import { useTranslations } from "next-intl"
import type { AppLocale } from "@/i18n/routing"

import { pickLocalizedString } from "@/sanity/lib/locale"
import { getSanityImageUrl } from "@/lib/sanity"
import type { LISTING_BY_ID_QUERY_RESULT } from "@/sanity/types"

import { useBreakpoint } from "@/stores/breakpointStore"

import { prefersReducedMotion } from "@/utils/reducedMotion"
import { cn } from "@/utils/classNames"

import { GalleryLightbox } from "./GalleryLightbox"

type Content = NonNullable<LISTING_BY_ID_QUERY_RESULT>["content"]

type GalleryModuleProps = {
  mainImage: Content["mainImage"]
  gallery: Content["gallery"]
  locale: AppLocale
}

export function GalleryModule({
  mainImage,
  gallery,
  locale,
}: GalleryModuleProps) {
  const t = useTranslations("listingDetail")
  const [loadedCount, setLoadedCount] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const sectionRef = useRef<HTMLElement>(null)

  const { current: breakpoint } = useBreakpoint()
  const isMobileLayout =
    breakpoint === null || // null = SSR/before hydration → default to mobile layout
    breakpoint === "mobile" ||
    breakpoint === "mobileLandscape"
  const viewAllIndex = isMobileLayout ? 1 : 3

  const thumbs = gallery ?? []

  // Wait for mainImage + first 2 thumbs before revealing the gallery.
  const triggerAt = 1 + Math.min(thumbs.length, 2)

  /* Entry animation - initial state */
  useLayoutEffect(() => {
    gsap.set(sectionRef.current, { opacity: 0, y: 20 })
  }, [])

  // Animate in once mainImage + first 2 thumbs have fired onLoad.
  useEffect(() => {
    if (loadedCount < triggerAt || !sectionRef.current) return

    if (prefersReducedMotion()) {
      gsap.set(sectionRef.current, { opacity: 1, y: 0 })
      return
    }

    gsap.to(sectionRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power2.out",
    })
  }, [loadedCount, triggerAt])

  if (!mainImage || !gallery) return null

  return (
    <>
      <section ref={sectionRef} className="w-full" style={{ opacity: 0 }}>
        <div
          className={cn(
            "grid grid-cols-2 gap-2",
            "md:grid-cols-[minmax(0,32fr)_minmax(0,9fr)_minmax(0,9fr)] md:grid-rows-2",
          )}
        >
          {/* MAIN IMAGE */}
          <div
            className={cn(
              "relative col-span-2 aspect-video overflow-hidden bg-neutral-200 dark:bg-neutral-800",
              "md:col-span-1 md:row-span-2 md:aspect-auto",
            )}
          >
            <Image
              src={getSanityImageUrl(mainImage, 950, 530) ?? ""}
              alt={
                pickLocalizedString(mainImage?.alt ?? undefined, locale) ?? ""
              }
              fill
              className="object-cover"
              sizes="(min-width: 768px) 64vw, 100vw"
              priority
              onLoad={() => setLoadedCount((c) => c + 1)}
            />
          </div>

          {/* THUMBS */}
          {[0, 1, 2, 3].map((i) => {
            const url = thumbs[i]
              ? getSanityImageUrl(thumbs[i], 300, 300)
              : undefined
            const alt =
              pickLocalizedString(thumbs[i]?.alt ?? undefined, locale) ?? ""
            const wrapperClassName = i >= 2 ? "hidden md:block" : undefined
            const isViewAll = i === viewAllIndex

            if (!url) return null

            if (isViewAll) {
              return (
                <button
                  key={i}
                  type="button"
                  className={cn(
                    "group relative aspect-square w-full cursor-pointer overflow-hidden border-0 bg-neutral-200 p-0 text-left dark:bg-neutral-800",
                    wrapperClassName,
                  )}
                  onClick={() => setLightboxIndex(0)}
                >
                  <Image
                    src={url}
                    alt={alt}
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    sizes="(min-width: 768px) 18vw, 50vw"
                    onLoad={() => setLoadedCount((c) => c + 1)}
                  />
                  <span
                    className="pointer-events-none absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30"
                    aria-hidden
                  >
                    <span className="type-button text-primary group-hover:underline">
                      {t("viewAll")}
                    </span>
                  </span>
                </button>
              )
            }

            return (
              <div
                key={i}
                className={cn(
                  "relative aspect-square overflow-hidden bg-neutral-200 dark:bg-neutral-800",
                  wrapperClassName,
                )}
              >
                <Image
                  src={url}
                  alt={alt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 18vw, 50vw"
                  onLoad={() => setLoadedCount((c) => c + 1)}
                />
              </div>
            )
          })}
        </div>
      </section>

      {lightboxIndex !== null && (
        <GalleryLightbox
          key={lightboxIndex}
          images={gallery}
          initialIndex={0}
          onClose={() => setLightboxIndex(null)}
          locale={locale}
        />
      )}
    </>
  )
}
