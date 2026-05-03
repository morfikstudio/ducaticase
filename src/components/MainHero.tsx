"use client"

import { useCallback, useEffect, useState } from "react"
import type { SanityImageSource } from "@sanity/image-url/lib/types/types"

import type { AppLocale } from "@/i18n/routing"

import { useGsapReveal } from "@/hooks/useGsapReveal"

import { cn } from "@/utils/classNames"

import { Container } from "@/components/ui/Container"
import { SanityImage } from "@/components/ui/SanityImage"
import { TitleReveal } from "@/components/ui/TitleReveal"

type MainHeroProps = {
  locale: AppLocale
  title: string
  imageLandscape?: SanityImageSource | null
  imagePortrait?: SanityImageSource | null
}

export function MainHero({
  locale,
  title,
  imageLandscape,
  imagePortrait,
}: MainHeroProps) {
  const [imageReady, setImageReady] = useState(false)
  const { ref: wrapRef, show } = useGsapReveal({ ready: imageReady })

  const hasMedia = Boolean(imageLandscape ?? imagePortrait)
  const hasTitle = title.trim() !== ""

  const onImageSettled = useCallback(() => {
    requestAnimationFrame(() => {
      setImageReady(true)
    })
  }, [])

  if (!hasMedia && !hasTitle) {
    return null
  }

  return (
    <div
      ref={wrapRef}
      style={{ opacity: 0 }}
      className={cn(
        "relative isolate w-full overflow-hidden",
        "h-svh min-h-svh",
      )}
    >
      {hasMedia ? (
        <>
          <SanityImage
            landscape={imageLandscape}
            portrait={imagePortrait}
            locale={locale}
            landscapeParams={{
              width: 1920,
              height: 1080,
              sizes: "(min-width: 1px) 100vw",
            }}
            portraitParams={{
              width: 720,
              height: 1280,
              sizes: "(min-width: 1px) 100vw",
            }}
            fill
            priority
            altFallback={hasTitle ? title : undefined}
            className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover object-center"
            onLoad={onImageSettled}
            onError={onImageSettled}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-black/20"
          />
        </>
      ) : (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-20 bg-background"
        />
      )}

      {hasTitle ? (
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-end">
          <Container
            className={cn(
              "flex justify-start",
              "pb-12 lg:pb-16",
              "pointer-events-auto",
            )}
          >
            <TitleReveal
              title={title}
              tag="h1"
              show={show && (!hasMedia || imageReady)}
              className="max-w-[min(100%,42rem)]"
            />
          </Container>
        </div>
      ) : null}
    </div>
  )
}
