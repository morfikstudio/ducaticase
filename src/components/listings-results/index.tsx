"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"

import type { AppLocale } from "@/i18n/routing"
import { usePathname, useRouter } from "@/i18n/navigation"
import { useLenis } from "@/components/providers/LenisProvider"
import { useListingsStore } from "@/stores/listingsStore"

import { Container } from "@/components/ui/Container"
import { Button } from "@/components/ui/Button"

import { ListingsHeader } from "./subcomponents/ListingsHeader"
import { ListingsFiltersDrawer } from "./subcomponents/ListingsFiltersDrawer"
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
  const [paginationExitNonce, setPaginationExitNonce] = useState(0)
  const listings = useListingsStore((state) => state.countryFilteredListings)
  const isListingsHydrated = useListingsStore((state) => state.isHydrated)
  const setSelectedCountry = useListingsStore(
    (state) => state.setSelectedCountry,
  )

  const resultsAnchorRef = useRef<HTMLDivElement>(null)
  const pagingTargetRef = useRef<number | null>(null)
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
  } = useListingsFilters({ listings, locale })

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
    pagingTargetRef.current = null
    exitInProgressRef.current = false
    setPaginationExitNonce(0)
    if (page != null) {
      goToPage(page)
    }
  }, [goToPage])

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

  return (
    <div>
      <Container className="pt-48 pb-24">
        <ListingsHeader
          activeCountry={selectedCountry}
          onCountrySwitch={(value) => {
            changeCountry(value)
          }}
        />

        <div className="mt-12 md:mt-32 flex justify-center md:justify-end">
          <Button
            icon="filters"
            onClick={() => setIsFiltersPanelOpen(true)}
            isActive={isFiltersPanelOpen}
            className="w-full md:w-auto"
          >
            {t("filtersButton")}
          </Button>
        </div>

        {sortedListings.length > 0 && (
          <div className="mt-12 flex items-center justify-between">
            <ListingsResultsCount page={currentPage} totalPages={totalPages} />
            <ListingsSortPanel
              selectedSort={selectedSort}
              onChangeSort={changeSort}
            />
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
        isOpen={isFiltersPanelOpen}
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
