"use client"

import { useCallback, useRef, type FocusEvent } from "react"
import { useTranslations } from "next-intl"
import type { Swiper as SwiperType } from "swiper"
import { Navigation } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

import type { AppLocale } from "@/i18n/routing"
import type { LISTINGS_PREVIEW_QUERY_RESULT } from "@/sanity/types"

import { useGsapReveal } from "@/hooks/useGsapReveal"

import { cn } from "@/utils/classNames"

import { Icon } from "@/components/ui/Icon"
import { ListingCard } from "@/components/ListingCard"
import { Button } from "@/components/ui/Button"
import { Container } from "@/components/ui/Container"

type ListingsEntry = LISTINGS_PREVIEW_QUERY_RESULT[number]

export type ListingsCarouselProps = {
  locale: AppLocale
  entries: ListingsEntry[]
  title?: string
}

export function ListingsCarousel({
  locale,
  entries,
  title,
}: ListingsCarouselProps) {
  const t = useTranslations("homePage")
  const { ref: wrapRef } = useGsapReveal()
  const swiperRef = useRef<SwiperType | null>(null)
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)

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

    const slides = Array.from(swiper.slides)
    const index = slides.indexOf(slide as HTMLElement)

    if (index < 0) return

    if (swiper.activeIndex !== index) {
      swiper.slideTo(index, 300)
    }
  }, [])

  if (entries.length === 0) {
    return null
  }

  return (
    <Container>
      <div ref={wrapRef} style={{ opacity: 0 }}>
        {title ? (
          <div className="flex items-center justify-between">
            <h2 className="type-heading-1">{title}</h2>
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
        ) : null}

        <div className="mt-12 lg:mt-16" onFocusCapture={onCarouselFocusIn}>
          <Swiper
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
            onSwiper={(instance) => {
              swiperRef.current = instance
            }}
            slidesPerView={1.1}
            spaceBetween={16}
            watchOverflow
            breakpoints={{
              768: {
                slidesPerView: 1.5,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 2.25,
                spaceBetween: 32,
              },
              1280: {
                slidesPerView: 2.5,
              },
            }}
          >
            {entries.map((entry, index) => (
              <SwiperSlide key={entry._id} className="h-auto!">
                <ListingCard
                  entry={entry}
                  locale={locale}
                  priority={index < 5}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div
          className={cn(
            "mt-12 lg:mt-16 flex flex-col gap-8",
            "md:flex-row md:items-center md:justify-between md:gap-8",
          )}
        >
          <p className="type-body-2 max-w-prose md:max-w-[450px] text-gray">
            {t("featuredListingsFooter")}
          </p>

          <Button
            href="/immobili"
            variant="primary"
            className="shrink-0 self-start"
          >
            {t("featuredListingsViewAll")}
          </Button>
        </div>
      </div>
    </Container>
  )
}
