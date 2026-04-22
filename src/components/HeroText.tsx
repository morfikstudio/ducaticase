"use client"

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
  const { ref: wrapRef } = useGsapReveal()

  const hasBg = Boolean(heroLandscape ?? heroPortrait)

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
              width: 2400,
              height: 1350,
              sizes: "100vw",
            }}
            portraitParams={{
              width: 1080,
              height: 1920,
              sizes: "100vw",
            }}
            fill
            priority
            className="pointer-events-none -z-20 object-cover object-center"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-black/40"
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
