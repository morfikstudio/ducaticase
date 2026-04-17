"use client"

import type { RefObject } from "react"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import gsap from "gsap"

import { prefersReducedMotion } from "@/utils/reducedMotion"

export type UseGsapRevealOptions = {
  /**
   * External readiness gate. Animation fires only when both the element is in
   * view AND `ready` is true. Defaults to `true` so components that have no
   * async dependency can omit it entirely.
   */
  ready?: boolean
  duration?: number
  ease?: string
  fromY?: number
  clearProps?: string | false
  /** Force-reveal after this many ms, even if `ready` never becomes true. */
  fallbackRevealMs?: number
  delay?: number
}

export type UseGsapRevealResult<T extends HTMLElement = HTMLDivElement> = {
  ref: RefObject<T | null>
  /** True once the element is within one viewport-height of the visible area. Never resets. */
  load: boolean
  /**
   * True once the reveal should run: at load, if the element intersects the
   * full viewport; after load, when it intersects the scroll reveal zone
   * (root margin −25% bottom). Never resets.
   */
  show: boolean
}

export function useGsapReveal<T extends HTMLElement = HTMLDivElement>(
  options?: UseGsapRevealOptions,
): UseGsapRevealResult<T> {
  const {
    ready = true,
    duration = 1,
    ease = "power2.out",
    fromY = 20,
    clearProps = "all",
    delay = 0,
    fallbackRevealMs,
  } = options ?? {}

  const ref = useRef<T | null>(null)

  // --- IntersectionObserver state (merged from useInView) ---
  const [load, setLoad] = useState(false)
  const [inViewShow, setInViewShow] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const vh = window.innerHeight
    const marginPx = vh

    const loadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setLoad(true)
          loadObserver.disconnect()
        }
      },
      { rootMargin: `${marginPx}px 0px`, threshold: 0 },
    )

    const showObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInViewShow(true)
          showObserver.disconnect()
        }
      },
      { rootMargin: "0px 0px -25% 0px", threshold: 0 },
    )

    loadObserver.observe(el)
    showObserver.observe(el)

    /** Synchronous check: IO fires async and can miss the first paint. For
     * `show`, treat "already on screen at load" as any overlap with the full
     * viewport — not the scroll reveal band (−25% bottom), which only applies
     * once the user scrolls elements in from outside the viewport.
     */
    const rect = el.getBoundingClientRect()
    const intersectsFullViewport = rect.bottom > 0 && rect.top < vh
    if (rect.top < vh + marginPx) setLoad(true)
    if (intersectsFullViewport) setInViewShow(true)

    return () => {
      loadObserver.disconnect()
      showObserver.disconnect()
    }
  }, [])

  // --- Fallback deadline ---
  const [deadlineReveal, setDeadlineReveal] = useState(false)

  useEffect(() => {
    if (fallbackRevealMs == null) return
    const id = window.setTimeout(
      () => setDeadlineReveal(true),
      fallbackRevealMs,
    )
    return () => clearTimeout(id)
  }, [fallbackRevealMs])

  // --- Initial hidden state ---
  useLayoutEffect(() => {
    if (!ref.current) return
    gsap.set(ref.current, { opacity: 0, y: fromY })
  }, [fromY])

  // --- Entry animation ---
  useEffect(() => {
    const shouldFire = (inViewShow && ready) || deadlineReveal
    if (!ref.current || !shouldFire) return

    if (prefersReducedMotion()) {
      gsap.set(ref.current, { opacity: 1, y: 0 })
      return () => {
        gsap.killTweensOf(ref.current)
      }
    }

    gsap.to(ref.current, {
      opacity: 1,
      y: 0,
      duration,
      ease,
      clearProps,
      delay,
    })

    return () => {
      gsap.killTweensOf(ref.current)
    }
  }, [
    inViewShow,
    ready,
    deadlineReveal,
    duration,
    ease,
    clearProps,
    fromY,
    delay,
  ])

  return { ref, load, show: inViewShow }
}
