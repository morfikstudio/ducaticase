"use client"

import { useEffect, useLayoutEffect } from "react"
import { useTranslations } from "next-intl"
import gsap from "gsap"

import { useInView } from "@/hooks/useInView"

import { prefersReducedMotion } from "@/utils/reducedMotion"
import { cn } from "@/utils/classNames"

/** 4:5 mobile, 16:9 desktop */
const MOBILE_W = 480
const MOBILE_H = 600
const DESKTOP_W = 640
const DESKTOP_H = 360

function staticMapProxyUrl(
  lat: number,
  lng: number,
  width: number,
  height: number,
): string {
  const params = new URLSearchParams({
    lat: String(lat),
    lng: String(lng),
    w: String(width),
    h: String(height),
  })
  return `/api/maps/static?${params.toString()}`
}

function googleMapsSearchUrl(
  lat: number,
  lng: number,
  locationLine: string | null,
): string {
  const query =
    locationLine && locationLine.trim() !== ""
      ? locationLine.trim()
      : `${lat},${lng}`
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

type ListingLocationMapProps = {
  lat: number
  lng: number
  locationText: string | null
}

export function ListingLocationMap({
  lat,
  lng,
  locationText,
}: ListingLocationMapProps) {
  const t = useTranslations("listingDetail")
  const { ref: sectionRef, load, show } = useInView()

  const mobileSrc = staticMapProxyUrl(lat, lng, MOBILE_W, MOBILE_H)
  const desktopSrc = staticMapProxyUrl(lat, lng, DESKTOP_W, DESKTOP_H)
  const externalMapsUrl = googleMapsSearchUrl(lat, lng, locationText)

  /* Initial state */
  useLayoutEffect(() => {
    if (!sectionRef.current) return
    gsap.set(sectionRef.current, { opacity: 0, y: 20 })
  }, [])

  /* Entry animation */
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
  }, [show])

  return (
    <section ref={sectionRef} className="w-full" style={{ opacity: 0 }}>
      <a
        href={externalMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("listingMapBlockAria")}
        className={cn(
          "group block cursor-pointer rounded-sm outline-none",
          "transition-opacity group-hover:opacity-90",
          "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        )}
      >
        <div
          className={cn(
            "mt-8 w-full overflow-hidden bg-light-gray",
            "aspect-4/5 md:aspect-video",
          )}
        >
          {load ? (
            <picture className="block h-full w-full">
              <source media="(min-width: 768px)" srcSet={desktopSrc} />
              <img
                src={mobileSrc}
                alt=""
                width={MOBILE_W}
                height={MOBILE_H}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </picture>
          ) : (
            <div
              className="h-full w-full animate-pulse bg-light-gray"
              aria-hidden
            />
          )}
        </div>
      </a>
    </section>
  )
}
