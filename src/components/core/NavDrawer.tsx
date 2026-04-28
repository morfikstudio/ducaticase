"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"

import { Link } from "@/i18n/navigation"

import type { MenuNavLink, MenuSocialLink } from "@/lib/formatMenuContent"
import { cn } from "@/utils/classNames"

import { useLenis } from "@/components/providers/LenisProvider"

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

const CLOSE_ANIMATION_MS = 520

function getFocusableElements(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter((el) => el.getAttribute("aria-hidden") !== "true")
}

type NavDrawerProps = {
  isOpen: boolean
  onClose: () => void
  onExited?: () => void
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
  onExited,
  navLinks,
  socialLinks,
  payoff,
}: NavDrawerProps) {
  const [isVisible, setIsVisible] = useState(false)

  const dialogContainerRef = useRef<HTMLDivElement>(null)
  const drawerContentRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const animationCtxRef = useRef<gsap.Context | null>(null)

  const lenis = useLenis()

  // Toggle visibility and keep the drawer mounted until close animation ends.
  useEffect(() => {
    if (isOpen) {
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsVisible(true))
      })

      return () => cancelAnimationFrame(raf)
    } else {
      setIsVisible(false)

      const timer = setTimeout(() => {
        onExited?.()
      }, CLOSE_ANIMATION_MS)

      return () => clearTimeout(timer)
    }
  }, [isOpen, onExited])

  // Pause Lenis scrolling while the drawer is open.
  useEffect(() => {
    if (!lenis || !isOpen) return
    lenis.stop()
    return () => {
      lenis.start()
    }
  }, [lenis, isOpen])

  // Move focus to the close button once the drawer is visible.
  useEffect(() => {
    if (!isOpen || !isVisible) return

    const raf = requestAnimationFrame(() => {
      closeButtonRef.current?.focus()
    })

    return () => cancelAnimationFrame(raf)
  }, [isOpen, isVisible])

  // Keep keyboard focus trapped inside the drawer layer.
  useEffect(() => {
    if (!isOpen) return
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
  }, [isOpen])

  // Close the drawer when pressing Escape.
  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [isOpen, onClose])

  // Animate drawer content items on open with responsive direction.
  useEffect(() => {
    if (!isOpen || !isVisible) return

    const scope = drawerContentRef.current
    if (!scope) return

    animationCtxRef.current?.revert()
    animationCtxRef.current = null

    const ctx = gsap.context(() => {
      const navItems = gsap.utils.toArray<HTMLElement>("[data-drawer-nav-item]")
      const socialItems = gsap.utils.toArray<HTMLElement>(
        "[data-drawer-social-item]",
      )
      const payoff = gsap.utils.toArray<HTMLElement>("[data-drawer-payoff]")

      const targets = [...navItems, ...socialItems, ...payoff].filter(Boolean)
      if (targets.length === 0) return

      const mm = gsap.matchMedia()

      mm.add(
        {
          desktop: "(min-width: 768px)",
          mobile: "(max-width: 767px)",
        },
        (context) => {
          const fromX = context.conditions?.desktop ? 32 : -32

          gsap.set(targets, {
            opacity: 0,
            x: fromX,
          })

          const tl = gsap.timeline({
            defaults: { overwrite: "auto" },
            delay: 0.25,
          })

          tl.to(targets, {
            opacity: 1,
            x: 0,
            duration: 0.9,
            stagger: 0.035,
            ease: "power2.out",
          })
        },
      )

      return () => mm.revert()
    }, scope)

    animationCtxRef.current = ctx
  }, [isOpen, isVisible])

  // revert GSAP context only on unmount
  useEffect(() => {
    return () => {
      animationCtxRef.current?.revert()
      animationCtxRef.current = null
    }
  }, [])

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
          ref={drawerContentRef}
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
                  <span data-drawer-nav-item className="block w-fit">
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
                  </span>
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
                    <span data-drawer-social-item className="inline-block">
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
                    </span>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Payoff */}
            <div data-drawer-payoff>
              <p className="mt-6 type-body-3 text-dark-gray">
                {payoff.split("\n").map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}
