"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"

import type { AppLocale } from "@/i18n/routing"
import type { CONTACT_SITE_CONTENT_QUERY_RESULT } from "@/sanity/types"

import { useGsapReveal } from "@/hooks/useGsapReveal"

import { cn } from "@/utils/classNames"

import { LocationMap } from "@/components/LocationMap"
import { SanityImage } from "@/components/ui/SanityImage"
import { Container } from "@/components/ui/Container"
import { TextBlock } from "@/components/ui/TextBlock"
import { useCallback, type ReactNode } from "react"

type ContactPage = NonNullable<
  NonNullable<CONTACT_SITE_CONTENT_QUERY_RESULT>["contactPage"]
>
type ContactHeroImageRow = NonNullable<ContactPage["heroImage"]>

export type ContactHeroProps = {
  title: string
  heroLandscape: ContactHeroImageRow["imageLandscape"] | null | undefined
  heroPortrait: ContactHeroImageRow["imagePortrait"] | null | undefined
  subtitle: string
  text: ContactPage["text"] | undefined
  email: string
  phone: string
  whatsapp: string
  address: string
  mapCoords: { lat: number; lng: number } | null
  locale: AppLocale
}

const CONTACT_INFO_KEYS = ["email", "phone", "whatsapp", "address"] as const
type ContactInfoRowKind = (typeof CONTACT_INFO_KEYS)[number]

