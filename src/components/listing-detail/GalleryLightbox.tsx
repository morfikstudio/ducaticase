"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useTranslations } from "next-intl"
import { Swiper, SwiperSlide } from "swiper/react"
import { Keyboard } from "swiper/modules"
import type { Swiper as SwiperType } from "swiper"

import type { AppLocale } from "@/i18n/routing"
import type { LISTING_BY_ID_QUERY_RESULT } from "@/sanity/types"

import { SanityImage } from "@/components/ui/SanityImage"
import { useBreakpoint } from "@/stores/breakpointStore"
import { useLenis } from "@/components/providers/LenisProvider"
import { cn } from "@/utils/classNames"

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function getFocusableElements(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter((el) => el.getAttribute("aria-hidden") !== "true")
}

type Content = NonNullable<LISTING_BY_ID_QUERY_RESULT>["content"]
type LightboxImage = NonNullable<Content["mainImage"]>

type GalleryLightboxProps = {
  images: LightboxImage[]
  initialIndex: number
  onClose: () => void
  locale: AppLocale
}

function IconClose() {
  return (
    <svg
      aria-hidden="true"
      width="15"
      height="15"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="size-[12px] md:size-[15px]"
    >
      <path
        d="M1 1L17 17M17 1L1 17"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

type ChevronDirection = "up" | "down" | "left" | "right"

const chevronRotateClass: Record<ChevronDirection, string> = {
  right: "rotate-0",
  down: "rotate-90",
  left: "rotate-180",
  up: "-rotate-90",
}

function IconChevron({ direction }: { direction: ChevronDirection }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "size-[18px] shrink-0 md:size-[26px]",
        chevronRotateClass[direction],
      )}
    >
      <path
        d="M9 5L17 13L9 21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function GalleryLightbox({
  images,
  initialIndex,
  onClose,
  locale,
}: GalleryLightboxProps) {
  const t = useTranslations("listingDetail")
  const lenis = useLenis()
  const { current: breakpoint } = useBreakpoint()

  const isMobile =
    breakpoint === null ||
    breakpoint === "mobile" ||
    breakpoint === "mobileLandscape"

  const [isVisible, setIsVisible] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null)
  const [mounted, setMounted] = useState(false)

  const syncCurrentIndex = useCallback(
    (swiper: SwiperType) => {
      const lastIndex = Math.max(images.length - 1, 0)
      const nextIndex = isMobile && swiper.isEnd ? lastIndex : swiper.activeIndex
      const clampedIndex = Math.min(Math.max(nextIndex, 0), lastIndex)
      setCurrentIndex(clampedIndex)
    },
    [images.length, isMobile],
  )

  const dialogRef = useRef<HTMLDivElement>(null)
  const prevNavButtonRef = useRef<HTMLButtonElement>(null)
  const nextNavButtonRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const previouslyFocusedRef = useRef<HTMLElement | null>(null)

  const restoreFocus = useCallback(() => {
    const el = previouslyFocusedRef.current
    if (el && typeof el.focus === "function") {
      try {
        el.focus()
      } catch {
        /* ignore */
      }
    }
  }, [])

  const handleClose = useCallback(() => {
    setIsVisible(false)
    setTimeout(() => {
      restoreFocus()
      onClose()
    }, 300)
  }, [onClose, restoreFocus])

  useEffect(() => {
    setMounted(true)
  }, [])

  // Fade-in after mount
  useEffect(() => {
    if (!mounted) return
    const raf = requestAnimationFrame(() => setIsVisible(true))
    return () => cancelAnimationFrame(raf)
  }, [mounted])

  // Focus next-nav on open (fallback if disabled); restore on unmount
  useEffect(() => {
    if (!mounted || !dialogRef.current) return

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null

    const raf = requestAnimationFrame(() => {
      const nextBtn = nextNavButtonRef.current
      const prevBtn = prevNavButtonRef.current
      const closeBtn = closeButtonRef.current
      if (nextBtn && !nextBtn.disabled) nextBtn.focus()
      else if (prevBtn && !prevBtn.disabled) prevBtn.focus()
      else closeBtn?.focus()
    })

    return () => {
      cancelAnimationFrame(raf)
      restoreFocus()
    }
  }, [mounted, restoreFocus])

  // Keep keyboard Tab inside the dialog
  useEffect(() => {
    if (!mounted) return
    const dialog = dialogRef.current
    if (!dialog) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return

      const focusables = getFocusableElements(dialog)
      if (focusables.length === 0) return

      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement as HTMLElement | null

      /* Check if active element is not inside the dialog, if so, focus the first focusable element */
      if (!dialog.contains(active)) {
        e.preventDefault()
        first.focus()
        return
      }

      /* If shift key is pressed, focus the last focusable element */
      if (e.shiftKey) {
        if (active === first) {
          e.preventDefault()
          last.focus()
        }
        /* If shift key is not pressed, focus the first focusable element */
      } else if (active === last) {
        e.preventDefault()
        first.focus()
      }
    }

    dialog.addEventListener("keydown", onKeyDown)
    return () => dialog.removeEventListener("keydown", onKeyDown)
  }, [mounted])

  // Lock scroll
  useEffect(() => {
    if (!lenis) return
    lenis.stop()
    return () => {
      lenis.start()
    }
  }, [lenis])

  // Keyboard: Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose()
    }

    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [handleClose])

  const counter = useMemo(
    () =>
      t("imageCount", {
        current: currentIndex + 1,
        total: images.length,
      }),
    [currentIndex, images.length, t],
  )

  if (!mounted) return null

  const content = (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      className={cn(
        "fixed inset-0 z-50 h-dvh max-h-dvh w-full max-w-full overflow-hidden overscroll-none",
        "flex flex-col md:flex-row",
        "bg-black",
        "transition-opacity duration-300 ease-out delay-100",
        isVisible ? "opacity-100" : "opacity-0",
      )}
    >
      <div
        className={cn(
          "relative min-h-0 min-w-0 w-full overflow-hidden",
          "order-2 md:order-1 flex-1",
        )}
      >
        <Swiper
          key={isMobile ? "lightbox-vertical" : "lightbox-horizontal"}
          modules={[Keyboard]}
          keyboard={{ enabled: true }}
          direction={isMobile ? "vertical" : "horizontal"}
          slidesPerView={isMobile ? "auto" : 1}
          spaceBetween={isMobile ? 8 : 0}
          initialSlide={initialIndex}
          onSwiper={setSwiperInstance}
          onSlideChange={syncCurrentIndex}
          onReachEnd={syncCurrentIndex}
          className="h-full w-full"
          data-lenis-prevent
        >
          {images.map((image, i) => {
            const isAdjacent = Math.abs(i - currentIndex) <= 1
            const eagerLoading = isAdjacent ? "eager" : undefined

            return (
              <SwiperSlide
                key={i}
                className={cn(
                  "box-border flex items-center justify-center",
                  isMobile ? "h-auto! w-full" : "relative h-full! w-full",
                )}
              >
                {isMobile ? (
                  <SanityImage
                    image={image}
                    locale={locale}
                    params={{
                      width: 720,
                      sizes: "100vw",
                    }}
                    priority={i === initialIndex}
                    loading={eagerLoading}
                    className="block h-auto w-full"
                  />
                ) : (
                  <div className="relative h-full w-full">
                    <SanityImage
                      image={image}
                      locale={locale}
                      params={{
                        width: 1280,
                        sizes: "100vw",
                      }}
                      fill
                      priority={i === initialIndex}
                      loading={eagerLoading}
                      className="object-contain"
                    />
                  </div>
                )}
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>

      <aside
        className={cn(
          "shrink-0 w-full md:w-[100px]",
          "h-[75px] md:h-auto md:min-h-0",
          "grid grid-cols-[1fr_auto_1fr] items-center",
          "md:flex md:flex-col md:items-stretch",
          "border-b border-white/10 md:border-b-0 md:border-l",
          "order-1 md:order-2",
          "relative z-20",
        )}
      >
        <div
          className={cn(
            "flex items-center justify-center shrink-0",
            "size-[75px] md:size-[100px]",
            "type-body-3 text-primary tabular-nums select-none text-center leading-none",
            "min-w-0 px-1",
            "col-start-1 row-start-1 justify-self-start self-center",
            "md:col-auto md:row-auto md:justify-self-auto md:self-auto",
            "md:order-3",
          )}
        >
          {counter}
        </div>

        <button
          ref={closeButtonRef}
          type="button"
          aria-label={t("close")}
          onClick={handleClose}
          className={cn(
            "col-start-3 row-start-1 justify-self-end self-center",
            "md:col-auto md:row-auto md:justify-self-auto md:self-auto",
            "md:order-1",
            "flex items-center justify-center",
            "size-[75px] md:size-[100px] shrink-0 border-0 p-0",
            "text-white bg-transparent cursor-pointer",
            "transition-colors duration-200",
            "hover:bg-dark focus-visible:bg-dark",
          )}
        >
          <IconClose />
        </button>

        <div
          className={cn(
            "col-start-2 row-start-1 justify-self-center self-center",
            "flex flex-row-reverse md:flex-col items-stretch shrink-0",
            "md:col-auto md:row-auto md:justify-self-auto md:self-auto",
            "md:order-2 md:flex-1 md:justify-center md:min-h-0",
          )}
        >
          <button
            ref={nextNavButtonRef}
            type="button"
            aria-label={t("nextImage")}
            disabled={currentIndex === images.length - 1}
            onClick={() => swiperInstance?.slideNext()}
            className={cn(
              "flex items-center justify-center",
              "size-[75px] md:size-[100px] shrink-0 border-0 p-0",
              "text-primary bg-transparent",
              "transition-colors duration-200",
              "cursor-pointer disabled:cursor-not-allowed",
              "hover:bg-dark focus-visible:bg-dark",
              "disabled:opacity-25 disabled:hover:bg-transparent",
            )}
          >
            <IconChevron direction={isMobile ? "down" : "right"} />
          </button>

          <button
            ref={prevNavButtonRef}
            type="button"
            aria-label={t("previousImage")}
            disabled={currentIndex === 0}
            onClick={() => swiperInstance?.slidePrev()}
            className={cn(
              "flex items-center justify-center",
              "size-[75px] md:size-[100px] shrink-0 border-0 p-0",
              "text-primary bg-transparent",
              "transition-colors duration-200",
              "hover:bg-dark focus-visible:bg-dark",
              "cursor-pointer disabled:cursor-not-allowed",
              "disabled:opacity-25 disabled:hover:bg-transparent",
            )}
          >
            <IconChevron direction={isMobile ? "up" : "left"} />
          </button>
        </div>
      </aside>
    </div>
  )

  return createPortal(content, document.body)
}
