"use client"

import { useEffect, useRef, useState } from "react"

import { Link } from "@/i18n/navigation"

import type { MenuNavLink, MenuSocialLink } from "@/lib/formatMenuContent"
import { cn } from "@/utils/classNames"

import { useLenis } from "@/components/providers/LenisProvider"

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function getFocusableElements(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter((el) => el.getAttribute("aria-hidden") !== "true")
}

type NavDrawerProps = {
  isOpen: boolean
  onClose: () => void
  navLinks: MenuNavLink[]
  socialLinks: MenuSocialLink[]
  payoff: string
}

function ExternalLinkIcon() {
  return (
    <svg
      className="inline-block shrink-0"
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M1 9L9 1M9 1H3M9 1V7"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function NavDrawer({
  isOpen,
  onClose,
  navLinks,
  socialLinks,
  payoff,
}: NavDrawerProps) {
  const [shouldRender, setShouldRender] = useState(isOpen)
  const [isVisible, setIsVisible] = useState(false)
  const dialogContainerRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const lenis = useLenis()

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsVisible(true))
      })
      return () => cancelAnimationFrame(raf)
    } else {
      setIsVisible(false)
      const timer = setTimeout(() => setShouldRender(false), 320)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  useEffect(() => {
    if (!lenis || !isOpen) return
    lenis.stop()
    return () => {
      lenis.start()
    }
  }, [lenis, isOpen])

  // Move focus to close control when the drawer is visible
  useEffect(() => {
    if (!isOpen || !isVisible) return
    const raf = requestAnimationFrame(() => {
      closeButtonRef.current?.focus()
    })
    return () => cancelAnimationFrame(raf)
  }, [isOpen, isVisible])

  // Keep Tab / Shift+Tab inside the modal layer (overlay + panel)
  useEffect(() => {
    if (!isOpen || !shouldRender) return
    const container = dialogContainerRef.current
    if (!container) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return

      const focusables = getFocusableElements(container)
      if (focusables.length === 0) return

      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement as HTMLElement | null

      if (!container.contains(active)) {
        e.preventDefault()
        first.focus()
        return
      }

      if (e.shiftKey) {
        if (active === first) {
          e.preventDefault()
          last.focus()
        }
      } else if (active === last) {
        e.preventDefault()
        first.focus()
      }
    }

    container.addEventListener("keydown", onKeyDown)
    return () => container.removeEventListener("keydown", onKeyDown)
  }, [isOpen, shouldRender])

  // Escape closes the drawer (parent restores focus)
  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [isOpen, onClose])

  if (!shouldRender) return null

  return (
    <div
      ref={dialogContainerRef}
      className="fixed inset-0 z-50 pointer-events-none"
    >
      {/* Overlay */}
      <button
        type="button"
        aria-label="Chiudi menu"
        className={cn(
          "absolute inset-0",
          "bg-black/60 pointer-events-auto",
          "transition-opacity duration-300 ease-out",
          isVisible ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Menu di navigazione"
        className={cn(
          "absolute top-0 z-10",
          "left-0 md:left-auto md:right-0",
          "h-full w-full max-w-[580px]",
          "flex flex-col",
          "pointer-events-auto overflow-hidden",
          "bg-dark text-primary shadow-2xl",
          "transition-transform duration-500 ease-in-out",
          isVisible ? "translate-x-0" : "-translate-x-full md:translate-x-full",
        )}
      >
        {/* Close button */}
        <button
          ref={closeButtonRef}
          type="button"
          className="absolute right-6 top-6 text-primary cursor-pointer z-10"
          aria-label="Chiudi menu"
          onClick={onClose}
        >
          <svg
            aria-hidden="true"
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1L14 14M14 1L1 14"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Scrollable content */}
        <div
          data-lenis-prevent
          className={cn(
            "relative px-8 md:px-14 py-16",
            "flex flex-1 flex-col justify-between",
            "min-h-0 overflow-y-auto overscroll-contain touch-pan-y",
            "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
          )}
        >
          {/* Nav links */}
          <nav aria-label="Navigazione principale">
            <ul className="flex flex-col gap-1">
              {navLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onClose}
                    className={cn(
                      "relative block w-fit py-2",
                      "font-sans text-[32px] md:text-[36px] text-primary transition-opacity duration-200 hover:opacity-75",
                      "after:absolute after:bottom-[0.1em] after:left-0 after:h-px after:w-full after:bg-current after:content-['']",
                      "after:origin-right after:scale-x-0 after:transition-transform after:duration-500 after:ease-in-out",
                      "hover:after:origin-left hover:after:scale-x-100",
                    )}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Bottom section */}
          <div className="mt-12">
            {/* Social links */}
            <nav aria-label="Social media">
              <ul className="flex flex-col gap-1.5">
                {socialLinks.map(({ label, href }, index) => (
                  <li key={`${href}-${index}`}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "group inline-flex items-center gap-1.5",
                        "type-body-3 text-primary",
                        "hover:underline underline-offset-4",
                      )}
                    >
                      <span>{label}</span>
                      <span
                        className={cn(
                          "inline-block origin-center",
                          "transition-transform duration-300 ease-out",
                          "group-hover:rotate-45",
                        )}
                        aria-hidden
                      >
                        <ExternalLinkIcon />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Payoff */}
            <p className="mt-6 type-body-3 text-dark-gray">
              {payoff.split("\n").map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </p>
          </div>
        </div>
      </aside>
    </div>
  )
}
