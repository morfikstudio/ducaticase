"use client"

import { useCallback, useLayoutEffect, useMemo, useRef } from "react"
import { Link } from "@/i18n/navigation"
import gsap from "gsap"
import { SplitText } from "gsap/SplitText"

import { useIsTouch } from "@/hooks/useIsTouch"
import { useGsapReveal } from "@/hooks/useGsapReveal"

import { cn } from "@/utils/classNames"

import { Container } from "@/components/ui/Container"

gsap.registerPlugin(SplitText)

export type WaveTextProps = {
  word1: string
  word2: string
  href: string
}

type State = {
  isHover: boolean
  split1: InstanceType<typeof SplitText> | null
  split2: InstanceType<typeof SplitText> | null
  tl: gsap.core.Timeline | null
  w1: number
  w2: number
}

export function WaveText({ word1, word2, href }: WaveTextProps) {
  const isTouch = useIsTouch()
  const { ref: wrapRef } = useGsapReveal()

  const row1Ref = useRef<HTMLDivElement>(null)
  const row2Ref = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)

  const state = useRef<State>({
    tl: null,
    isHover: false,
    split1: null,
    split2: null,
    w1: 0,
    w2: 0,
  })

  const { trimmed1, trimmed2, hasBothWords, singleDisplay } = useMemo(() => {
    const t1 = word1.trim()
    const t2 = word2.trim()

    return {
      trimmed1: t1,
      trimmed2: t2,
      hasBothWords: Boolean(t1 && t2),
      singleDisplay: t1 || t2,
    }
  }, [word1, word2])

  const onEnter = useCallback(() => {
    const s = state.current

    if (s.isHover || !s.split1 || !s.split2 || !lineRef.current) return

    s.isHover = true
    s.tl?.kill()

    const { split1, split2, w2 } = s

    const tl = gsap.timeline()
    s.tl = tl

    tl.to(split1.chars, {
      y: "-101%",
      duration: 0.2,
      ease: "power1.in",
      stagger: 0.0075,
    })
      .to(
        split2.chars,
        {
          y: "0%",
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.0075,
        },
        0,
      )
      .to(
        lineRef.current,
        {
          width: w2,
          duration: 0.6,
          ease: "power2.out",
        },
        0,
      )
  }, [])

  const onLeave = useCallback(() => {
    const s = state.current

    if (!s.split1 || !s.split2 || !lineRef.current) return

    s.isHover = false
    s.tl?.kill()

    const { split1, split2, w1 } = s

    const tl = gsap.timeline()
    s.tl = tl

    tl.to(
      split2.chars,
      {
        y: "101%",
        duration: 0.2,
        ease: "power1.in",
        stagger: 0.0075,
      },
      0,
    )
      .to(
        split1.chars,
        {
          y: "0%",
          duration: 0.4,
          ease: "power2.out",
          stagger: 0.0075,
        },
        0,
      )
      .to(
        lineRef.current,
        {
          width: w1,
          duration: 0.4,
          ease: "power2.out",
        },
        0,
      )
  }, [])

  useLayoutEffect(() => {
    if (!hasBothWords || isTouch) return

    const row1 = row1Ref.current
    const row2 = row2Ref.current
    const line = lineRef.current
    const wrapper = wrapRef.current

    if (!row1 || !row2 || !line || !wrapper) return

    const s = state.current

    s.tl?.kill()
    s.split1?.revert()
    s.split2?.revert()
    s.isHover = false

    const split1 = new SplitText(row1, { type: "chars" })
    const split2 = new SplitText(row2, { type: "chars" })

    s.split1 = split1
    s.split2 = split2

    const w1 = row1.offsetWidth
    const w2 = row2.offsetWidth

    s.w1 = w1
    s.w2 = w2

    wrapper.style.minWidth = `${Math.max(w1, w2)}px`

    gsap.set(split2.chars, { y: "101%" })
    gsap.set(line, { width: w1, xPercent: -50 })

    return () => {
      s.tl?.kill()
      s.split1?.revert()
      s.split2?.revert()
      s.isHover = false
    }
  }, [word1, word2, isTouch])

  if (!hasBothWords) {
    return (
      <Container className="relative w-full inline-flex flex-col items-center justify-center text-center">
        <Link href={href} className={cn("type-heading-1 inline-block")}>
          {singleDisplay}
        </Link>
      </Container>
    )
  }

  if (isTouch) {
    return (
      <div ref={wrapRef} style={{ opacity: 0 }}>
        <Container className="relative w-full inline-flex flex-col items-center justify-center text-center">
          <Link href={href} className={cn("relative")}>
            <span className={cn("type-heading-1 inline-block text-dark-gray")}>
              {trimmed2}
            </span>

            <div
              className={cn(
                "absolute bottom-[-2px] left-0 w-full h-[2px] bg-dark-gray",
                "bg-dark-gray",
              )}
            />
          </Link>
        </Container>
      </div>
    )
  }

  return (
    <div
      role="presentation"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={cn(
        "relative w-full",
        "inline-flex flex-col items-center justify-center",
        "type-heading-1 text-current",
        "group",
      )}
      ref={wrapRef}
      style={{ opacity: 0 }}
    >
      <Link href={href} className="relative inline-block">
        <div className="relative flex justify-center overflow-hidden">
          <div ref={row1Ref} className="whitespace-nowrap">
            {trimmed1}
          </div>

          <div
            ref={row2Ref}
            className={cn(
              "absolute top-0 left-1/2 -translate-x-1/2 whitespace-nowrap",
              "group-hover:text-dark-gray",
              "transition-colors duration-300 ease-out",
            )}
          >
            {trimmed2}
          </div>
        </div>

        <div
          ref={lineRef}
          className={cn(
            "absolute bottom-[-2px] left-1/2 h-[2px] bg-current",
            "group-hover:bg-dark-gray",
            "transition-colors duration-300 ease-out",
          )}
        />
      </Link>
    </div>
  )
}
