"use client"

import { useEffect } from "react"

/**
 * Tracks active input modality on <html> so focus rings are shown only
 * when navigation comes from keyboard.
 */
export default function FocusVisibleModality() {
  useEffect(() => {
    const root = document.documentElement
    const setKeyboard = () =>
      root.setAttribute("data-input-modality", "keyboard")
    const setPointer = () => root.setAttribute("data-input-modality", "pointer")

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.altKey || event.ctrlKey) return
      setKeyboard()
    }

    const onPointerDown = () => setPointer()

    setKeyboard()
    window.addEventListener("keydown", onKeyDown, true)
    window.addEventListener("pointerdown", onPointerDown, true)

    return () => {
      window.removeEventListener("keydown", onKeyDown, true)
      window.removeEventListener("pointerdown", onPointerDown, true)
    }
  }, [])

  return null
}
