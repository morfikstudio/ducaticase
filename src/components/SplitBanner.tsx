"use client"

import { useCallback, useState } from "react"
import type { SanityImageSource } from "@sanity/image-url/lib/types/types"

import type { AppLocale } from "@/i18n/routing"

import { useGsapReveal } from "@/hooks/useGsapReveal"

import { cn } from "@/utils/classNames"

import { ButtonCta } from "@/components/ui/ButtonCta"
import { SanityImage } from "@/components/ui/SanityImage"

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
    <div className={cn("bg-bg", className)}>
      <div ref={wrapRef} className="w-full" style={{ opacity: 0 }}>
        <div className="grid grid-cols-1 md:grid-cols-2 md:min-h-[min(100vh,686px)]">
          <div
            className={cn(
              "flex flex-col justify-center gap-11 py-16 md:py-20",
              "px-4 md:px-8",
              reverse ? "md:order-2" : "md:order-1",
              reverse ? "lg:pl-28" : "lg:pr-28",
            )}
          >
            <div className="flex flex-col gap-7">
              <div className="type-heading-2 text-primary">{title}</div>
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
                "relative aspect-720/686 w-full min-h-0 overflow-hidden md:aspect-auto md:h-full",
                reverse ? "md:order-1" : "md:order-2",
              )}
            >
              <SanityImage
                image={image}
                locale={locale}
                alt={imageAlt}
                altFallback={title}
                params={{
                  width: 720,
                  height: 686,
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
    </div>
  )
}
