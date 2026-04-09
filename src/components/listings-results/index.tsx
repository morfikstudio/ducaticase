"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"

import type { AppLocale } from "@/i18n/routing"
import type { LISTINGS_PREVIEW_QUERY_RESULT } from "@/sanity/types"

import { cn } from "@/utils/classNames"

import { Container } from "@/components/ui/Container"
import { Button } from "@/components/ui/Button"

import { ListingsHeader } from "./subcomponents/ListingsHeader"
import { ListingsFiltersDrawer } from "./subcomponents/ListingsFiltersDrawer"
import { ListingsList } from "./subcomponents/ListingsList"
import { ListingsSortPanel } from "./subcomponents/ListingsSortPanel"
import { ListingsResultsCount } from "./subcomponents/ListingsResultsCount"

import { useListingsFilters } from "./hooks/useListingsFilters"

type ListingsResultsProps = {
  listings: LISTINGS_PREVIEW_QUERY_RESULT[number][]
  locale: AppLocale
}

export default function ListingsResults({
  listings,
  locale,
}: ListingsResultsProps) {
  const [isFiltersPanelOpen, setIsFiltersPanelOpen] = useState(false)

  const t = useTranslations("listingsResults")
  const {
    selectedContract,
    selectedSort,
    selectedMacros,
    selectedCities,
    shouldShowTypology,
    effectiveSelectedTypologies,
    visibleMacroOptions,
    typologyOptions,
    cityOptions,
    filteredListings,
    sortedListings,
    clearFilters,
    toggleContract,
    toggleMacro,
    toggleTypology,
    toggleCity,
    changeSort,
  } = useListingsFilters({ listings, locale })

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
          onCountrySwitch={(value) => {
            console.log("country switch", value)
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

        <div className="mt-12 flex items-center justify-between">
          <ListingsResultsCount current={5} total={sortedListings.length} />
          <ListingsSortPanel
            selectedSort={selectedSort}
            onChangeSort={changeSort}
          />
        </div>

        <div className="mt-12 min-w-0">
          {filteredListings.length === 0 ? (
            <p className="type-body-1 text-primary">{t("noListingsFound")}</p>
          ) : (
            <ListingsList listings={sortedListings} locale={locale} />
          )}
        </div>
      </Container>

      <ListingsFiltersDrawer
        isOpen={isFiltersPanelOpen}
        locale={locale}
        selectedContract={selectedContract}
        selectedMacros={selectedMacros}
        selectedCities={selectedCities}
        shouldShowTypology={shouldShowTypology}
        effectiveSelectedTypologies={effectiveSelectedTypologies}
        visibleMacroOptions={visibleMacroOptions}
        typologyOptions={typologyOptions}
        cityOptions={cityOptions}
        onClose={() => setIsFiltersPanelOpen(false)}
        onClearFilters={clearFilters}
        onToggleContract={toggleContract}
        onToggleMacro={toggleMacro}
        onToggleTypology={toggleTypology}
        onToggleCity={toggleCity}
      />
    </div>
  )
}
