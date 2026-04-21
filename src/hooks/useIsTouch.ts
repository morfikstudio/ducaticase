"use client"

import { useLayoutEffect, useState } from "react"

export function useIsTouch() {
  const [isTouch, setIsTouch] = useState(false)

  useLayoutEffect(() => {
    const check = () => {
      setIsTouch(
        typeof window !== "undefined" &&
          ("ontouchstart" in window || navigator.maxTouchPoints > 0),
      )
    }

    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])
  return isTouch
}
