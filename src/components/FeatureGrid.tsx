"use client"

import type { SanityImageSource } from "@sanity/image-url/lib/types/types"

import type { AppLocale } from "@/i18n/routing"
import { useGsapReveal } from "@/hooks/useGsapReveal"

import { cn } from "@/utils/classNames"

import { Container } from "@/components/ui/Container"
import { SanityImage } from "@/components/ui/SanityImage"

export type FeatureGridItem = {
  _key: string
  title: string
  text: string
  image: SanityImageSource
}

type FeatureGridProps = {
  heading: string
  items: FeatureGridItem[]
  locale: AppLocale
}

export function FeatureGrid({ heading, locale, items }: FeatureGridProps) {
  const { ref: wrapRef } = useGsapReveal()

  return (
    <div
      className={cn(
        "relative w-full text-primary",
        "pt-20",
        "md:pt-32 md:pb-20",
        "lg:pt-64 md:pb-64",
      )}
    >
      <div ref={wrapRef}>
        <Container>
          <h3
            className={cn(
              "type-heading-3 text-gray",
              "mx-auto max-md:text-center",
            )}
          >
            {heading}
          </h3>

          <ul
            className={cn(
              "mt-8 grid grid-cols-1 items-stretch gap-4",
              "md:mt-10 md:grid-cols-2 md:gap-6",
            )}
          >
            {items.map((item) => (
              <li key={item._key} className="h-full min-h-0">
                <FeatureCard
                  title={item.title}
                  text={item.text}
                  image={item.image}
                  locale={locale}
                />
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </div>
  )
}

type FeatureCardProps = {
  title: string
  text: string
  image: SanityImageSource
  locale: AppLocale
}

function FeatureCard({ title, text, image, locale }: FeatureCardProps) {
  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col rounded-none bg-primary text-left",
        "px-6 pb-8 pt-10 md:rounded-[6px] md:px-8 md:pb-10 md:pt-12",
      )}
    >
      <div className="type-heading-2 text-accent shrink-0 md:max-w-[300px]">
        {title}
      </div>

      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col pt-5",
          "md:justify-end md:pt-24",
        )}
      >
        <div
          className={cn(
            "flex flex-col gap-6",
            "md:grid md:grid-cols-2 md:items-end md:gap-8",
          )}
        >
          <p className={cn("type-body-2 text-accent", "max-md:mt-6")}>{text}</p>
          <div
            className={cn(
              "relative w-full min-h-0 overflow-hidden",
              "aspect-327/146",
              "max-md:mt-auto",
              "md:aspect-244/146",
            )}
          >
            <SanityImage
              landscape={image}
              portrait={image}
              locale={locale}
              altFallback={title}
              landscapeParams={{
                width: 244,
                height: 146,
                sizes: "(max-width: 767px) 100vw, min(42%, 244px)",
              }}
              portraitParams={{
                width: 327,
                height: 146,
                sizes: "(max-width: 767px) 100vw",
              }}
              fill
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
