"use client"

import { useEffect, useRef, useState } from "react"

import { Link, usePathname, useRouter } from "@/i18n/navigation"
import type { AppLocale } from "@/i18n/routing"

import { cn } from "@/utils/classNames"

import { useLenis } from "@/components/providers/LenisProvider"
import { Container } from "@/components/ui/Container"
import { Logo } from "@/components/ui/Logo"

import type { MenuContent } from "@/lib/formatMenuContent"

import { NavDrawer } from "./NavDrawer"

const SCROLL_THRESHOLD = 5
const VELOCITY_THRESHOLD = 0.1

type NavBarProps = {
  locale: AppLocale
  menuContent: MenuContent
}

export default function NavBar({ locale, menuContent }: NavBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const lenis = useLenis()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (!lenis) return

    const onScroll = ({
      scroll,
      velocity,
    }: {
      scroll: number
      velocity: number
    }) => {
      const el = headerRef.current
      if (!el) return

      if (scroll <= SCROLL_THRESHOLD) {
        el.style.transform = ""
        el.style.background = ""
        el.style.backdropFilter = ""
        return
      }

      if (velocity > VELOCITY_THRESHOLD) {
        // Scrolling down — hide
        el.style.transform = "translateY(-100%)"
      } else if (velocity < -VELOCITY_THRESHOLD) {
        // Scrolling up — show with background
        el.style.transform = ""
        el.style.background = "rgba(24, 24, 24, 0.15)"
        el.style.backdropFilter = "blur(12px)"
      }
    }

    lenis.on("scroll", onScroll)
    return () => lenis.off("scroll", onScroll)
  }, [lenis])

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const otherLocale: AppLocale = locale === "it" ? "en" : "it"
  const otherLocaleLabel = otherLocale.toUpperCase()

  function switchLocale() {
    router.replace(pathname, { locale: otherLocale })
  }

  const HamburgerIcon = (
    <svg
      width="22"
      height="14"
      viewBox="0 0 22 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <line
        x1="0"
        y1="1"
        x2="22"
        y2="1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="0"
        y1="7"
        x2="22"
        y2="7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="0"
        y1="13"
        x2="22"
        y2="13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )

  return (
    <>
      <header
        ref={headerRef}
        className={cn("fixed top-0 left-0 right-0 z-40", "text-primary")}
        style={{
          transition:
            "transform 380ms cubic-bezier(0.25, 0.46, 0.45, 0.94), background 300ms ease-out, backdrop-filter 300ms ease-out",
          willChange: "transform",
        }}
      >
        <Container
          className={cn("h-16 md:h-[76px] max-w-auto", "flex items-center")}
        >
          {/* ── MOBILE layout ─────────────────────────────────── */}
          <div className="relative flex w-full items-center md:hidden">
            {/* Hamburger — left */}
            <button
              type="button"
              aria-label="Apri menu"
              onClick={() => setIsMenuOpen(true)}
              className="text-primary cursor-pointer shrink-0"
            >
              {HamburgerIcon}
            </button>

            {/* Logo */}
            <Link
              href="/"
              aria-label="Ducati Case — Home"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 inline-block w-[72px] text-primary [&_svg]:w-full [&_svg]:h-auto"
            >
              <Logo />
            </Link>

            {/* Language — right */}
            <button
              type="button"
              onClick={switchLocale}
              className={cn(
                "ml-auto shrink-0 type-button text-primary",
                "cursor-pointer transition-opacity hover:opacity-60",
              )}
            >
              {otherLocaleLabel}
            </button>
          </div>

          {/* ── DESKTOP layout ────────────────────────────────── */}
          <div className="relative hidden md:flex w-full items-center justify-between">
            {/* Logo — left */}
            <Link
              href="/"
              aria-label="Ducati Case — Home"
              className="relative z-10 inline-block w-[88px] shrink-0 text-primary [&_svg]:w-full [&_svg]:h-auto"
            >
              <Logo />
            </Link>

            {/* Tagline header */}
            {menuContent.headerTagline.trim() !== "" ? (
              <p
                className={cn(
                  "pointer-events-none absolute left-1/2 top-1/2 z-0 max-w-[min(28rem,calc(100vw-12rem))] -translate-x-1/2 -translate-y-1/2",
                  "text-center type-body-3 text-gray truncate px-2",
                )}
              >
                {menuContent.headerTagline}
              </p>
            ) : null}

            {/* Language + Hamburger — right */}
            <div className="relative z-10 flex shrink-0 items-center gap-6">
              <button
                type="button"
                onClick={switchLocale}
                className={cn(
                  "type-button text-primary",
                  "cursor-pointer transition-opacity hover:opacity-60",
                )}
              >
                {otherLocaleLabel}
              </button>

              <button
                type="button"
                aria-label="Apri menu"
                onClick={() => setIsMenuOpen(true)}
                className="text-primary cursor-pointer"
              >
                {HamburgerIcon}
              </button>
            </div>
          </div>
        </Container>
      </header>

      <NavDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        navLinks={menuContent.navLinks}
        socialLinks={menuContent.socialLinks}
        payoff={menuContent.payoff}
      />
    </>
  )
}
