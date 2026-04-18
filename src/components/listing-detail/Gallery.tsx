"use client"

import { useCallback, useState, useMemo } from "react"
import { useTranslations } from "next-intl"

import type { AppLocale } from "@/i18n/routing"

import type { LISTING_BY_ID_QUERY_RESULT } from "@/sanity/types"

import { useBreakpoint } from "@/stores/breakpointStore"
import { useGsapReveal } from "@/hooks/useGsapReveal"

import { SanityImage } from "@/components/ui/SanityImage"
import { cn } from "@/utils/classNames"

import { GalleryLightbox } from "./GalleryLightbox"

type Content = NonNullable<LISTING_BY_ID_QUERY_RESULT>["content"]

type GalleryProps = {
  mainImage: Content["mainImage"]
  gallery: Content["gallery"]
  locale: AppLocale
}

export function Gallery({ mainImage, gallery, locale }: GalleryProps) {
  const [loadedCount, setLoadedCount] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const t = useTranslations("listingDetail")

  const thumbs = gallery ?? []

  const { current: breakpoint } = useBreakpoint()
  const isMobileLayout = breakpoint?.startsWith("mobile")
  const viewAllIndex = isMobileLayout ? 1 : 3

  // Wait for mainImage + first 2 thumbs before revealing the gallery.
  const imagesAreReady = useMemo(() => {
    const triggerAt = 1 + Math.min(thumbs.length, 2)
    return loadedCount >= triggerAt
  }, [loadedCount, thumbs.length])

  const { ref: wrapRef } = useGsapReveal({
    ready: imagesAreReady,
    fallbackRevealMs: 3000,
  })

  const bumpGateProgress = useCallback(() => {
    setLoadedCount((c) => c + 1)
  }, [])

  if (!mainImage || !gallery) return null

  return (
    <>
      <div ref={wrapRef} className="w-full" style={{ opacity: 0 }}>
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
            <SanityImage
              landscape={mainImage}
              locale={locale}
              landscapeParams={{
                width: 950,
                height: 530,
                sizes: "(min-width: 768px) 64vw, 100vw",
                quality: 50,
              }}
              fill
              priority
              className="object-cover"
              onLoad={bumpGateProgress}
              onError={bumpGateProgress}
            />
          </div>

          {/* THUMBS */}
          {[0, 1, 2, 3].map((i) => {
            const thumb = thumbs[i]
            const wrapperClassName = i >= 2 ? "hidden md:block" : undefined
            const isViewAll = i === viewAllIndex

            if (!thumb) return null

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
                  <SanityImage
                    landscape={thumb}
                    locale={locale}
                    landscapeParams={{
                      width: 300,
                      height: 300,
                      sizes: "(min-width: 768px) 18vw, 50vw",
                      quality: 50,
                    }}
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    onLoad={bumpGateProgress}
                    onError={bumpGateProgress}
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
                <SanityImage
                  landscape={thumb}
                  locale={locale}
                  landscapeParams={{
                    width: 300,
                    height: 300,
                    sizes: "(min-width: 768px) 18vw, 50vw",
                  }}
                  fill
                  className="object-cover"
                  onLoad={bumpGateProgress}
                  onError={bumpGateProgress}
                />
              </div>
            )
          })}
        </div>
      </div>

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
