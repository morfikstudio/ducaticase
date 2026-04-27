"use client"

import { useCallback, useState } from "react"
import type { SanityImageSource } from "@sanity/image-url/lib/types/types"

import type { AppLocale } from "@/i18n/routing"

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

  return (
    <div
      className={cn(
        "w-full bg-primary text-accent",
        "flex h-full min-h-0 flex-col justify-center",
      )}
    >
      <Container
        className={cn(
          "flex h-full min-h-0 flex-col",
          "pt-12 pb-4 justify-between",
          "md:pt-24 md:pb-12",
          "lg:py-8 lg:flex-row lg:items-stretch lg:gap-12 xl:gap-20",
          reverse ? "lg:flex-row-reverse" : "",
        )}
      >
        <div
          className={cn(
            "flex min-h-0 min-w-0 flex-col justify-center max-lg:w-full",
            "md:max-w-[650px]",
            "lg:max-w-[350px] xl:max-w-[500px]",
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
          <div
            className={cn(
              "relative mt-8 w-full",
              "max-lg:shrink-0 max-lg:aspect-2/1 max-lg:overflow-hidden",
              "lg:mt-0 lg:h-full lg:min-h-0 lg:min-w-[50%] lg:flex-1 lg:self-stretch",
            )}
          >
            <SanityImage
              landscape={imageLandscape}
              portrait={imagePortrait}
              locale={locale}
              alt={imageAlt}
              altFallback={title}
              breakpoint="lg"
              fill
              landscapeParams={{
                width: 900,
                height: 900,
                sizes: "(min-width: 1024px) 50vw, 100vw",
              }}
              portraitParams={{
                width: 720,
                height: 360,
                sizes: "100vw",
              }}
              className="object-cover"
              onLoad={handleImageSettled}
              onError={handleImageSettled}
            />
          </div>
        ) : null}
      </Container>
    </div>
  )
}
