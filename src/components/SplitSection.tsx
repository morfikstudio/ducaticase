"use client"

import { useCallback, useState } from "react"
import type { SanityImageSource } from "@sanity/image-url/lib/types/types"

import type { AppLocale } from "@/i18n/routing"

import { useGsapReveal } from "@/hooks/useGsapReveal"

import { cn } from "@/utils/classNames"

import { Container } from "@/components/ui/Container"
import { SanityImage } from "@/components/ui/SanityImage"
import { PortableTextComponent } from "@/components/ui/PortableText"

type SplitSectionProps = {
  title?: string
  subtitle?: string
  body?: Parameters<typeof PortableTextComponent>[0]["text"]
  locale: AppLocale
  imageLandscape?: SanityImageSource | null
  imagePortrait?: SanityImageSource | null
  /** Overrides localized CMS `alt` when set. */
  imageAlt?: string
  reverse?: boolean
}

export function SplitSection({
  title = "",
  subtitle = "",
  body,
  locale,
  imageLandscape,
  imagePortrait,
  imageAlt,
  reverse = false,
}: SplitSectionProps) {
  const hasAnyImage = Boolean(imageLandscape ?? imagePortrait)

  const [imageReady, setImageReady] = useState(!hasAnyImage)
  const handleImageSettled = useCallback(() => {
    requestAnimationFrame(() => {
      setImageReady(true)
    })
  }, [])

  const { ref: wrapRef } = useGsapReveal({ ready: imageReady })

  return (
    <div
      className={cn(
        "w-full bg-primary text-accent",
        reverse ? "bg-[#f9f9f9]" : "",
        "pt-12 md:pt-24 lg:pt-6",
        "pb-4 md:pb-8 lg:pb-6",
      )}
    >
      <div ref={wrapRef} style={{ opacity: 0 }}>
        <Container
          className={cn(
            "lg:flex lg:items-center lg:gap-20",
            reverse ? "lg:flex-row-reverse" : "",
          )}
        >
          <div
            className={cn(
              "flex-1 min-w-0 lg:flex-none lg:shrink-0",
              "lg:max-w-[550px] lg:py-8",
            )}
          >
            {title ? <h2 className="type-display-1">{title}</h2> : null}
            {subtitle ? (
              <p className="type-body-1 mt-8 lg:mt-12">{subtitle}</p>
            ) : null}
            {body ? (
              <PortableTextComponent
                text={body}
                locale={locale}
                className="type-body-3 lg:type-body-2 mt-4 [&_p]:mt-0 [&_p+p]:mt-4"
              />
            ) : null}
          </div>

          {hasAnyImage ? (
            <div className="mt-24 w-full lg:mt-0 lg:flex-1 lg:min-w-0">
              <SanityImage
                landscape={imageLandscape}
                portrait={imagePortrait}
                locale={locale}
                alt={imageAlt}
                altFallback={title}
                breakpoint="lg"
                landscapeParams={{
                  width: 900,
                  height: 900,
                  sizes: "50vw",
                }}
                portraitParams={{
                  width: 720,
                  height: 375,
                  sizes: "100vw",
                }}
                className="h-auto w-full"
                onLoad={handleImageSettled}
                onError={handleImageSettled}
              />
            </div>
          ) : null}
        </Container>
      </div>
    </div>
  )
}
