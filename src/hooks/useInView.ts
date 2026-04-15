"use client"

import { useEffect, useRef, useState, type RefObject } from "react"

export type UseInViewOptions = {
  /**
   * Extra margin (in px) added below and above the viewport for the load observer.
   * Equivalent to "100vh" but expressed in pixels so IntersectionObserver accepts it.
   * Default: window.innerHeight at the time the observer is created.
   */
  loadMarginPx?: number
  /** Visibility threshold for the show observer. Default: 0.1 */
  showThreshold?: number
  /** Optional scroll container. Default: browser viewport */
  root?: Element | null
}

export type UseInViewReturn = {
  /** Attach to the element you want to observe. */
  ref: RefObject<HTMLElement | null>
  /** True once the element is within `loadRootMargin` of the viewport. Never resets. */
  load: boolean
  /** True once at least `showThreshold` of the element is visible. Never resets. */
  show: boolean
}

const DEFAULT_SHOW_THRESHOLD = 0.5

export function useInView(options?: UseInViewOptions): UseInViewReturn {
  const {
    loadMarginPx,
    showThreshold = DEFAULT_SHOW_THRESHOLD,
    root = null,
  } = options ?? {}

  const ref = useRef<HTMLElement | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [load, setLoad] = useState(false)
  const [show, setShow] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) {
      return
    }

    const el = ref.current
    if (!el) {
      return
    }

    // IntersectionObserver only accepts px/% — resolve the load margin at runtime.
    const marginPx = loadMarginPx ?? window.innerHeight
    const loadRootMargin = `${marginPx}px 0px`

    const loadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setLoad(true)
          loadObserver.disconnect()
        }
      },
      { root, rootMargin: loadRootMargin, threshold: 0 },
    )

    const showObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShow(true)
          showObserver.disconnect()
        }
      },
      { root, rootMargin: "0px", threshold: showThreshold },
    )

    loadObserver.observe(el)
    showObserver.observe(el)

    return () => {
      loadObserver.disconnect()
      showObserver.disconnect()
    }
  }, [isMounted, root, loadMarginPx, showThreshold])

  return { ref, load, show }
}
