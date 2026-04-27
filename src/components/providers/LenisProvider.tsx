"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

import { prefersReducedMotion } from "@/utils/reducedMotion"

type LenisContextType = {
  lenis: Lenis | null
  animationKey: number
}
import { usePathname } from "next/navigation"
import Lenis from "lenis"
import type { LenisOptions } from "lenis"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const LenisContext = createContext<LenisContextType>({
  lenis: null,
  animationKey: 0,
})

const defaultEasing = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))

function getLenisOptions(): LenisOptions {
  const rm = prefersReducedMotion()

  return {
    autoRaf: false,
    duration: rm ? 0 : 0.5,
    easing: defaultEasing,
    syncTouch: false,
    anchors: true,
    smoothWheel: !rm,
  }
}

export function LenisProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const [animationKey, setAnimationKey] = useState(0)
  const pathname = usePathname()

  /* Create lenis instance and wire GSAP ticker */
  useEffect(() => {
    const lenisInstance = new Lenis(getLenisOptions())

    const rafHandler = (time: number) => lenisInstance.raf(time * 1000)

    gsap.ticker.add(rafHandler)
    gsap.ticker.lagSmoothing(0)
    lenisInstance.on("scroll", ScrollTrigger.update)

    setLenis(lenisInstance)

    return () => {
      gsap.ticker.remove(rafHandler)
      lenisInstance.destroy()
      setLenis(null)
    }
  }, [])

  /* Refresh ScrollTrigger after all resources (images, fonts) are loaded. */
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()

    if (document.readyState === "complete") {
      requestAnimationFrame(refresh)
      return
    }

    window.addEventListener("load", refresh, { once: true })
    return () => {
      window.removeEventListener("load", refresh)
    }
  }, [])

  /* On route change:
   * scroll to top,
   * then refresh ScrollTrigger once fonts settle.
   */
  useEffect(() => {
    if (!lenis) return

    const resetToTop = () => lenis.scrollTo(0, { immediate: true, force: true })
    resetToTop()

    // A second reset on next frames avoids occasional stale scroll position
    // during client-side transitions before sticky sections mount.
    const raf1 = requestAnimationFrame(() => {
      resetToTop()
      requestAnimationFrame(resetToTop)
    })

    let cancelled = false

    const refresh = () =>
      requestAnimationFrame(() => {
        if (!cancelled) {
          ScrollTrigger.refresh()
          setAnimationKey((k) => k + 1)
        }
      })

    if (document.fonts?.ready) {
      document.fonts.ready.then(refresh).catch(refresh)
    } else {
      refresh()
    }

    return () => {
      cancelled = true
      cancelAnimationFrame(raf1)
    }
  }, [lenis, pathname])

  return (
    <LenisContext.Provider value={{ lenis, animationKey }}>
      {children}
    </LenisContext.Provider>
  )
}

export function useLenis(): Lenis | null {
  return useContext(LenisContext).lenis
}

export function useAnimationKey(): number {
  return useContext(LenisContext).animationKey
}
