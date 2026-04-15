"use client"

import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"

import { ListingCard } from "@/components/cards/ListingCard"
import type { AppLocale } from "@/i18n/routing"
import type { LISTINGS_PREVIEW_QUERY_RESULT } from "@/sanity/types"

type ListingsEntry = LISTINGS_PREVIEW_QUERY_RESULT[number]

type ListingsListProps = {
  listings: ListingsEntry[]
  locale: AppLocale
  paginationExitNonce: number
  onPaginationExitComplete?: () => void
}

export function ListingsList({
  listings,
  locale,
  paginationExitNonce,
  onPaginationExitComplete,
}: ListingsListProps) {
  const ulRef = useRef<HTMLUListElement>(null)

  const onExitCompleteRef = useRef(onPaginationExitComplete)
  onExitCompleteRef.current = onPaginationExitComplete

  const exitRunGenerationRef = useRef(0)

  /* Entry animation */
  useLayoutEffect(() => {
    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return
    }
    if (paginationExitNonce !== 0) return

    const ul = ulRef.current
    if (!ul) return

    const items = ul.querySelectorAll<HTMLElement>(":scope > li")
    if (items.length === 0) return

    gsap.set(items, { opacity: 0, y: 24 })
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.05,
      ease: "power2.out",
    })

    return () => {
      gsap.killTweensOf(items)
    }
  }, [])

  /* Exit animation */
  useLayoutEffect(() => {
    if (paginationExitNonce < 1) return

    const runId = ++exitRunGenerationRef.current

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (reduceMotion) {
      onExitCompleteRef.current?.()
      return
    }

    const ul = ulRef.current
    if (!ul) {
      onExitCompleteRef.current?.()
      return
    }

    const items = ul.querySelectorAll<HTMLElement>(":scope > li")
    if (items.length === 0) {
      onExitCompleteRef.current?.()
      return
    }

    let cancelled = false

    gsap.to(items, {
      opacity: 0,
      y: 24,
      duration: 0.5,
      stagger: 0.025,
      ease: "power2.in",
      onComplete: () => {
        if (!cancelled && runId === exitRunGenerationRef.current) {
          onExitCompleteRef.current?.()
        }
      },
    })

    return () => {
      cancelled = true
      gsap.killTweensOf(items)
    }
  }, [paginationExitNonce])

  return (
    <section>
      <ul
        ref={ulRef}
        className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8"
      >
        {listings.map((entry) => (
          <ListingCard key={entry._id} entry={entry} locale={locale} />
        ))}
      </ul>
    </section>
  )
}
