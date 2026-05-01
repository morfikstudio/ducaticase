"use client"

import React, { useCallback, useLayoutEffect, useRef, useState } from "react"

import type { AppLocale } from "@/i18n/routing"

import type { LocalizedPortableText } from "@/sanity/types"

import { useGsapReveal } from "@/hooks/useGsapReveal"
import { useAnimationKey } from "@/components/providers/LenisProvider"

import { cn } from "@/utils/classNames"

import { Container } from "@/components/ui/Container"
import { Button } from "@/components/ui/Button"
import { PortableTextComponent } from "@/components/ui/PortableText"

type StickyTextBlocksProps = {
  locale: AppLocale
  title: string
  subtitle?: LocalizedPortableText | null
  ctaLabel?: string
  ctaHref?: string
  items: Array<{
    key: string
    title: string
    text: LocalizedPortableText | null
  }> | null
  className?: string
}

type StickyTextItem = {
  key: string
  title: string
  text: LocalizedPortableText | null
}

type StickyTextSharedProps = {
  locale: AppLocale
  title: string
  subtitle?: LocalizedPortableText | null
  ctaLabel?: string
  ctaHref?: string
  items: StickyTextItem[]
  animationKey?: number
}

function StickyTextBlocksHeader({
  locale,
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  className,
}: {
  locale: AppLocale
  title: string
  subtitle?: LocalizedPortableText | null
  ctaLabel?: string
  ctaHref?: string
  className?: string
}) {
  return (
    <div className={className}>
      <h2
        className={cn(
          "type-heading-3 text-[24px] text-dark-gray",
          // "",
          "",
        )}
      >
        {title}
      </h2>

      <PortableTextComponent
        text={subtitle}
        locale={locale}
        className={cn(
          "mt-6",
          "type-body-1 text-[16px] tracking-[0.08em] font-medium uppercase text-dark-gray",
        )}
      />

      <Button
        href={ctaHref}
        variant="reverse"
        className="self-start mt-8 lg:mt-10"
      >
        {ctaLabel}
      </Button>
    </div>
  )
}

function StickyTextBlocksDesktop({
  locale,
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  items,
}: StickyTextSharedProps) {
  return (
    <div className="hidden lg:grid lg:grid-cols-12 lg:gap-x-4">
      <StickyTextBlocksHeader
        locale={locale}
        title={title}
        subtitle={subtitle}
        ctaLabel={ctaLabel}
        ctaHref={ctaHref}
        className="lg:col-span-4 lg:sticky lg:top-32 lg:self-start"
      />

      <div className="lg:col-start-7 lg:col-span-6">
        {items.map(({ key, title: itemTitle, text }, index) => (
          <React.Fragment key={key}>
            <div
              className={cn(
                "flex pb-6",
                "bg-primary border-b border-gray/50",
                index > 0 ? "mt-48" : "",
              )}
            >
              <h3 className="type-heading-1">{itemTitle}</h3>
            </div>

            <div className="flex items-baseline gap-16 pt-8">
              <span className="type-body-3 lg:type-body-2">
                ({String(index + 1).padStart(2, "0")})
              </span>

              <PortableTextComponent
                text={text}
                locale={locale}
                className="type-body-3"
              />
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

function StickyTextBlocksMobile({
  locale,
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  items,
  animationKey,
}: StickyTextSharedProps) {
  const [tops, setTops] = useState<number[]>([])
  const barRefs = useRef(new Map<string, HTMLDivElement>())
  const recomputeRef = useRef<(() => void) | null>(null)

  const setBarRef = useCallback(
    (key: string) => (el: HTMLDivElement | null) => {
      if (el) {
        barRefs.current.set(key, el)
      } else {
        barRefs.current.delete(key)
      }
    },
    [],
  )

  useLayoutEffect(() => {
    if (items.length === 0) {
      setTops([])
      recomputeRef.current = null
      return
    }

    const recompute = () => {
      let sum = 0
      const next: number[] = []

      for (let i = 0; i < items.length; i++) {
        next.push(sum)
        const el = barRefs.current.get(items[i].key)
        sum += el?.offsetHeight ?? 0
      }

      setTops((prev) => {
        if (
          prev.length === next.length &&
          prev.every((value, currentIndex) => value === next[currentIndex])
        ) {
          return prev
        }

        return next
      })

      if (process.env.NODE_ENV !== "production") {
        const firstBar = barRefs.current.get(items[0]?.key ?? "")
        console.debug("[StickyTextBlocksMobile] recompute", {
          locale,
          animationKey,
          scrollY: window.scrollY,
          firstBarOffsetHeight: firstBar?.offsetHeight ?? 0,
          tops: next,
        })
      }
    }

    recomputeRef.current = recompute
    recompute()
    const raf1 = requestAnimationFrame(() => {
      requestAnimationFrame(recompute)
    })

    const ro = new ResizeObserver(recompute)
    for (const { key } of items) {
      const el = barRefs.current.get(key)
      if (el) ro.observe(el)
    }

    return () => {
      cancelAnimationFrame(raf1)
      ro.disconnect()
    }
  }, [items, locale, animationKey])

  useLayoutEffect(() => {
    if (!recomputeRef.current) return
    const raf = requestAnimationFrame(() => {
      recomputeRef.current?.()
    })
    return () => cancelAnimationFrame(raf)
  }, [animationKey])

  return (
    <div className="flex flex-col gap-20 lg:hidden">
      <StickyTextBlocksHeader
        locale={locale}
        title={title}
        subtitle={subtitle}
        ctaLabel={ctaLabel}
        ctaHref={ctaHref}
        className="md:max-w-[500px]"
      />

      <div>
        {items.map(({ key, title: itemTitle, text }, index) => (
          <React.Fragment key={key}>
            <div
              ref={setBarRef(key)}
              className={cn(
                "sticky py-4 md:py-6",
                "flex items-baseline gap-3",
                "bg-primary border-b border-gray/50",
              )}
              style={{
                top: `${tops[index] ?? 0}px`,
                zIndex: items.length - index + 10,
              }}
            >
              <span className="type-body-3">
                ({String(index + 1).padStart(2, "0")})
              </span>

              <h3 className="type-body-1 max-md:text-[24px]">{itemTitle}</h3>
            </div>

            <div className="pt-6 pb-8">
              <PortableTextComponent
                text={text}
                locale={locale}
                className="type-body-3"
              />
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export function StickyTextBlocks({
  locale,
  title,
  subtitle,
  items,
  ctaLabel,
  ctaHref,
  className,
}: StickyTextBlocksProps) {
  const { ref: wrapRef } = useGsapReveal()
  const animationKey = useAnimationKey()

  if (!items || items.length === 0) return null

  return (
    <div
      className={cn(
        "w-full bg-primary text-accent",
        "py-20 lg:py-48",
        className,
      )}
    >
      <Container>
        <div
          className={cn("relative", "min-h-full")}
          ref={wrapRef}
          style={{ opacity: 0 }}
        >
          <StickyTextBlocksMobile
            locale={locale}
            title={title}
            subtitle={subtitle}
            ctaLabel={ctaLabel}
            ctaHref={ctaHref}
            items={items}
            animationKey={animationKey}
          />

          <StickyTextBlocksDesktop
            locale={locale}
            title={title}
            subtitle={subtitle}
            ctaLabel={ctaLabel}
            ctaHref={ctaHref}
            items={items}
          />
        </div>
      </Container>
    </div>
  )
}
