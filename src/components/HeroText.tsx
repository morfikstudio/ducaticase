"use client"

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react"
import type { SanityImageSource } from "@sanity/image-url/lib/types/types"
import gsap from "gsap"
import { SplitText } from "gsap/SplitText"

import type { AppLocale } from "@/i18n/routing"

import { useGsapReveal } from "@/hooks/useGsapReveal"

import { cn } from "@/utils/classNames"
import { prefersReducedMotion } from "@/utils/reducedMotion"

import { Container } from "@/components/ui/Container"
import { SanityImage } from "@/components/ui/SanityImage"

gsap.registerPlugin(SplitText)

type HeroTextProps = {
  text: string
  locale: AppLocale
  heroLandscape?: SanityImageSource | null
  heroPortrait?: SanityImageSource | null
}

export function HeroText({
  text,
  locale,
  heroLandscape,
  heroPortrait,
}: HeroTextProps) {
  const [imageReady, setImageReady] = useState(false)
  const [titleReady, setTitleReady] = useState(false)

  const bgRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const splitRef = useRef<InstanceType<typeof SplitText> | null>(null)

  const hasBg = useMemo(
    () => Boolean(heroLandscape ?? heroPortrait),
    [heroLandscape, heroPortrait],
  )
  const contentReady = useMemo(() => !hasBg || imageReady, [hasBg, imageReady])

  const { ref: wrapRef, show } = useGsapReveal({
    animate: false,
  })

  const onImageSettled = useCallback(() => {
    requestAnimationFrame(() => {
      setImageReady(true)
    })
  }, [])

  /* TITLE ANIMATION */
  useLayoutEffect(() => {
    if (!show) return

    const el = titleRef.current
    if (!text || !el) return

    setTitleReady(false)

    if (!contentReady) {
      splitRef.current?.revert()
      splitRef.current = null
      gsap.killTweensOf(el)
      gsap.killTweensOf(bgRef.current)
      return
    }

    if (prefersReducedMotion()) {
      splitRef.current?.revert()
      splitRef.current = null
      gsap.killTweensOf(el)
      gsap.set(el, { clearProps: "opacity,filter" })
      gsap.set(bgRef.current, { opacity: 1, clearProps: "opacity,filter" })
      setTitleReady(true)
      return
    }

    splitRef.current?.revert()
    splitRef.current = null
    gsap.killTweensOf(el)

    const split = new SplitText(el, {
      type: "words",
      wordsClass: "inline-block",
    })
    splitRef.current = split

    const { words } = split
    gsap.set(words, {
      opacity: 0,
      filter: "blur(12px)",
      willChange: "opacity,filter",
    })
    gsap.set(el, { opacity: 1 })
    gsap.set(wrapRef.current, { opacity: 1 })

    if (hasBg) {
      gsap.set(bgRef.current, {
        opacity: 0,
        filter: "blur(12px)",
        scale: 1.1,
        willChange: "opacity,filter,scale",
      })
    }

    let finished = false
    const tl = gsap.timeline()

    if (hasBg) {
      tl.to(bgRef.current, {
        opacity: 1,
        filter: "blur(0px)",
        scale: 1,
        duration: 1.5,
        ease: "power2.out",
        clearProps: "filter,scale",
      })
    }

    tl.to(
      words,
      {
        opacity: 1,
        filter: "blur(0px)",
        duration: 2,
        ease: "power2.out",
        stagger: 0.03,
        clearProps: "opacity,filter,willChange",
        onComplete: () => {
          if (!finished) setTitleReady(true)
        },
      },
      hasBg ? 0.6 : 0,
    )

    return () => {
      finished = true
      gsap.killTweensOf(bgRef.current)
      gsap.killTweensOf(el)
      gsap.killTweensOf(words)
      tl.kill()
      split.revert()
      if (splitRef.current === split) splitRef.current = null
    }
  }, [text, contentReady, show, hasBg])

  const hide =
    Boolean(text) &&
    (!contentReady || (!prefersReducedMotion() && !titleReady)) &&
    !show

  return (
    <div
      ref={wrapRef}
      className={cn(
        "relative isolate h-screen min-h-svh w-full overflow-hidden opacity-0",
      )}
    >
      <div
        ref={bgRef}
        className={cn(
          "pointer-events-none absolute inset-0 -z-20 isolate will-change-[opacity,filter]",
          hide && "opacity-0",
        )}
      >
        {hasBg ? (
          <>
            <SanityImage
              landscape={heroLandscape}
              portrait={heroPortrait}
              locale={locale}
              landscapeParams={{
                width: 1920,
                height: 1080,
                sizes: "(min-width: 1px) 100vw",
              }}
              portraitParams={{
                width: 720,
                height: 1280,
                sizes: "(min-width: 1px) 100vw",
              }}
              fill
              priority
              className="pointer-events-none -z-20 object-cover object-center"
              onLoad={onImageSettled}
              onError={onImageSettled}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(15,16,17,0.75) 0%, rgba(15,16,17,1) 100%)",
              }}
            />
          </>
        ) : null}
      </div>

      {text ? (
        <div className="relative z-10 flex min-h-svh h-full w-full items-center justify-center px-4">
          <Container>
            <h1
              ref={titleRef}
              className={cn(
                "type-heading-2 max-md:text-[30px] md:text-center text-primary",
                "mx-auto md:max-w-[900px]",
                hide && "opacity-0",
              )}
            >
              {text}
            </h1>
          </Container>
        </div>
      ) : null}
    </div>
  )
}
