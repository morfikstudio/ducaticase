"use client"

import type { RefObject } from "react"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import gsap from "gsap"

import { prefersReducedMotion } from "@/utils/reducedMotion"
import { useSplashContext } from "@/components/providers/SplashProvider"

export type UseGsapRevealOptions<T extends HTMLElement = HTMLDivElement> = {
  /**
   * When `false`, no GSAP styles or tweens run on the observed element; only
   * `load` / `show` (viewport) updates from IntersectionObserver.
   * `fallbackRevealMs` applies only to the reveal animation path.
   */
  animate?: boolean
  /**
   * Element to observe and optionally animate. Defaults to an internal ref
   * returned as `ref`. If the ref’s `.current` is still `null` on the first
   * effect run (e.g. conditional child), IntersectionObserver setup and the
   * initial `gsap.set` retry when `ready` becomes true (or stays default `true`).
   */
  elementRef?: RefObject<T | null>
  /**
   * External readiness gate. Animation fires only when both the element is in
   * view AND `ready` is true. Defaults to `true` so components that have no
   * async dependency can omit it entirely. Ignored when `animate` is `false`.
   * When `ready` is false on the first paint and later becomes true, viewport
   * observers and initial hide styling re-run so a lazily mounted node is observed.
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
   * (root margin −25% bottom). Never resets. Same semantics when `animate` is
   * `false` (viewport-only).
   */
  show: boolean
}

export function useGsapReveal<T extends HTMLElement = HTMLDivElement>(
  options?: UseGsapRevealOptions<T>,
): UseGsapRevealResult<T> {
  const {
    animate = true,
    elementRef: elementRefOption,
    ready = true,
    duration = 1,
    ease = "power2.out",
    fromY = 20,
    clearProps = "all",
    delay = 0.2,
    fallbackRevealMs,
  } = options ?? {}

  const { splashDone } = useSplashContext()

  const internalRef = useRef<T | null>(null)
  const targetRef = elementRefOption ?? internalRef

  // --- IntersectionObserver state (merged from useInView) ---
  const [load, setLoad] = useState(false)
  const [inViewShow, setInViewShow] = useState(false)

  useEffect(() => {
    const el = targetRef.current
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
  }, [targetRef, ready])

  // --- Fallback deadline (animation only) ---
  const [deadlineReveal, setDeadlineReveal] = useState(false)

  useEffect(() => {
    if (!animate || fallbackRevealMs == null) return
    const id = window.setTimeout(
      () => setDeadlineReveal(true),
      fallbackRevealMs,
    )
    return () => window.clearTimeout(id)
  }, [animate, fallbackRevealMs])

  // --- Initial hidden state ---
  useLayoutEffect(() => {
    if (!animate || !targetRef.current) return
    gsap.set(targetRef.current, { opacity: 0, y: fromY })
  }, [animate, fromY, targetRef, ready])

  // --- Entry animation ---
  useEffect(() => {
    if (!animate) return

    const shouldFire = ((inViewShow && ready) || deadlineReveal) && splashDone
    if (!targetRef.current || !shouldFire) return

    if (prefersReducedMotion()) {
      gsap.set(targetRef.current, { opacity: 1, y: 0 })
      return () => {
        gsap.killTweensOf(targetRef.current)
      }
    }

    gsap.to(targetRef.current, {
      opacity: 1,
      y: 0,
      duration,
      ease,
      clearProps,
      delay,
    })

    return () => {
      gsap.killTweensOf(targetRef.current)
    }
  }, [
    animate,
    inViewShow,
    ready,
    deadlineReveal,
    splashDone,
    duration,
    ease,
    clearProps,
    fromY,
    delay,
    targetRef,
  ])

  return { ref: targetRef, load, show: inViewShow && splashDone }
}
