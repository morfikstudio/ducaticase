"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
  type FocusEvent,
} from "react"
import type { Swiper as SwiperType } from "swiper"
import { Navigation } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

import type { AppLocale } from "@/i18n/routing"
import type { HOME_SITE_CONTENT_QUERY_RESULT } from "@/sanity/types"

import { useGsapReveal } from "@/hooks/useGsapReveal"

import { cn } from "@/utils/classNames"

import { Icon } from "@/components/ui/Icon"
import { PortableTextComponent } from "@/components/ui/PortableText"
import { Container } from "@/components/ui/Container"
import { TitleReveal } from "@/components/ui/TitleReveal"

const QUOTE_CAROUSEL_LG_PX = 1024
/** Swiper loop + centeredSlides at lg (~slidesPerView 2.25): need enough real slides. */
const QUOTE_MIN_SLIDES_FOR_LOOP = 5
const QUOTE_CARD_SCALE_MIN = 0.9
const QUOTE_CARD_OPACITY_MIN = 0.4

type SwiperSlideElement = HTMLElement & { progress?: number }

type QuoteCardTransformOpts = {
  /** From Swiper `setTransition` — when > 0, cards ease to match CSS snap on the wrapper. */
  snapTransitionMs: number
  isDragging: boolean
}

function subscribeMinWidth1024(onChange: () => void) {
  const mq = window.matchMedia(`(min-width: ${QUOTE_CAROUSEL_LG_PX}px)`)
  mq.addEventListener("change", onChange)
  return () => mq.removeEventListener("change", onChange)
}

function getMinWidth1024Snapshot() {
  return window.matchMedia(`(min-width: ${QUOTE_CAROUSEL_LG_PX}px)`).matches
}

function useQuoteCarouselLgViewport() {
  return useSyncExternalStore(
    subscribeMinWidth1024,
    getMinWidth1024Snapshot,
    () => false,
  )
}

function resetQuoteCardStyles(swiper: SwiperType) {
  for (const slide of swiper.slides) {
    const card = slide.querySelector<HTMLElement>("[data-quote-card]")
    if (!card) continue
    card.style.removeProperty("opacity")
    card.style.removeProperty("transform")
    card.style.removeProperty("transition")
    card.style.removeProperty("transform-origin")
    card.style.removeProperty("will-change")
  }
}

function applyQuoteCardTransforms(
  swiper: SwiperType,
  shouldApplyDepthEffects: boolean,
  opts?: QuoteCardTransformOpts,
) {
  if (!shouldApplyDepthEffects) {
    resetQuoteCardStyles(swiper)
    return
  }

  const snapTransitionMs = opts?.snapTransitionMs ?? 0
  const isDragging = opts?.isDragging ?? false
  const useSmoothSnap =
    !isDragging && snapTransitionMs > 0 && shouldApplyDepthEffects

  for (const slide of swiper.slides) {
    const card = slide.querySelector<HTMLElement>("[data-quote-card]")
    if (!card) continue

    const progress = (slide as SwiperSlideElement).progress ?? 0
    const t = Math.min(Math.abs(progress), 1)
    const scale = 1 - t * (1 - QUOTE_CARD_SCALE_MIN)
    const opacity = 1 - t * (1 - QUOTE_CARD_OPACITY_MIN)

    card.style.transform = `scale(${scale})`
    card.style.opacity = String(opacity)
    card.style.transformOrigin = "center"
    card.style.willChange = "opacity, transform"
    card.style.transition = useSmoothSnap
      ? `transform ${snapTransitionMs}ms var(--swiper-wrapper-transition-timing-function, ease-out), opacity ${snapTransitionMs}ms var(--swiper-wrapper-transition-timing-function, ease-out)`
      : "none"
  }
}

