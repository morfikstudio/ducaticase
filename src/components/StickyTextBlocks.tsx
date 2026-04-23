"use client"

import React, { useCallback, useLayoutEffect, useRef, useState } from "react"

import type { AppLocale } from "@/i18n/routing"

import type { LocalizedPortableText } from "@/sanity/types"

import { useGsapReveal } from "@/hooks/useGsapReveal"

import { cn } from "@/utils/classNames"

import { Container } from "@/components/ui/Container"
import { Button } from "@/components/ui/Button"
import { PortableTextComponent } from "@/components/ui/PortableText"

type StickyTextBlocksProps = {
  locale: AppLocale
  title: string
  subtitle?: string
  ctaLabel?: string
  ctaHref?: string
  items: Array<{
    key: string
    title: string
    text: LocalizedPortableText | null
  }> | null
  className?: string
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

  const [tops, setTops] = useState<number[]>([]) // top position of each item
  const barRefs = useRef(new Map<string, HTMLDivElement>())

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
    if (items?.length === 0) {
      setTops([])
      return
    }

    const recompute = () => {
      if (!items) return

      let sum = 0
      const next: number[] = []

      // calculate the top position of each item
      for (let i = 0; i < items.length; i++) {
        next.push(sum)
        const el = barRefs.current.get(items[i].key)
        sum += el?.offsetHeight ?? 0
      }

      // update the top position of each item
      setTops((prev) => {
        if (
          prev.length === next.length &&
          prev.every((v, j) => v === next[j])
        ) {
          return prev
        }

        return next
      })
    }

    recompute()

    const ro = new ResizeObserver(recompute)

    for (const { key } of items ?? []) {
      const el = barRefs.current.get(key)
      if (el) ro.observe(el)
    }

    return () => ro.disconnect()
  }, [items, locale])

  if (items?.length === 0) return null

  return (
    <div
      className={cn(
        "w-full bg-primary text-accent",
        "py-20 lg:py-32",
        className,
      )}
    >
      <Container>
        <div
          className={cn(
            "relative",
            "flex flex-col gap-20",
            "lg:grid lg:grid-cols-12 lg:gap-x-4",
          )}
          ref={wrapRef}
          style={{ opacity: 0 }}
        >
          <div className="md:max-w-[500px] lg:max-w-none lg:col-span-4">
            <h2
              className={cn(
                "type-heading-3 text-[24px] text-dark-gray",
                // "",
                "",
              )}
            >
              {title}
            </h2>

            <p
              className={cn(
                "mt-6",
                "type-body-1 text-[16px] tracking-[0.08em] font-medium uppercase text-dark-gray",
                // "",
                "",
              )}
            >
              {subtitle}
            </p>

            <Button
              href={ctaHref}
              variant="reverse"
              className="self-start mt-8 lg:mt-10"
            >
              {ctaLabel}
            </Button>
          </div>

          <div className="lg:col-start-7 lg:col-span-6">
            {items?.map(({ key, title: itemTitle, text }, index) => (
              <React.Fragment key={key}>
                <div
                  ref={setBarRef(key)}
                  className={cn(
                    "sticky py-4 md:py-6 lg:py-8",
                    "flex items-baseline gap-3",
                    "bg-primary border-b border-gray/50",
                  )}
                  style={{
                    top: `${tops[index] ?? 0}px`,
                    zIndex: items.length - index + 10,
                  }}
                >
                  <span className="type-body-3 lg:type-body-2">
                    ({String(index + 1).padStart(2, "0")})
                  </span>

                  <h3 className="type-body-1 max-md:text-[24px]">
                    {itemTitle}
                  </h3>
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
      </Container>
    </div>
  )
}
