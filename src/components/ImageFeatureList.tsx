"use client"

import { useEffect, useRef } from "react"
import type { SanityImageSource } from "@sanity/image-url/lib/types/types"
import { Link } from "@/i18n/navigation"
import gsap from "gsap"

import type { AppLocale } from "@/i18n/routing"

import { pickLocalizedString } from "@/sanity/lib/locale"

import { useGsapReveal } from "@/hooks/useGsapReveal"

import { cn } from "@/utils/classNames"

import { Container } from "@/components/ui/Container"
import { SanityImage } from "@/components/ui/SanityImage"

type ImageFeatureListProps = {
  locale: AppLocale
  title?: Parameters<typeof pickLocalizedString>[0] | null
  subtitle?: Parameters<typeof pickLocalizedString>[0] | null
  ctaLabel?: Parameters<typeof pickLocalizedString>[0] | null
  ctaHref?: string
  image?: SanityImageSource | null
  items?: Array<{
    _key?: string
    title?: Parameters<typeof pickLocalizedString>[0] | null
  }> | null
  className?: string
}

/** Ritorna "(01)", "(02)", … per indice 0-based (1-based display). */
function formatTwoDigitParenIndex(index: number): string {
  return `(${String(index + 1).padStart(2, "0")})`
}

export function ImageFeatureList({
  locale,
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  image,
  items,
  className,
}: ImageFeatureListProps) {
  const { ref: wrapRef, show: showWrap } = useGsapReveal()
  const valuesRef = useRef<Record<number, HTMLLIElement | null>>({
    0: null,
  })

  const resolvedTitle = pickLocalizedString(title ?? undefined, locale) ?? ""
  const resolvedSubtitle =
    pickLocalizedString(subtitle ?? undefined, locale) ?? ""

  const resolvedCtaLabel =
    pickLocalizedString(ctaLabel ?? undefined, locale) ?? ""
  const showCta =
    resolvedCtaLabel.trim() !== "" && (ctaHref?.trim() ?? "") !== ""

  const valuesItems = (items ?? [])
    .map((item) => pickLocalizedString(item?.title ?? undefined, locale) ?? "")
    .filter((item) => item.trim() !== "")

  useEffect(() => {
    if (!showWrap) return

    const elements = Object.values(valuesRef.current).filter(
      (el): el is HTMLLIElement => el !== null,
    )

    if (elements.length === 0) return

    const ctx = gsap.context(() => {
      elements.forEach((element) => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: element,
              start: "top 85%",
              end: "top 85%",
              invalidateOnRefresh: true,
            },
          })
          .fromTo(
            element,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power2.out",
            },
          )
      })
    })

    return () => ctx?.revert?.()
  }, [showWrap])

  return (
    <Container
      className={cn(
        "relative isolate w-full overflow-hidden",
        "py-20 lg:py-56",
        className,
      )}
    >
      <div ref={wrapRef} style={{ opacity: 0 }}>
        {/* HEADER */}
        <div
          className={cn(
            "flex flex-col gap-6 pb-16",
            "md:flex-row md:gap-12 md:justify-between",
            "lg:grid lg:grid-cols-12 lg:items-center lg:gap-4",
          )}
        >
          <h2
            className={cn(
              "type-heading-2",
              "md:flex-1",
              "lg:col-start-1 lg:col-span-5 lg:pl-16",
            )}
          >
            {resolvedTitle}
          </h2>

          <div
            className={cn(
              "flex flex-col gap-6",
              "md:flex-1",
              "lg:col-start-8 lg:col-span-5",
              "lg:max-w-[500px]",
            )}
          >
            <p className="type-body-2 text-gray">{resolvedSubtitle}</p>
            {showCta ? (
              <Link
                href={ctaHref!}
                className={cn(
                  "type-body-2 uppercase underline",
                  "underline-offset-[0.35em] hover:no-underline",
                )}
              >
                {resolvedCtaLabel}
              </Link>
            ) : null}
          </div>
        </div>

        <div className="relative">
          {/* BG IMAGE */}
          <div
            className={cn(
              "absolute",
              "overflow-hidden",
              "inset-x-6 inset-y-12",
              "md:inset-x-8 md:inset-y-16",
              "md:inset-x-16 md:inset-y-24",
            )}
          >
            <SanityImage
              image={image}
              locale={locale}
              alt=""
              params={{
                width: 1280,
                height: 720,
                quality: 50,
                sizes: "100vw",
              }}
              fill
              className="pointer-events-none -z-20 object-cover object-center"
            />
          </div>

          {valuesItems.length > 0 ? (
            <ul className="grid gap-2">
              {valuesItems.map((item, index) => (
                <li
                  key={item}
                  ref={(el) => {
                    if (valuesRef.current) {
                      valuesRef.current[index] = el
                    }
                  }}
                  className={cn(
                    "rounded-md bg-[#282828]/30 backdrop-blur-lg",
                    "px-4 py-8",
                    "md:px-8 md:py-12",
                    "lg:px-0 lg:py-14",
                    "flex items-center gap-8",
                    "md:justify-between",
                    "lg:grid lg:grid-cols-12 lg:items-center lg:gap-4",
                  )}
                >
                  <span
                    className={cn(
                      "type-body-3 lg:type-heading-2",
                      "lg:col-start-1 lg:col-span-3 lg:pl-16",
                    )}
                  >
                    {formatTwoDigitParenIndex(index)}
                  </span>

                  <span
                    className={cn(
                      "type-body-3 text-gray",
                      "lg:type-body-1 md:w-[400px]",
                      "lg:col-start-8 lg:col-span-4 lg:w-auto",
                    )}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </Container>
  )
}
