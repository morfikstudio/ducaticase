"use client"

import { useTranslations } from "next-intl"
import { Swiper, SwiperSlide } from "swiper/react"

import type { AppLocale } from "@/i18n/routing"
import type { LISTINGS_PREVIEW_QUERY_RESULT } from "@/sanity/types"

import { useGsapReveal } from "@/hooks/useGsapReveal"

import { cn } from "@/utils/classNames"

import { ListingCard } from "@/components/ListingCard"
import { Button } from "@/components/ui/Button"
import { Container } from "@/components/ui/Container"

import "swiper/css"

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

  if (entries.length === 0) {
    return null
  }

  return (
    <div className="w-full py-24 md:py-32 lg:py-48 text-primary">
      <Container>
        <div ref={wrapRef} style={{ opacity: 0 }}>
          {title ? <h2 className="type-heading-1">{title}</h2> : null}

          <div className="mt-12 lg:mt-16">
            <Swiper
              slidesPerView={1.15}
              spaceBetween={16}
              watchOverflow
              breakpoints={{
                768: {
                  slidesPerView: 1.75,
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
              {entries.map((entry) => (
                <SwiperSlide key={entry._id}>
                  <ListingCard entry={entry} locale={locale} />
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
              href={`/${locale}/immobili`}
              variant="primary"
              className="shrink-0 self-start"
            >
              {t("featuredListingsViewAll")}
            </Button>
          </div>
        </div>
      </Container>
    </div>
  )
}
