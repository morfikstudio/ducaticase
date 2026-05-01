"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"
import type { Swiper as SwiperType } from "swiper"

import type { AppLocale } from "@/i18n/routing"

import { getSanityImageUrl } from "@/lib/sanity"
import { pickLocalizedString } from "@/sanity/lib/locale"
import type {
  BUSINESS_PAGE_SITE_CONTENT_QUERY_RESULT,
  LocalizedPortableText,
  LocalizedString,
} from "@/sanity/types"

import { useGsapReveal } from "@/hooks/useGsapReveal"

import { cn } from "@/utils/classNames"

import { Button } from "@/components/ui/Button"
import { Container } from "@/components/ui/Container"
import { PortableTextComponent } from "@/components/ui/PortableText"

export type BannerPartnersPartner = NonNullable<
  NonNullable<
    NonNullable<BUSINESS_PAGE_SITE_CONTENT_QUERY_RESULT>["businessPage"]
  >["bannerPartnersItems"]
>[number]

export type BannerPartnersProps = {
  locale: AppLocale
  title?: LocalizedString | null
  text?: LocalizedPortableText | null
  ctaLabel?: LocalizedString | null
  ctaHref?: string
  partners?: BannerPartnersPartner[]
  className?: string
}

function partnerLogoSrc(partner: BannerPartnersPartner): string | undefined {
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

function partnerLogoIntrinsic(partner: BannerPartnersPartner): {
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

export function BannerPartners({
  locale,
  title,
  text,
  ctaLabel,
  ctaHref,
  partners = [],
  className,
}: BannerPartnersProps) {
  const { ref: wrapRef } = useGsapReveal()

  const [isOverflow, setIsOverflow] = useState<boolean | null>(null)
  const swiperKey = useRef<string | null>("")

  const resolvedTitle = pickLocalizedString(title ?? undefined, locale) ?? ""
  const resolvedCtaLabel =
    pickLocalizedString(ctaLabel ?? undefined, locale) ?? ""
  const showCta =
    resolvedCtaLabel.trim() !== "" && (ctaHref?.trim() ?? "") !== ""

  const withImage = partners.filter((p) => Boolean(p.image?.asset))

  const hasContent =
    resolvedTitle.trim() !== "" ||
    Boolean(text) ||
    showCta ||
    withImage.length > 0

  if (!hasContent) {
    return null
  }

  const repeatCount = Math.max(4, Math.ceil(16 / Math.max(1, withImage.length)))
  const loopedPartners = Array.from({ length: repeatCount }, (_, i) =>
    withImage.map((p) => ({ ...p, _loopKey: `${p._key}-${i}` })),
  ).flat()

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

  if (isOverflow === null) {
    swiperKey.current = "measuring"
  } else if (isOverflow === true) {
    swiperKey.current = "animated"
  } else {
    swiperKey.current = "static"
  }

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

  return (
    <div
      className={cn(
        "w-full py-24 md:py-32 lg:py-48",
        "bg-primary text-accent",
        "overflow-x-clip",
        className,
      )}
    >
      {resolvedTitle.trim() !== "" || Boolean(text) || showCta ? (
        <div ref={wrapRef} style={{ opacity: 0 }}>
          <Container
            className={cn(
              "flex flex-col gap-8",
              "md:gap-12 md:flex-row justify-between",
              "lg:gap-32",
            )}
          >
            <div className={cn("md:flex-1", "md:max-w-[650px]")}>
              {resolvedTitle.trim() !== "" ? (
                <h2
                  className={cn(
                    "type-heading-2 lg:type-heading-1",
                    "md:flex-1",
                    "lg:max-w-[470px]",
                  )}
                >
                  {resolvedTitle}
                </h2>
              ) : null}

              <PortableTextComponent
                text={text}
                locale={locale}
                className="type-body-3 lg:type-body-1"
              />
            </div>

            {showCta ? (
              <Button href={ctaHref!} className="self-start" variant="dark">
                {resolvedCtaLabel}
              </Button>
            ) : null}
          </Container>
        </div>
      ) : null}

      {/* Partners carousel */}
      {withImage.length > 0 ? (
        <div className={cn("mt-16 md:mt-20 lg:mt-32", "w-full")}>
          <Container>
            <Swiper
              key={swiperKey.current}
              modules={[Autoplay]}
              slidesPerView="auto"
              spaceBetween={64}
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
                  spaceBetween: 128,
                },
              }}
              onInit={(swiper) => swiperUpdate(swiper)}
              onResize={(swiper) => swiperUpdate(swiper)}
              className="partners-swiper w-full [&_.swiper-slide]:h-auto! [&_.swiper-slide]:w-auto!"
            >
              {(Boolean(isOverflow) ? loopedPartners : withImage).map(
                (partner) => {
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
                  const height = Math.max(
                    1,
                    Math.round(intrinsic.height * scale),
                  )

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
                },
              )}
            </Swiper>
          </Container>
        </div>
      ) : null}
    </div>
  )
}
