"use client"

import { Swiper, SwiperSlide } from "swiper/react"

import { getSanityImageUrl } from "@/lib/sanity"
import type { HOME_SITE_CONTENT_QUERY_RESULT } from "@/sanity/types"

import { useGsapReveal } from "@/hooks/useGsapReveal"

import { Container } from "@/components/ui/Container"

/** Altezza massima in px (carousel); larghezza slide deriva dal rapporto d’aspetto originale. */
const MAX_LOGO_H = 88
const MAX_LOGO_W = 320

export type PartnersSectionPartner = NonNullable<
  NonNullable<
    NonNullable<HOME_SITE_CONTENT_QUERY_RESULT>["homePage"]
  >["partners"]
>[number]

export type PartnersSectionProps = {
  title: string
  partners: PartnersSectionPartner[]
}

function partnerLogoSrc(partner: PartnersSectionPartner): string | undefined {
  const asset = partner.image?.asset
  if (!asset) return undefined
  if (typeof asset.url === "string" && asset.url.trim() !== "") {
    return asset.url
  }
  const w = asset.metadata?.dimensions?.width
  if (typeof w === "number" && w > 0) {
    return getSanityImageUrl(partner.image, Math.min(w, 4096), undefined, 92)
  }
  return getSanityImageUrl(partner.image, 640, undefined, 92)
}

function partnerLogoIntrinsic(partner: PartnersSectionPartner): {
  width: number
  height: number
} | null {
  const dims = partner.image?.asset?.metadata?.dimensions
  const w = dims?.width
  const h = dims?.height
  if (typeof w === "number" && w > 0 && typeof h === "number" && h > 0) {
    return { width: w, height: h }
  }
  return null
}

function partnerLogoDisplaySize(intrinsic: { width: number; height: number }): {
  width: number
  height: number
} {
  const scale = Math.min(
    1,
    MAX_LOGO_H / intrinsic.height,
    MAX_LOGO_W / intrinsic.width,
  )
  return {
    width: Math.max(1, Math.round(intrinsic.width * scale)),
    height: Math.max(1, Math.round(intrinsic.height * scale)),
  }
}

export function PartnersSection({ title, partners }: PartnersSectionProps) {
  const { ref: wrapRef } = useGsapReveal()

  const withImage = partners.filter((p) => Boolean(p.image?.asset))
  if (withImage.length === 0) {
    return null
  }

  return (
    <Container>
      <div
        ref={wrapRef}
        className="flex w-full flex-col items-center gap-8"
        style={{ opacity: 0 }}
      >
        <h2 className="type-body-1 w-full max-w-prose text-center text-current">
          {title}
        </h2>

        <div className="mt-10 w-full md:mt-12 lg:mt-14">
          <Swiper
            slidesPerView="auto"
            spaceBetween={64}
            watchOverflow
            centeredSlides
            centerInsufficientSlides
            breakpoints={{
              768: {
                spaceBetween: 128,
                centeredSlides: false,
              },
            }}
            className="partners-swiper w-full [&_.swiper-slide]:h-auto! [&_.swiper-slide]:w-auto!"
          >
            {withImage.map((partner) => {
              const partnerName = partner.name?.trim() ?? ""
              const alt = partnerName !== "" ? partnerName : "Partner"
              const src = partnerLogoSrc(partner)
              if (!src) return null

              const intrinsic =
                partnerLogoIntrinsic(partner) ??
                ({ width: 240, height: 80 } as const)
              const { width: dispW, height: dispH } =
                partnerLogoDisplaySize(intrinsic)

              return (
                <SwiperSlide
                  key={partner._key}
                  className="box-border flex! shrink-0 items-center justify-center"
                  style={{ width: dispW, height: dispH }}
                >
                  <img
                    src={src}
                    alt={alt}
                    width={intrinsic.width}
                    height={intrinsic.height}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="block object-contain"
                    style={{ width: dispW, height: dispH }}
                  />
                </SwiperSlide>
              )
            })}
          </Swiper>
        </div>
      </div>
    </Container>
  )
}
