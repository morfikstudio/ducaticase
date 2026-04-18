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
  heroDesktop?: SanityImageSource | null
  heroMobile?: SanityImageSource | null
}

export function HeroText({
  text,
  locale,
  heroDesktop,
  heroMobile,
}: HeroTextProps) {
  const { ref: wrapRef } = useGsapReveal()

  const hasBg = Boolean(heroDesktop ?? heroMobile)

  return (
    <div
      ref={wrapRef}
      className="relative isolate h-screen min-h-svh w-full overflow-hidden"
      style={{ opacity: 0 }}
    >
      {hasBg ? (
        <>
          <SanityImage
            desktop={heroDesktop}
            mobile={heroMobile}
            locale={locale}
            desktopParams={{
              width: 2400,
              height: 1350,
              quality: 82,
              sizes: "100vw",
            }}
            mobileParams={{
              width: 1080,
              height: 1920,
              quality: 82,
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
                "type-heading-1 md:text-center text-primary",
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
