"use client"

import { useEffect, useLayoutEffect } from "react"
import { useTranslations } from "next-intl"
import gsap from "gsap"
import { Swiper, SwiperSlide } from "swiper/react"

import type { AppLocale } from "@/i18n/routing"
import type { LISTINGS_PREVIEW_QUERY_RESULT } from "@/sanity/types"

import { useInView } from "@/hooks/useInView"
import { prefersReducedMotion } from "@/utils/reducedMotion"

import { ListingCard } from "@/components/cards/ListingCard"

import "swiper/css"

const PLACEHOLDER_LISTINGS: LISTINGS_PREVIEW_QUERY_RESULT = [
  {
    _id: "placeholder-1",
    _type: "listingResidential",
    title: { it: "Reggia con terreno", en: "Estate with land" },
    listingContractType: "sale",
    price: { amount: 3100000 },
    country: "IT",
    city: "Torre Baldone",
    province: "BE",
    address: { streetName: "Avvia Sile", streetNumber: "41" },
    postalCode: "24040",
    map: null,
    listingLabel: null,
    typology: null,
    mainImage: null,
  },
  {
    _id: "placeholder-2",
    _type: "listingResidential",
    title: { it: "Villa con piscina", en: "Villa with pool" },
    listingContractType: "sale",
    price: { amount: 1850000 },
    country: "IT",
    city: "Bergamo",
    province: "BG",
    address: { streetName: "Via Roma", streetNumber: "12" },
    postalCode: "24100",
    map: null,
    listingLabel: null,
    typology: null,
    mainImage: null,
  },
  {
    _id: "placeholder-3",
    _type: "listingResidential",
    title: { it: "Villa con piscina", en: "Villa with pool" },
    listingContractType: "sale",
    price: { amount: 1850000 },
    country: "IT",
    city: "Bergamo",
    province: "BG",
    address: { streetName: "Via Roma", streetNumber: "12" },
    postalCode: "24100",
    map: null,
    listingLabel: null,
    typology: null,
    mainImage: null,
  },
] as LISTINGS_PREVIEW_QUERY_RESULT

type RelatedListingsProps = {
  locale: AppLocale
}

export function RelatedListings({ locale }: RelatedListingsProps) {
  const t = useTranslations("listingDetail")
  const { ref: sectionRef, show } = useInView()

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
          {PLACEHOLDER_LISTINGS.map((entry) => (
            <SwiperSlide key={entry._id}>
              <ListingCard entry={entry} locale={locale} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Desktop: CSS grid, same as listings page */}
      <ul className="hidden md:grid grid-cols-2 gap-8">
        {PLACEHOLDER_LISTINGS.map((entry) => (
          <ListingCard key={entry._id} entry={entry} locale={locale} />
        ))}
      </ul>
    </section>
  )
}