function whatsappHref(raw: string): string {
  const t = raw.trim()
  if (t === "") return "#"
  if (/^https?:\/\//i.test(t)) return t
  const digits = t.replace(/\D/g, "")
  return digits !== "" ? `https://wa.me/${digits}` : "#"
}

function phoneHref(raw: string): string {
  const compact = raw.replace(/\s/g, "")
  return compact !== "" ? `tel:${compact}` : "#"
}

function contactInfoIcon(kind: ContactInfoRowKind): ReactNode {
  const CONTACT_INFO_ICON_PATH_STROKE = {
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  } as const

  const CONTACT_INFO_ICON_DOT_STROKE = {
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinejoin: "round",
    fill: "none",
  } as const

  const svgBase = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none" as const,
    className: "shrink-0 text-white",
    "aria-hidden": true,
  }

  switch (kind) {
    case "email":
      return (
        <svg {...svgBase} width={16} height={13} viewBox="0 0 16 13">
          <path
            d="M1.477 1.48493L6.22738 5.10886L6.22896 5.11018C6.75643 5.50094 7.02033 5.69644 7.30936 5.77196C7.56484 5.83871 7.83339 5.83871 8.08887 5.77196C8.37816 5.69637 8.64282 5.5003 9.17122 5.10886C9.17122 5.10886 12.2182 2.74674 13.9214 1.48493M0.699219 9.18509V3.21366C0.699219 2.33358 0.699219 1.89321 0.868764 1.55706C1.0179 1.26138 1.2557 1.02115 1.54839 0.870494C1.88115 0.699219 2.31707 0.699219 3.18826 0.699219H12.2105C13.0817 0.699219 13.5167 0.699219 13.8494 0.870494C14.1421 1.02115 14.3807 1.26138 14.5298 1.55706C14.6992 1.89288 14.6992 2.33271 14.6992 3.21108V9.18774C14.6992 10.0661 14.6992 10.5053 14.5298 10.8411C14.3807 11.1368 14.1421 11.3775 13.8494 11.5281C13.517 11.6992 13.0822 11.6992 12.2127 11.6992H3.1857C2.31621 11.6992 1.88082 11.6992 1.54839 11.5281C1.2557 11.3775 1.0179 11.1368 0.868764 10.8411C0.699219 10.505 0.699219 10.0652 0.699219 9.18509Z"
            {...CONTACT_INFO_ICON_PATH_STROKE}
          />
        </svg>
      )
    case "phone":
      return (
        <svg {...svgBase} width={14} height={14} viewBox="0 0 14 14">
          <path
            d="M13.0259 4.52121C11.6695 8.25045 8.38253 11.1617 4.26123 12.2432C2.33811 12.7478 0.699219 11.0874 0.699219 9.09922C0.699219 8.60216 1.10321 8.2041 1.59772 8.15388C2.32074 8.08046 3.01521 7.91947 3.6684 7.68265L4.90282 8.82211C6.91054 7.93521 8.53821 6.43275 9.49901 4.57947L8.2646 3.44001C8.50284 2.8801 8.67025 2.28732 8.75663 1.6711C8.83138 1.13783 9.26074 0.699219 9.79922 0.699219C11.9531 0.699219 13.7622 2.49704 13.0259 4.52121Z"
            {...CONTACT_INFO_ICON_PATH_STROKE}
          />
        </svg>
      )
    case "whatsapp":
      return (
        <svg {...svgBase} width={16} height={16} viewBox="0 0 16 16">
          <path
            d="M7.87567 15.0521C11.8391 15.0521 15.0521 11.8391 15.0521 7.87567C15.0521 3.91223 11.8391 0.699219 7.87567 0.699219C3.91223 0.699219 0.699219 3.91223 0.699219 7.87567C0.699219 9.06189 0.987019 10.1809 1.4966 11.1666L0.699219 15.0521L4.58471 14.2547C5.57047 14.7643 6.68946 15.0521 7.87567 15.0521Z"
            {...CONTACT_INFO_ICON_PATH_STROKE}
          />
          <rect
            x={4.28516}
            y={7.87695}
            width={0.00896233}
            height={0.00896233}
            {...CONTACT_INFO_ICON_DOT_STROKE}
          />
          <rect
            x={7.875}
            y={7.87695}
            width={0.00896233}
            height={0.00896233}
            {...CONTACT_INFO_ICON_DOT_STROKE}
          />
          <rect
            x={11.4648}
            y={7.87695}
            width={0.00896233}
            height={0.00896233}
            {...CONTACT_INFO_ICON_DOT_STROKE}
          />
        </svg>
      )
    case "address":
      return (
        <svg {...svgBase} width={13} height={16} viewBox="0 0 13 16">
          <path
            d="M0.699219 6.16066C0.699219 9.98826 4.03418 13.1535 5.51032 14.3671C5.72158 14.5408 5.82848 14.6286 5.98609 14.6732C6.10882 14.7079 6.28945 14.7079 6.41218 14.6732C6.57009 14.6286 6.67623 14.5415 6.88829 14.3672C8.36443 13.1537 11.6992 9.98861 11.6992 6.16101C11.6992 4.7125 11.1198 3.32314 10.0883 2.29889C9.05687 1.27464 7.65801 0.699219 6.19931 0.699219C4.74061 0.699219 3.3416 1.27472 2.31014 2.29898C1.27868 3.32323 0.699219 4.71215 0.699219 6.16066Z"
            {...CONTACT_INFO_ICON_PATH_STROKE}
          />
          <path
            d="M4.62781 6.22152C4.62781 7.09292 5.33137 7.79932 6.19925 7.79932C7.06713 7.79932 7.77069 7.09292 7.77069 6.22152C7.77069 5.35013 7.06713 4.64372 6.19925 4.64372C5.33137 4.64372 4.62781 5.35013 4.62781 6.22152Z"
            {...CONTACT_INFO_ICON_PATH_STROKE}
          />
        </svg>
      )
    default: {
      const _exhaustive: never = kind
      return _exhaustive
    }
  }
}

