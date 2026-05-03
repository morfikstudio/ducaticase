"use client"

import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import { SplitText } from "gsap/SplitText"

import { prefersReducedMotion } from "@/utils/reducedMotion"
import { cn } from "@/utils/classNames"

gsap.registerPlugin(SplitText)

type TitleRevealProps = {
  show?: boolean
  title: string
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  className?: string
}

export function TitleReveal({
  show = true,
  title,
  tag = "h1",
  className = "",
}: TitleRevealProps) {
  const Tag = tag
  const titleRef = useRef<HTMLHeadingElement>(null)
  const splitRef = useRef<InstanceType<typeof SplitText> | null>(null)

  useLayoutEffect(() => {
    const revertActiveSplit = () => {
      const split = splitRef.current

      if (split) {
        gsap.killTweensOf(split.lines)
        split.revert()
        splitRef.current = null
      }
    }

    if (!show || !title) {
      revertActiveSplit()
      const el = titleRef.current
      if (el) gsap.killTweensOf(el)
      return
    }

    const el = titleRef.current
    if (!el) return

    revertActiveSplit()
    gsap.killTweensOf(el)

    if (prefersReducedMotion()) {
      return () => {
        gsap.killTweensOf(el)
      }
    }

    const split = new SplitText(el, { type: "lines", mask: "lines" })
    splitRef.current = split
    const titleLines = split.lines

    gsap.killTweensOf(titleLines)
    gsap.set(titleLines, { yPercent: 110 })

    gsap.to(titleLines, {
      yPercent: 0,
      duration: 0.9,
      stagger: 0.15,
      delay: 0.25,
      ease: "power3.out",
    })

    return () => {
      gsap.killTweensOf(titleLines)
      split.revert()
      if (splitRef.current === split) splitRef.current = null
    }
  }, [show, title])

  return title ? (
    <Tag
      ref={titleRef}
      className={cn(
        "type-display-1 leading-none text-left text-pretty",
        className,
        !show && "opacity-0",
      )}
      dangerouslySetInnerHTML={{ __html: title }}
    />
  ) : null
}
