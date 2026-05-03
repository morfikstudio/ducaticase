"use client"

import { useTranslations } from "next-intl"

import { useGsapReveal } from "@/hooks/useGsapReveal"

import { LISTING_STATIC_MAP_ZOOM } from "@/lib/listingStaticMap"
import {
  buildListingLocationText,
  getListingCityLine,
  getListingStreetLine,
} from "@/lib/buildListingLocationText"

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
    z: String(LISTING_STATIC_MAP_ZOOM),
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

export type LocationMapProps = {
  lat: number
  lng: number
  location: Parameters<typeof buildListingLocationText>[0]
  positionInfoText?: string | null
}

export function LocationMap({
  lat,
  lng,
  location,
  positionInfoText,
}: LocationMapProps) {
  const { ref: wrapRef } = useGsapReveal()
  const t = useTranslations("listingDetail")

  const mobileSrc = staticMapProxyUrl(lat, lng, MOBILE_W, MOBILE_H)
  const desktopSrc = staticMapProxyUrl(lat, lng, DESKTOP_W, DESKTOP_H)

  const locationText = buildListingLocationText(location)
  const externalMapsUrl = googleMapsSearchUrl(lat, lng, locationText)
  const cityLine = getListingCityLine(location)
  const streetLine = getListingStreetLine(location)
  const positionInfo =
    typeof positionInfoText === "string" ? positionInfoText.trim() : ""
  const hasAddress = Boolean(cityLine || streetLine)
  const hasPositionBlock = Boolean(positionInfo)

  const bothTextBlocks = hasPositionBlock && hasAddress

  const positionBlock = hasPositionBlock ? (
    <div
      className={cn(
        "flex flex-col gap-2",
        bothTextBlocks ? "md:col-start-2 md:row-start-1" : "[grid-area:info]",
        "md:mb-6",
      )}
    >
      <p className="type-body-2 uppercase font-medium text-primary">
        {t("positionInfoTitle")}
      </p>
      <p className="type-body-2 text-primary whitespace-pre-line">
        {positionInfo}
      </p>
    </div>
  ) : null

  const addressBlock = hasAddress ? (
    <div
      className={cn(
        "flex flex-col gap-1 md:max-w-xs",
        bothTextBlocks ? "md:col-start-1 md:row-start-2" : "[grid-area:addr]",
      )}
    >
      {cityLine ? <p className="type-body-1 text-primary">{cityLine}</p> : null}
      {streetLine ? (
        <p className="type-body-2 text-primary">{streetLine}</p>
      ) : null}
    </div>
  ) : null

  const mapBlock = (
    <a
      href={externalMapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("listingMapBlockAria")}
      className={cn(
        "group relative block cursor-pointer rounded-sm outline-none",
        "transition-opacity group-hover:opacity-90",
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        "w-full rounded-md overflow-hidden bg-light-gray",
        "aspect-4/5 md:aspect-video",
        "md:min-w-0",
        bothTextBlocks ? "md:col-start-2 md:row-start-2" : "[grid-area:pic]",
      )}
    >
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

      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-full",
          "drop-shadow-md",
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={32}
          height={40}
          viewBox="0 0 32 40"
          fill="none"
          className="h-10 w-8 md:h-12 md:w-[38.4px]"
          aria-hidden
        >
          <path
            d="M15.6738 39.4517C21.1966 34.344 25.323 29.6388 28.6568 23.9272C32.7455 16.8569 31.4874 8.4531 25.474 3.54667C19.4605 -1.35977 10.6542 -1.18364 4.90491 4.12538C-6.49299 14.6302 4.0117 29.8275 15.6864 39.4517H15.6738Z"
            fill="#FF0000"
          />
          <path
            d="M14.29 10.4765C17.4602 9.68389 20.0644 11.9358 20.555 14.2632C21.1841 17.27 19.4354 19.9119 16.8941 20.5284C13.988 21.2455 11.3587 19.6729 10.5913 17.1064C9.76099 14.3513 11.0568 11.2816 14.29 10.4765Z"
            fill="white"
          />
        </svg>
      </span>
    </a>
  )

  return (
    <div ref={wrapRef} className="w-full" style={{ opacity: 0 }}>
      <div
        className={cn(
          "mt-8 gap-8",
          bothTextBlocks && [
            "flex flex-col",
            "md:grid md:grid-cols-[minmax(0,auto)_minmax(0,1fr)] md:grid-rows-[auto_auto]",
            "md:items-start",
          ],
          hasPositionBlock &&
            !hasAddress && [
              "grid [grid-template-areas:'info'_'pic']",
              "md:[grid-template-areas:'info'_'pic']",
            ],
          !hasPositionBlock &&
            hasAddress && [
              "grid [grid-template-areas:'addr'_'pic']",
              "md:grid-cols-[minmax(0,auto)_minmax(0,1fr)] md:grid-rows-1",
              "md:[grid-template-areas:'addr_pic']",
            ],
          !hasPositionBlock &&
            !hasAddress &&
            "grid grid-cols-1 [grid-template-areas:'pic']",
        )}
      >
        {hasPositionBlock ? positionBlock : null}
        {hasAddress ? addressBlock : null}
        {mapBlock}
      </div>
    </div>
  )
}
