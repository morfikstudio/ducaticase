"use client"

import { useLayoutEffect, useRef } from "react"
import { useTranslations } from "next-intl"
import gsap from "gsap"

import { ListingCard } from "@/components/cards/ListingCard"
import type { AppLocale } from "@/i18n/routing"
import type { LISTINGS_PREVIEW_QUERY_RESULT } from "@/sanity/types"

import { ListingsPagination } from "./ListingsPagination"

type ListingsEntry = LISTINGS_PREVIEW_QUERY_RESULT[number]

const LISTINGS_PAGE_SIZE = 10

type ListingsListProps = {
  listings: ListingsEntry[]
  locale: AppLocale
  paginationExitNonce: number
  onPaginationExitComplete?: () => void
  isListingsHydrated: boolean
  showNoListingsMessage: boolean
  totalCount: number
  currentPage: number
  totalPages: number
  onUserPageChange: (page: number) => void
}

export function ListingsList({
  listings,
  locale,
  paginationExitNonce,
  onPaginationExitComplete,
  isListingsHydrated,
  showNoListingsMessage,
  totalCount,
  currentPage,
  totalPages,
  onUserPageChange,
}: ListingsListProps) {
  const t = useTranslations("listingsResults")
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

  if (!isListingsHydrated) {
    return null
  }

  if (showNoListingsMessage) {
    return <p className="type-body-1 text-primary">{t("noListingsFound")}</p>
  }

  return (
    <section aria-label={t("listingsGridSectionAriaLabel")}>
      <ul
        ref={ulRef}
        className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8"
      >
        {listings.map((entry) => (
          <ListingCard key={entry._id} entry={entry} locale={locale} />
        ))}
      </ul>

      {totalCount > LISTINGS_PAGE_SIZE ? (
        <div className="mt-16 md:mt-24">
          <ListingsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onUserPageChange={onUserPageChange}
          />
        </div>
      ) : null}
    </section>
  )
}
