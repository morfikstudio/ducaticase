"use client"

import { useCallback, useState } from "react"
import type { SanityImageSource } from "@sanity/image-url/lib/types/types"

import type { AppLocale } from "@/i18n/routing"

import { useGsapReveal } from "@/hooks/useGsapReveal"

import { cn } from "@/utils/classNames"

import { ButtonCta } from "@/components/ui/ButtonCta"
import { SanityImage } from "@/components/ui/SanityImage"

/** Converte `<br>`, `<br />` ecc. in newline per `whitespace-pre-line` (contenuto da CMS/HTML leggero). */
function brTagsToNewlines(text: string): string {
  return text.replace(/<br\s*\/?>/gi, "\n")
}

export type SplitBannerProps = {
  title: string
  description: string
  ctaLabel?: string
  ctaHref?: string
  image?: SanityImageSource | null
  locale: AppLocale
  /** Override dell’alt localizzato da CMS (come `imageAlt` in SplitSection). */
  imageAlt?: string
  reverse?: boolean
  className?: string
}

export function SplitBanner({
  title,
  description,
  ctaLabel = undefined,
  ctaHref = undefined,
  image,
  locale,
  imageAlt,
  reverse = false,
  className,
}: SplitBannerProps) {
  const hasImage = Boolean(image)

  const [imageReady, setImageReady] = useState(!hasImage)
  const handleImageSettled = useCallback(() => {
    requestAnimationFrame(() => {
      setImageReady(true)
    })
  }, [])

  const { ref: wrapRef } = useGsapReveal({ ready: imageReady })

  return (
    <section className={cn("bg-bg", className)}>
      <div ref={wrapRef} className="w-full" style={{ opacity: 0 }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:min-h-[min(100vh,686px)]">
          <div
            className={cn(
              "flex flex-col justify-center gap-11 px-6 py-16 lg:px-12 lg:py-20 xl:pl-24",
              reverse ? "lg:order-2" : "lg:order-1",
            )}
          >
            <div className="flex max-w-[500px] flex-col gap-7">
              <div className="type-heading-1 text-primary">{title}</div>
              <p className="type-body-2 whitespace-pre-line text-gray">
                {brTagsToNewlines(description)}
              </p>
            </div>

            {ctaLabel && ctaHref ? (
              <ButtonCta className="self-start" href={ctaHref}>
                {ctaLabel}
              </ButtonCta>
            ) : null}
          </div>

          {hasImage ? (
            <div
              className={cn(
                "relative aspect-720/686 w-full min-h-0 overflow-hidden lg:aspect-auto lg:h-full",
                reverse ? "lg:order-1" : "lg:order-2",
              )}
            >
              <SanityImage
                image={image}
                locale={locale}
                alt={imageAlt}
                altFallback={title}
                params={{
                  width: 1440,
                  height: 1372,
                  quality: 80,
                  sizes: "(max-width: 1023px) 100vw, 50vw",
                }}
                fill
                className="object-cover object-center"
                onLoad={handleImageSettled}
                onError={handleImageSettled}
              />

              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-linear-to-b from-[rgba(27,27,27,0.22)] to-[rgba(0,0,0,0)] to-[20.452%]"
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
