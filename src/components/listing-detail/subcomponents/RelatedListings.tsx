"use client"

import { useEffect, useLayoutEffect } from "react"
import { useTranslations } from "next-intl"
import gsap from "gsap"
import { Swiper, SwiperSlide } from "swiper/react"

import type { AppLocale } from "@/i18n/routing"
import type {
  LISTING_BY_ID_QUERY_RESULT,
  LISTINGS_PREVIEW_QUERY_RESULT,
} from "@/sanity/types"

import { useInView } from "@/hooks/useInView"
import { prefersReducedMotion } from "@/utils/reducedMotion"

import { ListingCard } from "@/components/cards/ListingCard"

import "swiper/css"

type ListingPreviewEntry = LISTINGS_PREVIEW_QUERY_RESULT[number]

type RelatedListingsProps = {
  locale: AppLocale
  entries: NonNullable<LISTING_BY_ID_QUERY_RESULT>["relatedListings"]
}

export function RelatedListings({ locale, entries }: RelatedListingsProps) {
  const t = useTranslations("listingDetail")
  const { ref: sectionRef, show } = useInView()
  const cards = entries as ListingPreviewEntry[]

  useLayoutEffect(() => {
    if (!sectionRef.current) return
    gsap.set(sectionRef.current, { opacity: 0, y: 20 })
  }, [sectionRef])

  useEffect(() => {
    if (!show || !sectionRef.current) return

    if (prefersReducedMotion()) {
      gsap.set(sectionRef.current, { opacity: 1, y: 0 })
      return
    }

    gsap.to(sectionRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
      clearProps: "all",
    })
  }, [show, sectionRef])

  if (entries.length === 0) {
    return null
  }

  return (
    <section ref={sectionRef} style={{ opacity: 0 }}>
      <h2 className="type-heading-1 text-primary mb-8 md:mb-12">
        {t("relatedListingsTitle")}
      </h2>

      {/* Mobile: full-bleed Swiper with overflow peek */}
      <div className="-mx-6 overflow-hidden md:hidden">
        <Swiper
          slidesPerView={1.15}
          spaceBetween={16}
          slidesOffsetBefore={24}
          slidesOffsetAfter={24}
        >
          {cards.map((entry) => (
            <SwiperSlide key={entry._id}>
              <ListingCard entry={entry} locale={locale} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Desktop: CSS grid, same as listings page */}
      <ul className="hidden md:grid grid-cols-2 gap-8">
        {cards.map((entry) => (
          <ListingCard key={entry._id} entry={entry} locale={locale} />
        ))}
      </ul>
    </section>
  )
}
