"use client"

import { useRef, useEffect, useLayoutEffect, type ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"
import gsap from "gsap"

import { prefersReducedMotion } from "@/utils/reducedMotion"

const CLIP_HIDDEN = "inset(0% 0% 100% 0%)"
const CLIP_VISIBLE = "inset(0% 0% 0% 0%)"
const CLIP_GONE = "inset(100% 0% 0% 0%)"

function isInternalHref(href: string): boolean {
  return !(
    href.startsWith("http") ||
    href.startsWith("//") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("#")
  )
}

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()

  const isTransitioningRef = useRef(false)
  const pendingHrefRef = useRef<string | null>(null)
  const pathnameRef = useRef(pathname)

  /* Keep pathnameRef current without triggering re-renders */
  useEffect(() => {
    pathnameRef.current = pathname
  }, [pathname])

  /*
    1) Intercept internal link clicks
    2) Prevent default and stop propagation
    3) Fire overlay animation
    4) Push new page
  */
  useLayoutEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

      const anchor = (e.target as Element).closest<HTMLAnchorElement>("a[href]")

      if (!anchor) return
      if (anchor.target === "_blank") return

      const href = anchor.getAttribute("href")

      if (!href || !isInternalHref(href)) return
      if (href === pathnameRef.current) return
      if (isTransitioningRef.current) return

      e.preventDefault()
      e.stopPropagation()

      window.dispatchEvent(new CustomEvent("page-transition-start"))

      const overlay = overlayRef.current

      if (!overlay) {
        router.push(href)
        return
      }

      isTransitioningRef.current = true
      pendingHrefRef.current = href
      overlay.style.pointerEvents = "all"

      gsap.set(overlay, { display: "block", clipPath: CLIP_HIDDEN })
      gsap.to(overlay, {
        clipPath: CLIP_VISIBLE,
        duration: prefersReducedMotion() ? 0 : 1,
        ease: "power2.in",
        onComplete: () => {
          router.push(href)
        },
      })
    }

    document.addEventListener("click", handleClick, { capture: true })
    return () =>
      document.removeEventListener("click", handleClick, { capture: true })
  }, [router])

  /*
    1) Check if there is a pending href and if the transition is still happening
    2) Fire the reveal animation
    3) Reset overlay styles, pending href and isTransitioningRef state
  */
  useLayoutEffect(() => {
    if (!pendingHrefRef.current || !isTransitioningRef.current) return

    const overlay = overlayRef.current
    if (!overlay) return

    gsap.fromTo(
      overlay,
      { clipPath: CLIP_VISIBLE },
      {
        clipPath: CLIP_GONE,
        duration: prefersReducedMotion() ? 0 : 1,
        ease: "power2.out",
        delay: prefersReducedMotion() ? 0 : 0.25,
        onComplete: () => {
          overlay.style.pointerEvents = "none"
          pendingHrefRef.current = null
          isTransitioningRef.current = false
          gsap.set(overlay, { clipPath: CLIP_HIDDEN, display: "none" })
        },
      },
    )
  }, [pathname])

  return (
    <>
      {children}
      <div
        ref={overlayRef}
        aria-hidden
        className="hidden fixed inset-0 z-50 pointer-events-none bg-[#000]"
        style={{
          clipPath: CLIP_HIDDEN,
        }}
      />
    </>
  )
}
