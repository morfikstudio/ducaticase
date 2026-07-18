"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"
import type { Swiper as SwiperType } from "swiper"

import { getSanityImageUrl } from "@/lib/sanity"
import type { HOME_SITE_CONTENT_QUERY_RESULT } from "@/sanity/types"

import { useGsapReveal } from "@/hooks/useGsapReveal"

import { Container } from "@/components/ui/Container"

export type PartnersSectionPartner = NonNullable<
  NonNullable<
    NonNullable<
      NonNullable<HOME_SITE_CONTENT_QUERY_RESULT>["homePage"]
    >["partnerGroups"]
  >[number]["partners"]
>[number]

export type PartnersSectionGroup = {
  title: string
  partners: PartnersSectionPartner[]
}

export type PartnersSectionProps = {
  groups: PartnersSectionGroup[]
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

function PartnersGroup({ title, partners }: PartnersSectionGroup) {
  const { ref: wrapRef } = useGsapReveal()

  const [isOverflow, setIsOverflow] = useState<boolean | null>(null)
  const swiperKey = useRef<string | null>("")

  const withImage = partners.filter((p) => Boolean(p.image?.asset))

  /*
  Measure the intrinsic width of the slides to determine if they overflow.
  */
  const baseSlideWidths = useMemo(
    () =>
      withImage.map((partner) => {
        const intrinsic = partnerLogoIntrinsic(partner)
        if (!intrinsic) return 0

        const scale = Math.min(1, 88 / intrinsic.height, 320 / intrinsic.width)
        return Math.max(1, Math.round(intrinsic.width * scale))
      }),
    [withImage],
  )

  const swiperUpdate = useCallback(
    (swiper: SwiperType) => {
      if (!swiper) return
      const spaceBetween = Number(swiper.params.spaceBetween ?? 0)
      const baseTrackWidth =
        baseSlideWidths.reduce((sum, width) => sum + width, 0) +
        Math.max(0, baseSlideWidths.length - 1) * spaceBetween

      setIsOverflow(baseTrackWidth > swiper.width)
      requestAnimationFrame(() => swiper.update())
    },
    [baseSlideWidths],
  )

  if (withImage.length === 0) {
    return null
  }

  /*
  Duplicate slides only when overflow is confirmed, so Swiper always has
  enough DOM content for a seamless loop (avoids the loop warning).
  */

  const repeatCount = Math.max(4, Math.ceil(16 / withImage.length))
  const loopedPartners = Array.from({ length: repeatCount }, (_, i) =>
    withImage.map((p) => ({ ...p, _loopKey: `${p._key}-${i}` })),
  ).flat()

  if (isOverflow === null) {
    swiperKey.current = "measuring"
  } else if (isOverflow === true) {
    swiperKey.current = "animated"
  } else {
    swiperKey.current = "static"
  }

  const heading = title.trim()

  return (
    <div
      ref={wrapRef}
      className="flex w-full flex-col items-center gap-8"
      style={{ opacity: 0 }}
    >
      {heading !== "" ? (
        <h2 className="type-body-1 w-full max-w-prose text-center text-current">
          {heading}
        </h2>
      ) : null}

      <div className="mt-10 lg:mt-8 w-full">
        <Swiper
          key={swiperKey.current}
          modules={[Autoplay]}
          slidesPerView="auto"
          spaceBetween={80}
          watchOverflow
          lazyPreloadPrevNext={5}
          centeredSlides={Boolean(isOverflow)}
          centerInsufficientSlides={!Boolean(isOverflow)}
          loop={Boolean(isOverflow)}
          autoplay={
            Boolean(isOverflow)
              ? {
                  delay: 0,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: false,
                }
              : false
          }
          speed={2000}
          allowTouchMove={false}
          breakpoints={{
            768: {
              spaceBetween: 152,
            },
          }}
          onInit={(swiper) => swiperUpdate(swiper)}
          onResize={(swiper) => swiperUpdate(swiper)}
          className="partners-swiper w-full [&_.swiper-slide]:h-auto! [&_.swiper-slide]:w-auto!"
        >
          {(Boolean(isOverflow) ? loopedPartners : withImage).map((partner) => {
            const partnerName = partner.name?.trim() ?? ""
            const alt = partnerName !== "" ? partnerName : "Partner"
            const src = partnerLogoSrc(partner)

            if (!src) return null

            const intrinsic =
              partnerLogoIntrinsic(partner) ??
              ({ width: 240, height: 80 } as const)

            if (!intrinsic) return null

            const scale = Math.min(
              1,
              88 / intrinsic.height,
              320 / intrinsic.width,
            )

            const width = Math.max(1, Math.round(intrinsic.width * scale))
            const height = Math.max(1, Math.round(intrinsic.height * scale))

            const slideKey = Boolean(isOverflow)
              ? (partner as (typeof loopedPartners)[number])._loopKey
              : partner._key

            return (
              <SwiperSlide
                key={slideKey}
                className="box-border flex! shrink-0 items-center justify-center"
                style={{ width, height }}
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
                  style={{ width, height }}
                />
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>
    </div>
  )
}

export function PartnersSection({ groups }: PartnersSectionProps) {
  const groupsWithImage = groups.filter((group) =>
    group.partners.some((p) => Boolean(p.image?.asset)),
  )

  if (groupsWithImage.length === 0) {
    return null
  }

  return (
    <Container>
      <div className="flex w-full flex-col gap-24 md:gap-32">
        {groupsWithImage.map((group, index) => (
          <PartnersGroup
            key={index}
            title={group.title}
            partners={group.partners}
          />
        ))}
      </div>
    </Container>
  )
}
