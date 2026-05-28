"use client"

import { useEffect, useState, type ReactNode } from "react"
import { createPortal } from "react-dom"

import { cn } from "@/utils/classNames"

export type ModalProps = {
  open: boolean
  onClose: () => void
  title: string
  children?: ReactNode
  className?: string
  /** Optional ARIA label override; defaults to `title`. */
  ariaLabel?: string
}

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
  ariaLabel,
}: ModalProps) {
  const [mounted, setMounted] = useState(false)
  const [entered, setEntered] = useState(false)

  /* PORTAL TARGET SAFE-GUARD FOR SSR */
  useEffect(() => {
    setMounted(true)
  }, [])

  /* ENTRANCE ANIMATION + ESCAPE + SCROLL LOCK */
  useEffect(() => {
    if (!open) {
      setEntered(false)
      return
    }

    const rafId = requestAnimationFrame(() => setEntered(true))

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  if (!mounted || !open) return null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel ?? title}
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4",
        "transition-opacity duration-300 ease-out",
        entered ? "opacity-100" : "opacity-0",
      )}
    >
      <button
        type="button"
        aria-label="Close"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-md"
      />
      <div
        className={cn(
          "relative z-10 w-full max-w-[760px] rounded-[4px] bg-black p-6 text-white md:p-12",
          "transition-transform duration-300 ease-out",
          entered ? "translate-y-0" : "translate-y-2",
          className,
        )}
      >
        <h2 className="type-heading-2 mb-4 text-center md:type-display-1">
          {title}
        </h2>
        {children}
      </div>
    </div>,
    document.body,
  )
}
