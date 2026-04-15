"use client"

import { useEffect, useRef, useState, type RefObject } from "react"

export type UseInViewReturn = {
  ref: RefObject<HTMLElement | null>
  /** True once the element is within one viewport-height of the visible area. Never resets. */
  load: boolean
  /** True once the top of the element has crossed the 75% mark of the viewport height. Never resets. */
  show: boolean
}

export function useInView(): UseInViewReturn {
  const ref = useRef<HTMLElement | null>(null)
  const [load, setLoad] = useState(false)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const vh = window.innerHeight
    const marginPx = vh
    const loadRootMargin = `${marginPx}px 0px`

    const loadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setLoad(true)
          loadObserver.disconnect()
        }
      },
      { rootMargin: loadRootMargin, threshold: 0 },
    )

    const showObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShow(true)
          showObserver.disconnect()
        }
      },
      { rootMargin: "0px 0px -25% 0px", threshold: 0 },
    )

    loadObserver.observe(el)
    showObserver.observe(el)

    // Synchronous check for elements already in viewport at load time,
    // since IntersectionObserver fires asynchronously and may miss the
    // initial state in SSR/hydration scenarios.
    const rect = el.getBoundingClientRect()
    if (rect.top < vh + marginPx) setLoad(true)
    if (rect.top < vh * 0.75) setShow(true)

    return () => {
      loadObserver.disconnect()
      showObserver.disconnect()
    }
  }, [])

  return { ref, load, show }
}
