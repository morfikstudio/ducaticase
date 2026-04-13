"use client"

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import gsap from "gsap"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"

import type { AppLocale } from "@/i18n/routing"
import { usePathname, useRouter } from "@/i18n/navigation"
import { useListingsStore } from "@/stores/listingsStore"

import { cn } from "@/utils/classNames"
import { prefersReducedMotion } from "@/utils/reducedMotion"

import { useLenis } from "@/components/providers/LenisProvider"
import { Container } from "@/components/ui/Container"
import { Button } from "@/components/ui/Button"

import { ListingsHeader } from "./subcomponents/ListingsHeader"
import { ListingsFiltersDrawer } from "./subcomponents/ListingsFiltersDrawer"
import { ListingsCategoriesBar } from "./subcomponents/ListingsCategoriesBar"
import { ListingsList } from "./subcomponents/ListingsList"
import { ListingsPagination } from "./subcomponents/ListingsPagination"
import { ListingsSortPanel } from "./subcomponents/ListingsSortPanel"
import { ListingsResultsCount } from "./subcomponents/ListingsResultsCount"

import { useListingsFilters } from "./hooks/useListingsFilters"

type ListingsResultsProps = {
  locale: AppLocale
}

const LISTINGS_PAGE_SIZE = 10

export function ListingsResults({ locale }: ListingsResultsProps) {
  const [isFiltersPanelOpen, setIsFiltersPanelOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [paginationExitNonce, setPaginationExitNonce] = useState(0)
  const listings = useListingsStore((state) => state.countryFilteredListings)
  const isListingsHydrated = useListingsStore((state) => state.isHydrated)
  const setSelectedCountry = useListingsStore(
    (state) => state.setSelectedCountry,
  )

  const resultsAnchorRef = useRef<HTMLDivElement>(null)

  /* Entry animation start */
  const headerEntranceRef = useRef<HTMLDivElement>(null)
  const categoriesBtnEntranceRef = useRef<HTMLDivElement>(null)
  const filtersBtnEntranceRef = useRef<HTMLDivElement>(null)
  const resultsCountEntranceRef = useRef<HTMLDivElement>(null)
  const sortPanelEntranceRef = useRef<HTMLDivElement>(null)
  const toolbarEntranceDoneRef = useRef(false)
  /* Entry animation end */

  const pagingTargetRef = useRef<number | null>(null)
  const countryTargetRef = useRef<string | null>(null)
  const exitInProgressRef = useRef(false)
  const lenis = useLenis()

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const searchParamsKey = searchParams.toString()

  const t = useTranslations("listingsResults")
  const {
    selectedCountry,
    selectedContract,
    visibleContractOptions,
    selectedSort,
    selectedCategories,
    selectedCities,
    shouldShowTypology,
    effectiveSelectedTypologies,
    visibleCategoryOptions,
    typologyOptions,
    cityOptions,
    filteredListings,
    sortedListings,
    clearFilters,
    toggleContract,
    toggleCategory,
    toggleTypology,
    toggleCity,
    changeSort,
    changeCountry,
  } = useListingsFilters({ listings, locale, isHydrated: isListingsHydrated })

  const totalCount = sortedListings.length
  const totalPages = useMemo(
    () =>
      totalCount === 0
        ? 0
        : Math.max(1, Math.ceil(totalCount / LISTINGS_PAGE_SIZE)),
    [totalCount],
  )

  const parsedFromUrl = useMemo(() => {
    const params = new URLSearchParams(searchParamsKey)
    const raw = params.get("page")
    const n = raw ? parseInt(raw, 10) : Number.NaN
    return Number.isFinite(n) && n >= 1 ? n : 1
  }, [searchParamsKey])

  const currentPage = useMemo(() => {
    if (totalCount === 0) return 1
    if (totalCount <= LISTINGS_PAGE_SIZE) return 1
    return Math.min(parsedFromUrl, totalPages)
  }, [parsedFromUrl, totalCount, totalPages])

  const paginatedListings = useMemo(
    () =>
      sortedListings.slice(
        (currentPage - 1) * LISTINGS_PAGE_SIZE,
        currentPage * LISTINGS_PAGE_SIZE,
      ),
    [currentPage, sortedListings],
  )

  const hasSingleResultOnPage = listings.length === 1

  useEffect(() => {
    if (!hasSingleResultOnPage) return
    setIsFiltersPanelOpen(false)
    setIsCategoriesOpen(false)
  }, [hasSingleResultOnPage])

  useEffect(() => {
    if (!isListingsHydrated) return

    let desiredPageParam: string | null = null
    if (totalCount === 0 || totalCount <= LISTINGS_PAGE_SIZE) {
      desiredPageParam = null
    } else {
      const clamped = Math.min(parsedFromUrl, totalPages)
      desiredPageParam = clamped <= 1 ? null : String(clamped)
    }

    const params = new URLSearchParams(searchParamsKey)
    const currentPageParam = params.get("page")
    if (currentPageParam === desiredPageParam) return

    const next = new URLSearchParams(searchParamsKey)
    if (desiredPageParam === null) {
      next.delete("page")
    } else {
      next.set("page", desiredPageParam)
    }
    const query = next.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    })
  }, [
    isListingsHydrated,
    pathname,
    parsedFromUrl,
    router,
    searchParamsKey,
    totalCount,
    totalPages,
  ])

  const goToPage = useCallback(
    (page: number) => {
      const next = new URLSearchParams(searchParams.toString())
      if (page <= 1) {
        next.delete("page")
      } else {
        next.set("page", String(page))
      }
      const query = next.toString()
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      })
    },
    [pathname, router, searchParams],
  )

  const handlePaginationExitComplete = useCallback(() => {
    const page = pagingTargetRef.current
    const country = countryTargetRef.current
    pagingTargetRef.current = null
    countryTargetRef.current = null
    exitInProgressRef.current = false
    setPaginationExitNonce(0)
    if (page != null) {
      goToPage(page)
    } else if (country != null) {
      changeCountry(country as "it" | "intl")
    }
  }, [goToPage, changeCountry])

  const handlePaginationNavigate = useCallback(
    (page: number) => {
      if (page === currentPage) return
      if (exitInProgressRef.current) return

      const reduceMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches

      if (reduceMotion) {
        const anchor = resultsAnchorRef.current
        if (lenis && anchor) {
          lenis.scrollTo(anchor, {
            offset: -96,
            immediate: true,
            force: true,
          })
        }
        goToPage(page)
        return
      }

      exitInProgressRef.current = true
      pagingTargetRef.current = page

      const anchor = resultsAnchorRef.current
      if (lenis && anchor) {
        lenis.scrollTo(anchor, { offset: -96, force: true })
      } else if (anchor) {
        anchor.scrollIntoView({ behavior: "smooth", block: "start" })
      }

      setPaginationExitNonce((n) => n + 1)
    },
    [currentPage, goToPage, lenis],
  )

  const handleCountrySwitch = useCallback(
    (value: "it" | "intl") => {
      if (value === selectedCountry) return
      if (exitInProgressRef.current) return

      const reduceMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches

      if (reduceMotion) {
        changeCountry(value)
        return
      }

      exitInProgressRef.current = true
      countryTargetRef.current = value

      const anchor = resultsAnchorRef.current
      if (lenis && anchor) {
        lenis.scrollTo(anchor, { offset: -96, force: true })
      } else if (anchor) {
        anchor.scrollIntoView({ behavior: "smooth", block: "start" })
      }

      setPaginationExitNonce((n) => n + 1)
    },
    [selectedCountry, changeCountry, lenis],
  )

  useEffect(() => {
    setSelectedCountry(selectedCountry)
  }, [selectedCountry, setSelectedCountry])

  /* Prevent scrolling when the filters panel is open */
  useEffect(() => {
    if (!isFiltersPanelOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isFiltersPanelOpen])

  /* Entry animation */
  useLayoutEffect(() => {
    if (!isListingsHydrated || toolbarEntranceDoneRef.current) return

    if (prefersReducedMotion()) {
      toolbarEntranceDoneRef.current = true
      return
    }

    let cancelled = false
    const rafId = requestAnimationFrame(() => {
      if (cancelled || toolbarEntranceDoneRef.current) return

      const sequence = [
        headerEntranceRef.current,
        categoriesBtnEntranceRef.current,
        filtersBtnEntranceRef.current,
        resultsCountEntranceRef.current,
        sortPanelEntranceRef.current,
      ].filter((el): el is HTMLDivElement => el != null)

      if (sequence.length === 0) return

      gsap.set(sequence, { opacity: 0, y: 20 })
      gsap.to(sequence, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        onComplete: () => {
          toolbarEntranceDoneRef.current = true
        },
      })
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(rafId)
      const toKill = [
        headerEntranceRef.current,
        categoriesBtnEntranceRef.current,
        filtersBtnEntranceRef.current,
        resultsCountEntranceRef.current,
        sortPanelEntranceRef.current,
      ].filter((el): el is HTMLDivElement => el != null)

      if (toKill.length > 0) {
        gsap.killTweensOf(toKill)
      }
    }
  }, [isListingsHydrated])

  return (
    <div>
      <Container className="pt-30 md:pt-20 pb-24">
        <div ref={headerEntranceRef}>
          <ListingsHeader
            activeCountry={selectedCountry}
            onCountrySwitch={handleCountrySwitch}
          />
        </div>

        <div className="mt-12 md:mt-32 flex flex-col gap-4">
          <div className="flex items-center justify-end gap-4 lg:justify-between">
            <div
              ref={categoriesBtnEntranceRef}
              className="hidden lg:inline-flex lg:w-auto"
            >
              <Button
                chevron={isCategoriesOpen ? "up" : "down"}
                isActive={isCategoriesOpen}
                disabled={hasSingleResultOnPage}
                onClick={() => setIsCategoriesOpen((v) => !v)}
                className="lg:w-auto"
              >
                {t("categoriesButton")}
              </Button>
            </div>

            <div ref={filtersBtnEntranceRef} className="w-full lg:w-auto">
              <Button
                icon="filters"
                disabled={hasSingleResultOnPage}
                onClick={() => {
                  setIsCategoriesOpen(false)
                  setIsFiltersPanelOpen(true)
                }}
                className="w-full lg:w-auto"
              >
                {t("filtersButton")}
              </Button>
            </div>
          </div>

          {visibleCategoryOptions.length > 0 ? (
            <div
              className={cn(
                "hidden lg:grid transition-[grid-template-rows] duration-300 ease-out",
                isCategoriesOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden" inert={!isCategoriesOpen}>
                <div className="py-1">
                  <ListingsCategoriesBar
                    visibleCategoryOptions={visibleCategoryOptions}
                    selectedCategories={selectedCategories}
                    onToggleCategory={toggleCategory}
                  />
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {sortedListings.length > 0 && (
          <div className="mt-12 flex items-center justify-between">
            <div ref={resultsCountEntranceRef}>
              <ListingsResultsCount
                page={currentPage}
                totalPages={totalPages}
              />
            </div>
            <div ref={sortPanelEntranceRef} className="min-w-0">
              <ListingsSortPanel
                selectedSort={selectedSort}
                onChangeSort={changeSort}
              />
            </div>
          </div>
        )}

        <div
          ref={resultsAnchorRef}
          className="mt-12 min-w-0 scroll-mt-32"
          aria-live="polite"
        >
          {filteredListings.length === 0 ? (
            <p className="type-body-1 text-primary">{t("noListingsFound")}</p>
          ) : (
            <>
              <ListingsList
                key={currentPage}
                listings={paginatedListings}
                locale={locale}
                paginationExitNonce={paginationExitNonce}
                onPaginationExitComplete={handlePaginationExitComplete}
              />

              {totalCount > LISTINGS_PAGE_SIZE ? (
                <div className="mt-16 md:mt-24">
                  <ListingsPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onUserPageChange={handlePaginationNavigate}
                  />
                </div>
              ) : null}
            </>
          )}
        </div>
      </Container>

      <ListingsFiltersDrawer
        isOpen={isFiltersPanelOpen && !hasSingleResultOnPage}
        locale={locale}
        selectedContract={selectedContract}
        visibleContractOptions={visibleContractOptions}
        selectedCategories={selectedCategories}
        selectedCities={selectedCities}
        shouldShowTypology={shouldShowTypology}
        effectiveSelectedTypologies={effectiveSelectedTypologies}
        visibleCategoryOptions={visibleCategoryOptions}
        typologyOptions={typologyOptions}
        cityOptions={cityOptions}
        onClose={() => setIsFiltersPanelOpen(false)}
        onClearFilters={clearFilters}
        onToggleContract={toggleContract}
        onToggleCategory={toggleCategory}
        onToggleTypology={toggleTypology}
        onToggleCity={toggleCity}
      />
    </div>
  )
}
