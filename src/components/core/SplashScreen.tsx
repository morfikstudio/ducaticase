"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Lottie, { LottieRefCurrentProps } from "lottie-react"
import gsap from "gsap"

import { cn } from "@/utils/classNames"
import { prefersReducedMotion } from "@/utils/reducedMotion"

import animationData from "@/lottie/splash.json"

export function SplashScreen() {
  const [loaded, setLoaded] = useState(false)
  const [lottieStarted, setLottieStarted] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  const lottieRef = useRef<LottieRefCurrentProps>(null)
  const lottieWrapRef = useRef<HTMLDivElement>(null)
  const topCurtainRef = useRef<HTMLDivElement>(null)
  const bottomCurtainRef = useRef<HTMLDivElement>(null)

  const onLoad = useCallback(() => {
    if (!loaded) {
      setLoaded(true)
    }
  }, [loaded])

  const onLottieStart = useCallback(() => {
    if (!lottieStarted) {
      setLottieStarted(true)
    }
  }, [lottieStarted])

  useEffect(() => {
    if (prefersReducedMotion()) {
      setDismissed(true)
      return
    }
  }, [])

  /* Handle animation */
  useEffect(() => {
    if (!lottieStarted || dismissed) return

    const lottieDuration = lottieRef.current?.getDuration() || 0
    const delay = lottieDuration - 0.25

    const ctx = gsap.context(() => {
      const top = topCurtainRef.current
      const bottom = bottomCurtainRef.current

      gsap.set([top, bottom], { clipPath: "inset(0% 0% 0% 0%)" })

      gsap
        .timeline({
          delay,
          onComplete: () => {
            setDismissed(true)
          },
        })
        .to(
          lottieWrapRef.current,
          {
            opacity: 0,
            duration: 0.05,
          },
          0,
        )
        .to(
          top,
          {
            clipPath: "inset(0% 0% 100% 0%)", // Top curtain open
            duration: 1,
            delay: 0.25,
            ease: "power2.out",
          },
          0,
        )
        .to(
          bottom,
          {
            clipPath: "inset(100% 0% 0% 0%)", // Bottom curtain open
            duration: 1,
            delay: 0.25,
            ease: "power2.out",
          },
          0,
        )
    })

    return () => {
      ctx.revert()
      if (lottieRef.current) {
        lottieRef.current?.destroy()
        lottieRef.current = null
      }
    }
  }, [lottieStarted, dismissed])

  if (dismissed) {
    return null
  }

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center">
      <div
        ref={topCurtainRef}
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-1/2 bg-[#080808]"
        style={{ clipPath: "inset(0% 0% 0% 0%)" }}
        aria-hidden
      />
      <div
        ref={bottomCurtainRef}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-1/2 bg-[#080808]"
        style={{ clipPath: "inset(0% 0% 0% 0%)" }}
        aria-hidden
      />
      <div
        ref={lottieWrapRef}
        className={cn(
          "relative z-10 w-full max-w-[150px] lg:max-w-[200px]",
          "transition-opacity duration-250",
          loaded ? "opacity-100" : "opacity-0",
        )}
      >
        <Lottie
          lottieRef={lottieRef}
          animationData={animationData}
          loop={false}
          onDOMLoaded={onLoad}
          onEnterFrame={onLottieStart}
        />
      </div>
    </div>
  )
}