function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width={57}
      height={19}
      viewBox="0 0 57 19"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <path
        d="M55.2799 11.4297L56.8652 12.4865C56.3507 13.2444 55.1201 14.5446 52.9925 14.5446C50.3506 14.5446 48.3831 12.5005 48.3831 9.90017C48.3831 7.13309 50.3714 5.25586 52.7701 5.25586C55.1826 5.25586 56.3645 7.17472 56.747 8.21066L56.9556 8.73912L50.74 11.3115C51.2127 12.2432 51.9498 12.716 52.9925 12.716C54.0355 12.716 54.7585 12.2015 55.2799 11.4297ZM50.4063 9.75429L54.5569 8.02996C54.3275 7.45296 53.6462 7.0428 52.8326 7.0428C51.7968 7.0428 50.3576 7.96055 50.4063 9.75429Z"
        fill="currentColor"
      />
      <path
        d="M45.3865 0.521484H47.3887V14.1208H45.3865V0.521484Z"
        fill="currentColor"
      />
      <path
        d="M42.2301 5.61646H44.1629V13.8762C44.1629 17.3037 42.1397 18.7151 39.7479 18.7151C37.4953 18.7151 36.1397 17.1995 35.6321 15.9689L37.4049 15.2319C37.7247 15.9897 38.4965 16.8867 39.7479 16.8867C41.2844 16.8867 42.2301 15.9341 42.2301 14.1543V13.4869H42.1605C41.7016 14.043 40.8256 14.5436 39.7132 14.5436C37.391 14.5436 35.2634 12.5204 35.2634 9.91322C35.2634 7.29202 37.391 5.24805 39.7132 5.24805C40.8187 5.24805 41.7016 5.74169 42.1605 6.28398H42.2301V5.61646ZM42.369 9.91322C42.369 8.27238 41.2775 7.07651 39.887 7.07651C38.4825 7.07651 37.3006 8.27238 37.3006 9.91322C37.3006 11.5331 38.4825 12.7081 39.887 12.7081C41.2776 12.7151 42.3691 11.5331 42.3691 9.91322"
        fill="currentColor"
      />
      <path
        d="M24.2714 9.87974C24.2714 12.5565 22.1857 14.524 19.6271 14.524C17.0686 14.524 14.9828 12.5496 14.9828 9.87974C14.9828 7.18912 17.0686 5.22852 19.6271 5.22852C22.1857 5.22852 24.2714 7.18912 24.2714 9.87974ZM22.2413 9.87974C22.2413 8.21121 21.0314 7.06389 19.6271 7.06389C18.2227 7.06389 17.0129 8.21121 17.0129 9.87974C17.0129 11.5344 18.2227 12.6956 19.6271 12.6956C21.0316 12.6956 22.2413 11.5344 22.2413 9.87974Z"
        fill="currentColor"
      />
      <path
        d="M34.4153 9.90017C34.4153 12.5769 32.3295 14.5445 29.771 14.5445C27.2124 14.5445 25.1267 12.5768 25.1267 9.90017C25.1267 7.20954 27.2124 5.25586 29.771 5.25586C32.3295 5.25586 34.4153 7.20262 34.4153 9.90017ZM32.3782 9.90017C32.3782 8.23164 31.1684 7.08432 29.764 7.08432C28.3595 7.08432 27.1498 8.23164 27.1498 9.90017C27.1498 11.5549 28.3596 12.716 29.764 12.716C31.1754 12.716 32.3782 11.5479 32.3782 9.90017Z"
        fill="currentColor"
      />
      <path
        d="M7.34888 12.5078C4.43571 12.5078 2.15536 10.1578 2.15536 7.24464C2.15536 4.33158 4.43571 1.98158 7.34888 1.98158C8.92019 1.98158 10.0673 2.60033 10.9155 3.39297L12.3131 1.99553C11.1311 0.862276 9.5529 0 7.34888 0C3.35814 0.000111607 0 3.25402 0 7.24464C0 11.2353 3.35814 14.4893 7.34888 14.4893C9.50423 14.4893 11.1311 13.7801 12.4035 12.4591C13.7105 11.152 14.1137 9.31651 14.1137 7.82868C14.1137 7.36283 14.0581 6.88314 13.9955 6.52857H7.34888V8.46138H12.0836C11.9445 9.6712 11.5622 10.4985 10.999 11.0616C10.3176 11.75 9.24006 12.5078 7.34888 12.5078Z"
        fill="currentColor"
      />
    </svg>
  )
}

