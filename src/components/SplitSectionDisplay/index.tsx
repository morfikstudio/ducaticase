"use client"

import { type ReactNode, useEffect, useRef } from "react"
import type { SanityImageSource } from "@sanity/image-url/lib/types/types"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import type { AppLocale } from "@/i18n/routing"

import { useLenis } from "@/components/providers/LenisProvider"
import type { PortableTextComponent } from "@/components/ui/PortableText"
import { SplitSection } from "./SplitSection"

gsap.registerPlugin(ScrollTrigger)

export type SplitSectionItem = {
  key: string
  title?: string
  subtitle?: string
  body?: Parameters<typeof PortableTextComponent>[0]["text"]
  locale: AppLocale
  imageLandscape?: SanityImageSource | null
  imagePortrait?: SanityImageSource | null
  reverse?: boolean
}

type Props = {
  items: SplitSectionItem[]
  lastSection?: ReactNode
}

export function SplitSectionDisplay({ items, lastSection }: Props) {
  const lenis = useLenis()

  const containerRef = useRef<HTMLDivElement>(null)
  const panelRefs = useRef<(HTMLDivElement | null)[]>([])

  const hasLastSection = !!lastSection
  const totalPanels = items.length + (hasLastSection ? 1 : 0)

  useEffect(() => {
    if (!lenis) return

    const container = containerRef.current
    if (!container || totalPanels < 2) return

    const panels = panelRefs.current.filter(
      (p): p is HTMLDivElement => p !== null,
    )
    if (panels.length < 2) return

    const transitionCount = totalPanels - 1
    const pauseCount = totalPanels - 1
    // 0.5 = half a viewport of scroll where the incoming panel is visible but still.
    const pauseFraction = 0.25

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () =>
            `+=${container.offsetHeight * (transitionCount + pauseCount * pauseFraction)}`,
          pin: true,
          pinSpacing: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      })

      const panelHeight = () => -container.offsetHeight

      panels.forEach((panel, i) => {
        // Last panel doesn't move.
        if (i === panels.length - 1) return
        // Move panel above the container
        tl.to(panel, { y: panelHeight, ease: "none", duration: 1 })
        // After every transition, hold for pauseFraction scroll units and fade out so shadow is not visible
        tl.to(panel, { opacity: 0, duration: pauseFraction })
      })
    }, container)

    return () => ctx.revert()
  }, [lenis, totalPanels])

  if (totalPanels === 0) return null

  if (totalPanels === 1) {
    const item = items[0]!
    return (
      <SplitSection
        title={item.title}
        subtitle={item.subtitle}
        body={item.body}
        locale={item.locale}
        imageLandscape={item.imageLandscape}
        imagePortrait={item.imagePortrait}
        reverse={item.reverse}
      />
    )
  }

  return (
    <div ref={containerRef} className="relative h-lvh overflow-hidden">
      {items.map((item, i) => (
        <div
          key={item.key}
          ref={(el) => {
            panelRefs.current[i] = el
          }}
          className="absolute inset-0 h-lvh w-full shadow-[0_55px_95px_-10px_rgba(0,0,0,0.2)]"
          style={{ zIndex: items.length - i + (hasLastSection ? 1 : 0) }}
        >
          <SplitSection
            title={item.title}
            subtitle={item.subtitle}
            body={item.body}
            locale={item.locale}
            imageLandscape={item.imageLandscape}
            imagePortrait={item.imagePortrait}
            reverse={item.reverse}
          />
        </div>
      ))}
      {hasLastSection && (
        <div
          ref={(el) => {
            panelRefs.current[items.length] = el
          }}
          className="absolute inset-0 h-lvh w-full shadow-[0_55px_95px_-10px_rgba(0,0,0,0.2)]"
          style={{ zIndex: 0 }}
        >
          {lastSection}
        </div>
      )}
    </div>
  )
}
