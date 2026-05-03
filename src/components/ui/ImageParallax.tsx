"use client"

import { useEffect, useRef, type ReactNode } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import { cn } from "@/utils/classNames"
import { prefersReducedMotion } from "@/utils/reducedMotion"

import { useLenis } from "@/components/providers/LenisProvider"

gsap.registerPlugin(ScrollTrigger)

export type ImageParallaxVariant = "default" | "prominent"

const VARIANT_Y_PERCENT: Record<ImageParallaxVariant, number> = {
  default: 16,
  prominent: 24,
}

const VARIANT_INNER_CLASS: Record<ImageParallaxVariant, string> = {
  default: "absolute inset-x-0 top-[-5%] h-[110%] will-change-transform",
  prominent:
    "absolute inset-x-0 top-[-7.5%] h-[115%] will-change-transform",
}

export type ImageParallaxProps = {
  variant?: ImageParallaxVariant
  className?: string
  children: ReactNode
}

export function ImageParallax({
  variant = "default",
  className,
  children,
}: ImageParallaxProps) {
  const cellRef = useRef<HTMLDivElement>(null)
  const parallaxRef = useRef<HTMLDivElement>(null)
  const lenis = useLenis()

  const yPercent = VARIANT_Y_PERCENT[variant]

  useEffect(() => {
    if (!lenis) return
    if (prefersReducedMotion()) return

    const cell = cellRef.current
    const parallax = parallaxRef.current
    if (!cell || !parallax) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        parallax,
        { yPercent: -yPercent },
        {
          yPercent,
          ease: "none",
          scrollTrigger: {
            trigger: cell,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      )
    }, cell)

    return () => ctx.revert()
  }, [variant, lenis])

  return (
    <div
      ref={cellRef}
      className={cn("relative overflow-hidden", className)}
    >
      <div ref={parallaxRef} className={VARIANT_INNER_CLASS[variant]}>
        {children}
      </div>
    </div>
  )
}