function providerLogo(provider: "google") {
  if (provider === "google") {
    return <GoogleLogo className="h-[19px] w-[57px] shrink-0" />
  }
  return null
}

export type QuoteCarouselItem = NonNullable<
  NonNullable<
    NonNullable<HOME_SITE_CONTENT_QUERY_RESULT>["homePage"]
  >["testimonials"]
>[number]

export type QuoteCarouselProps = {
  locale: AppLocale
  subtitle?: string
  title?: string
  items: QuoteCarouselItem[]
}

export function QuoteCarousel({
  locale,
  subtitle,
  title,
  items,
}: QuoteCarouselProps) {
  const { ref: wrapRef, show } = useGsapReveal()

  const swiperRef = useRef<SwiperType | null>(null)
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)
  const quoteSnapTransitionMsRef = useRef(0)
  const quotePointerDownRef = useRef(false)

  const isLgViewport = useQuoteCarouselLgViewport()

  const isLoop = useMemo(() => {
    return items.length >= QUOTE_MIN_SLIDES_FOR_LOOP
  }, [items])

  const applyTransforms = useCallback(
    (swiper: SwiperType) => {
      applyQuoteCardTransforms(swiper, isLgViewport && isLoop, {
        snapTransitionMs: quoteSnapTransitionMsRef.current,
        isDragging: quotePointerDownRef.current,
      })
    },
    [isLgViewport, isLoop],
  )

  useEffect(() => {
    const swiper = swiperRef.current
    if (swiper) applyTransforms(swiper)
  }, [applyTransforms, isLgViewport, isLoop])

  const onCarouselFocusIn = useCallback((e: FocusEvent<HTMLDivElement>) => {
    if (
      !swiperRef.current ||
      !(e.target instanceof HTMLElement) ||
      e.target === e.currentTarget
    )
      return

    const swiper = swiperRef.current
    const slide = e.target.closest(".swiper-slide")
    if (!slide || !swiper.el.contains(slide)) return

    if (swiper.params.loop) {
      const raw = slide.getAttribute("data-swiper-slide-index")
      const realIndex = raw != null ? Number.parseInt(raw, 10) : Number.NaN
      if (!Number.isNaN(realIndex) && swiper.realIndex !== realIndex) {
        swiper.slideToLoop(realIndex, 300)
      }
      return
    }

    const slides = Array.from(swiper.slides)
    const index = slides.indexOf(slide as HTMLElement)

    if (index < 0) return

    if (swiper.activeIndex !== index) {
      swiper.slideTo(index, 300)
    }
  }, [])

  if (items.length === 0) {
    return null
  }

  return (
    <Container>
      <div ref={wrapRef} style={{ opacity: 0 }}>
        <div className={cn("flex flex-col gap-8 lg:gap-16")}>
          <div className="flex items-end justify-between">
            <div
              className={cn("flex min-w-0 shrink-0 flex-col gap-8 lg:gap-12")}
            >
              {title ? <span className="type-body-2">{title}</span> : null}

              {subtitle ? (
                <TitleReveal
                  title={subtitle}
                  tag="h2"
                  show={show}
                  className="text-dark-gray max-w-[550px]"
                />
              ) : null}
            </div>

            <div className="hidden shrink-0 items-center lg:flex gap-2">
              <button
                ref={prevRef}
                type="button"
                aria-label="Previous"
                className={cn(
                  "flex items-center justify-center",
                  "size-[75px] shrink-0 p-0",
                  "border border-dark rounded-md",
                  "text-primary",
                  "transition-colors duration-200",
                  "cursor-pointer",
                  "bg-black hover:bg-dark focus-visible:bg-dark",
                  "[&.swiper-button-disabled]:opacity-40",
                  "[&.swiper-button-disabled]:pointer-events-none",
                )}
              >
                <Icon type="chevron" direction="left" size="s" />
              </button>

              <button
                ref={nextRef}
                type="button"
                aria-label="Next"
                className={cn(
                  "flex items-center justify-center",
                  "size-[75px] shrink-0 p-0",
                  "border border-dark rounded-md",
                  "text-primary",
                  "transition-colors duration-200",
                  "cursor-pointer",
                  "bg-black hover:bg-dark focus-visible:bg-dark",
                  "[&.swiper-button-disabled]:opacity-40",
                  "[&.swiper-button-disabled]:pointer-events-none",
                )}
              >
                <Icon type="chevron" direction="right" size="s" />
              </button>
            </div>
          </div>

          <div
            className="min-w-0 flex-1 lg:min-h-0"
            onFocusCapture={onCarouselFocusIn}
          >
            <Swiper
              className="w-full [&_.swiper-slide]:h-auto"
              modules={[Navigation]}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              onBeforeInit={(swiper) => {
                const nav = swiper.params.navigation
                if (nav && nav !== true) {
                  nav.prevEl = prevRef.current
                  nav.nextEl = nextRef.current
                }
              }}
              watchSlidesProgress
              onSwiper={(instance) => {
                swiperRef.current = instance
                applyTransforms(instance)
              }}
              onBreakpoint={(swiper) => {
                applyTransforms(swiper)
              }}
              onSetTransition={(_swiper, duration) => {
                quoteSnapTransitionMsRef.current = duration
              }}
              onSetTranslate={(swiper) => {
                applyTransforms(swiper)
              }}
              onTouchStart={() => {
                quotePointerDownRef.current = true
              }}
              onTouchEnd={() => {
                quotePointerDownRef.current = false
              }}
              onTouchCancel={() => {
                quotePointerDownRef.current = false
              }}
              slidesPerView={1.05}
              spaceBetween={8}
              loop={false}
              speed={800}
              centeredSlides={false}
              watchOverflow
              breakpoints={{
                768: {
                  slidesPerView: 1.35,
                  spaceBetween: 16,
                },
                1024: {
                  slidesPerView: 2.25,
                  spaceBetween: isLoop ? 0 : 32,
                  loop: isLoop,
                },
              }}
            >
              {items.map((item, index) => {
                const idx = String(index + 1).padStart(2, "0")
                const author = item.name?.trim() ?? ""

                return (
                  <SwiperSlide key={item._key} className="h-auto!">
                    <div className="h-full" data-quote-card>
                      <article
                        className={cn(
                          "flex h-full min-h-[260px] flex-col rounded-[6px] bg-dark",
                          "px-8 py-12",
                        )}
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className="w-[8px] h-[8px] shrink-0 rounded-full bg-gray"
                            aria-hidden
                          />
                          <p className="type-body-2" aria-hidden>
                            ({idx})
                          </p>
                        </span>

                        <div
                          className={cn(
                            "flex min-h-0 flex-1 flex-col justify-center",
                            "mt-8",
                          )}
                        >
                          <PortableTextComponent
                            text={item.text}
                            locale={locale}
                            className={cn(
                              "type-body-3",
                              "[&_strong]:font-medium",
                            )}
                          />
                        </div>

                        <div
                          className={cn(
                            "mt-auto flex flex-wrap items-end justify-between gap-4",
                            "mt-16",
                          )}
                        >
                          {item.provider ? (
                            <div className="shrink-0">
                              {providerLogo(item.provider)}
                            </div>
                          ) : null}

                          {author ? (
                            <p className="type-body-3 max-w-[min(100%,16rem)] text-right text-white">
                              — {author}
                            </p>
                          ) : null}
                        </div>
                      </article>
                    </div>
                  </SwiperSlide>
                )
              })}
            </Swiper>
          </div>
        </div>
      </div>
    </Container>
  )
}
