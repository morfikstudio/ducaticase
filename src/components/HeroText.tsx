"use client"

import { useCallback, useState } from "react"
import type { SanityImageSource } from "@sanity/image-url/lib/types/types"

import type { AppLocale } from "@/i18n/routing"

import { useGsapReveal } from "@/hooks/useGsapReveal"

import { cn } from "@/utils/classNames"

import { Container } from "@/components/ui/Container"
import { SanityImage } from "@/components/ui/SanityImage"

type HeroTextProps = {
  text: string
  locale: AppLocale
  heroLandscape?: SanityImageSource | null
  heroPortrait?: SanityImageSource | null
}

export function HeroText({
  text,
  locale,
  heroLandscape,
  heroPortrait,
}: HeroTextProps) {
  const [imageReady, setImageReady] = useState(false)
  const { ref: wrapRef } = useGsapReveal({ ready: imageReady })

  const hasBg = Boolean(heroLandscape ?? heroPortrait)

  const onImageSettled = useCallback(() => {
    requestAnimationFrame(() => {
      setImageReady(true)
    })
  }, [])

  return (
    <div
      ref={wrapRef}
      className="relative isolate h-screen min-h-svh w-full overflow-hidden"
      style={{ opacity: 0 }}
    >
      {hasBg ? (
        <>
          <SanityImage
            landscape={heroLandscape}
            portrait={heroPortrait}
            locale={locale}
            landscapeParams={{
              width: 1920,
              height: 1080,
              sizes: "100vw",
            }}
            portraitParams={{
              width: 720,
              height: 1280,
              sizes: "100vw",
            }}
            fill
            priority
            className="pointer-events-none -z-20 object-cover object-center"
            onLoad={onImageSettled}
            onError={onImageSettled}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0.75) 0%, rgba(0,0,0,1) 100%)",
            }}
          />
        </>
      ) : null}

      {text ? (
        <div className="relative z-10 flex h-full w-full items-center justify-center px-4">
          <Container>
            <h1
              className={cn(
                "type-heading-2 max-md:text-[30px] md:text-center text-primary",
                "mx-auto md:max-w-[900px]",
              )}
            >
              {text}
            </h1>
          </Container>
        </div>
      ) : null}
    </div>
  )
}
