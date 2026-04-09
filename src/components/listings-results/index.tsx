"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"

import type { AppLocale } from "@/i18n/routing"
import { useListingsStore } from "@/stores/listingsStore"

import { Container } from "@/components/ui/Container"
import { Button } from "@/components/ui/Button"

import { ListingsHeader } from "./subcomponents/ListingsHeader"
import { ListingsFiltersDrawer } from "./subcomponents/ListingsFiltersDrawer"
import { ListingsList } from "./subcomponents/ListingsList"
import { ListingsSortPanel } from "./subcomponents/ListingsSortPanel"
import { ListingsResultsCount } from "./subcomponents/ListingsResultsCount"

import { useListingsFilters } from "./hooks/useListingsFilters"

type ListingsResultsProps = {
  locale: AppLocale
}

export function ListingsResults({ locale }: ListingsResultsProps) {
  const [isFiltersPanelOpen, setIsFiltersPanelOpen] = useState(false)
  const listings = useListingsStore((state) => state.countryFilteredListings)
  const setSelectedCountry = useListingsStore(
    (state) => state.setSelectedCountry,
  )

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
            <ListingsResultsCount current={5} total={sortedListings.length} />
            <ListingsSortPanel
              selectedSort={selectedSort}
              onChangeSort={changeSort}
            />
          </div>
        )}

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