export function ContactHero({
  title,
  heroLandscape,
  heroPortrait,
  subtitle,
  text,
  email,
  phone,
  whatsapp,
  address,
  mapCoords,
  locale,
}: ContactHeroProps) {
  const t = useTranslations("contactPage")
  const [imageReady, setImageReady] = useState(false)

  const { ref: wrapRef } = useGsapReveal({
    fromOpacity: 1,
    ready: imageReady,
  })

  const renderInfoListItem = useCallback(
    (key: ContactInfoRowKind) => {
      let children = null
      const childClassName = cn(
        "flex items-center gap-3",
        "px-6 py-3 lg:px-0 lg:py-0",
        "type-body-3 lg:type-body-2 xl:type-body-1",
        "underline-offset-4",
      )

      switch (key) {
        case "email":
          if (email) {
            children = (
              <a
                className={cn(childClassName, "group-hover:underline")}
                href={`mailto:${email}`}
              >
                {contactInfoIcon(key)}
                <span className="min-w-0">{email}</span>
              </a>
            )
          }
          break
        case "phone":
          if (phone) {
            children = (
              <a
                className={cn(childClassName, "group-hover:underline")}
                href={phoneHref(phone)}
              >
                {contactInfoIcon(key)}
                <span className="min-w-0">{phone}</span>
              </a>
            )
          }
          break
        case "whatsapp":
          if (whatsapp) {
            children = (
              <a
                className={cn(childClassName, "group-hover:underline")}
                href={whatsappHref(whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {contactInfoIcon(key)}
                <span className="min-w-0">{t("whatsappChat")}</span>
              </a>
            )
          }
          break
        case "address":
          if (address) {
            children = (
              <p className={cn(childClassName)}>
                {contactInfoIcon(key)}
                <span className="min-w-0">{address}</span>
              </p>
            )
          }
          break
      }

      return children ? (
        <li
          key={key}
          className={cn(
            "rounded-full backdrop-blur-lg",
            "bg-[#858D94]/20 lg:bg-transparent lg:backdrop-blur-none",
            "group",
          )}
        >
          {children}
        </li>
      ) : null
    },
    [email, phone, whatsapp, address, t],
  )

  return (
    <div ref={wrapRef}>
      <Container>
        {/* HEADER */}
        <section className="grid grid-cols-12 gap-x-4">
          {title ? (
            <div
              className={cn(
                "px-4 lg:px-0",
                "col-span-12 lg:col-start-1 lg:col-span-8 xl:col-span-7",
              )}
            >
              <h1
                className="type-body-1 md:type-heading-1 text-balance"
                dangerouslySetInnerHTML={{ __html: title }}
              />
            </div>
          ) : null}

          {/* HERO IMAGE & INFO */}
          <div
            className={cn(
              "relative mt-10 md:mt-16 lg:mt-24",
              "aspect-4/5 lg:aspect-5/3",
              "col-span-11 lg:col-span-10 lg:col-start-2",
            )}
          >
            <SanityImage
              landscape={heroLandscape ?? undefined}
              portrait={heroPortrait ?? undefined}
              locale={locale}
              altFallback={title}
              landscapeParams={{
                width: 1024,
                height: 768,
                sizes: "(min-width: 1px) 75vw",
              }}
              portraitParams={{
                width: 720,
                height: 900,
                sizes: "(min-width: 1px) 100vw",
              }}
              fill
              className="object-cover object-center overflow-hidden"
              loading="eager"
              onLoad={() => requestAnimationFrame(() => setImageReady(true))}
              onError={() => requestAnimationFrame(() => setImageReady(true))}
            />

            <div
              className={cn(
                "absolute top-1/2 -translate-y-1/2",
                "-right-8 md:-right-16 lg:-right-23",
                "lg:top-0 lg:-translate-y-24 xl:-translate-y-32",
                "rounded-sm bg-[#858D94]/10 backdrop-blur-lg",
                "px-8 py-12 lg:px-16 xl:px-20 xl:py-16",
              )}
            >
              <ul className="flex flex-col gap-3 lg:gap-6">
                {CONTACT_INFO_KEYS.map(renderInfoListItem)}
              </ul>
            </div>
          </div>
        </section>

        {/* CONTENT */}
        {subtitle || text ? (
          <section className="mt-20 md:mt-24 lg:mt-44">
            <TextBlock
              title={subtitle}
              text={text}
              locale={locale}
              titleTag="h2"
            />
          </section>
        ) : null}

        {/* MAP */}
        {mapCoords ? (
          <section className="mt-10 md:mt-16 lg:mt-24">
            <LocationMap
              lat={mapCoords.lat}
              lng={mapCoords.lng}
              location={null}
            />
          </section>
        ) : null}
      </Container>
    </div>
  )
}
