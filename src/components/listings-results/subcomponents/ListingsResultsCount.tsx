"use client"

import { useLayoutEffect, useRef, useState } from "react"
import gsap from "gsap"
import { useTranslations } from "next-intl"

import { prefersReducedMotion } from "@/utils/reducedMotion"

type ListingsResultsCountProps = {
  page: number
  totalPages: number
}

export function ListingsResultsCount({
  page,
  totalPages,
}: ListingsResultsCountProps) {
  const t = useTranslations("listingsResults")
  const [display, setDisplay] = useState({ page, totalPages })

  const isFirst = useRef(true)
  const ref = useRef<HTMLParagraphElement>(null)

  /* Exit animation */
  useLayoutEffect(() => {
    if (
      !ref.current ||
      (display.page === page && display.totalPages === totalPages)
    )
      return

    if (prefersReducedMotion()) {
      setDisplay({ page, totalPages })
      return
    }

    gsap.killTweensOf(ref.current)
    gsap.to(ref.current, {
      opacity: 0,
      y: 12,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => setDisplay({ page, totalPages }),
    })
  }, [page, totalPages])

  /* Entry animation */
  useLayoutEffect(() => {
    if (!ref.current || isFirst.current || prefersReducedMotion()) {
      isFirst.current = false
      return
    }

    gsap.killTweensOf(ref.current)
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: -12 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
    )
  }, [display.page, display.totalPages])

  return (
    <div className="inline-block min-h-[1.35em] overflow-hidden align-bottom">
      <p ref={ref} className="type-body-3 text-primary">
        {t("showingPages", {
          page: display.page,
          totalPages: display.totalPages,
        })}
      </p>
    </div>
  )
}
