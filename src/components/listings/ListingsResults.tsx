"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"

import { usePathname, useRouter } from "@/i18n/navigation"
import type { AppLocale } from "@/i18n/routing"
import { MACRO_CATEGORY_OPTIONS } from "@/sanity/lib/constants"
import { listingTypologyLabel } from "@/sanity/lib/listingTypologyLabel"
import type { LISTINGS_PREVIEW_QUERY_RESULT } from "@/sanity/types"

import { ListingsFiltersDrawer } from "./ListingsFiltersDrawer"
import { ListingsList } from "./ListingsList"
import { ListingsSortPanel } from "./ListingsSortPanel"

type ListingsEntry = LISTINGS_PREVIEW_QUERY_RESULT[number]
type ContractType = "sale" | "rent"
type TypologyMacroValue = "countryHouses" | "commercial" | "industrial"
type SortOption = "priceDesc" | "priceAsc" | "recentDesc" | "recentAsc"

type ListingsResultsProps = {
  listings: ListingsEntry[]
  locale: AppLocale
}

function parseCsv(value: string | null): string[] {
  if (!value) return []
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
}

function toCsv(values: string[]): string {
  return values.join(",")
}

function normalizeSort(value: string | null): SortOption {
  if (
    value === "priceDesc" ||
    value === "priceAsc" ||
    value === "recentAsc" ||
    value === "recentDesc"
  ) {
    return value
  }
  return "recentDesc"
}

export function ListingsResults({
  listings,
  locale,
}: ListingsResultsProps) {
  const [isFiltersPanelOpen, setIsFiltersPanelOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const selectedContract = searchParams.get("contract") as ContractType | null
  const selectedSort = normalizeSort(searchParams.get("sort"))
  const selectedMacros = parseCsv(searchParams.get("macro"))
  const selectedCities = parseCsv(searchParams.get("city"))
  const selectedTypologies = parseCsv(searchParams.get("typology"))
  const typologyMacroValues = new Set<TypologyMacroValue>([
    "countryHouses",
    "commercial",
    "industrial",
  ])

  const selectedTypologyMacros = selectedMacros.filter((macro) =>
    typologyMacroValues.has(macro as TypologyMacroValue),
  )
  const shouldShowTypology =
    selectedMacros.length > 0 && selectedTypologyMacros.length > 0

  const cityOptions = useMemo(() => {
    return Array.from(
      new Set(
        listings
          .map((entry) => entry.city?.trim())
          .filter((city): city is string => Boolean(city)),
      ),
    ).sort((a, b) => a.localeCompare(b, locale))
  }, [listings, locale])

  const typologyOptions = useMemo(() => {
    const map = new Map<string, string>()
    for (const entry of listings) {
      if (!entry.typology) continue
      const macro = MACRO_CATEGORY_OPTIONS.find(
        (item) => item.documentType === entry._type,
      )
      if (!macro || !selectedTypologyMacros.includes(macro.value)) continue
      const label = listingTypologyLabel(entry._type, entry.typology, locale)
      if (!label) continue
      map.set(entry.typology, label)
    }
    return Array.from(map.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label, locale))
  }, [listings, locale, selectedTypologyMacros])

  const availableMacros = useMemo(() => {
    const macros = new Set<string>()
    for (const entry of listings) {
      const macro = MACRO_CATEGORY_OPTIONS.find(
        (item) => item.documentType === entry._type,
      )
      if (macro) {
        macros.add(macro.value)
      }
    }
    return macros
  }, [listings])

  const visibleMacroOptions = useMemo(
    () =>
      MACRO_CATEGORY_OPTIONS.filter((option) =>
        availableMacros.has(option.value),
      ),
    [availableMacros],
  )

  const macroByDocumentType = useMemo(
    () =>
      new Map(
        MACRO_CATEGORY_OPTIONS.map((option) => [option.documentType, option]),
      ),
    [],
  )

  const typologiesByMacro = useMemo(() => {
    const map = new Map<string, Set<string>>()
    for (const entry of listings) {
      const macro = macroByDocumentType.get(entry._type)
      if (!macro || !entry.typology) continue
      const current = map.get(macro.value) ?? new Set<string>()
      current.add(entry.typology)
      map.set(macro.value, current)
    }
    return map
  }, [listings, macroByDocumentType])

  const effectiveSelectedTypologies = useMemo(() => {
    if (!shouldShowTypology) return []
    const availableTypologies = new Set(
      typologyOptions.map((item) => item.value),
    )
    return selectedTypologies.filter((value) => availableTypologies.has(value))
  }, [selectedTypologies, shouldShowTypology, typologyOptions])

  const selectedTypologiesByMacro = useMemo(() => {
    const map = new Map<string, Set<string>>()
    if (effectiveSelectedTypologies.length === 0) return map

    for (const [macroValue, macroTypologies] of typologiesByMacro.entries()) {
      const selectedForMacro = effectiveSelectedTypologies.filter((typology) =>
        macroTypologies.has(typology),
      )
      if (selectedForMacro.length > 0) {
        map.set(macroValue, new Set(selectedForMacro))
      }
    }

    return map
  }, [effectiveSelectedTypologies, typologiesByMacro])

  const filteredListings = useMemo(() => {
    return listings.filter((entry) => {
      const entryContract = (entry as { listingContractType?: string | null })
        .listingContractType

      if (selectedContract && entryContract !== selectedContract) {
        return false
      }

      if (selectedMacros.length > 0) {
        const macro = macroByDocumentType.get(entry._type)
        if (!macro || !selectedMacros.includes(macro.value)) {
          return false
        }
      }

      if (selectedCities.length > 0) {
        const city = entry.city?.trim()
        if (!city || !selectedCities.includes(city)) {
          return false
        }
      }

      const entryMacro = macroByDocumentType.get(entry._type)?.value
      if (entryMacro) {
        const macroScopedTypologies = selectedTypologiesByMacro.get(entryMacro)
        if (macroScopedTypologies) {
          if (!entry.typology || !macroScopedTypologies.has(entry.typology)) {
            return false
          }
        }
      }

      return true
    })
  }, [
    listings,
    selectedContract,
    selectedMacros,
    selectedCities,
    selectedTypologiesByMacro,
    macroByDocumentType,
  ])

  const listingOrderMap = useMemo(() => {
    return new Map(listings.map((entry, index) => [entry._id, index]))
  }, [listings])

  const sortedListings = useMemo(() => {
    const withOrder = [...filteredListings]
    const byRecent = (a: ListingsEntry, b: ListingsEntry) =>
      (listingOrderMap.get(a._id) ?? 0) - (listingOrderMap.get(b._id) ?? 0)

    const byPrice = (a: ListingsEntry, b: ListingsEntry) => {
      const amountA = a.price?.amount ?? null
      const amountB = b.price?.amount ?? null
      if (amountA == null && amountB == null) return 0
      if (amountA == null) return 1
      if (amountB == null) return -1
      return amountA - amountB
    }

    switch (selectedSort) {
      case "priceAsc":
        return withOrder.sort((a, b) => byPrice(a, b) || byRecent(a, b))
      case "priceDesc":
        return withOrder.sort((a, b) => byPrice(b, a) || byRecent(a, b))
      case "recentAsc":
        return withOrder.sort((a, b) => byRecent(b, a))
      case "recentDesc":
      default:
        return withOrder.sort((a, b) => byRecent(a, b))
    }
  }, [filteredListings, listingOrderMap, selectedSort])

  const updateSearchParams = (updater: (params: URLSearchParams) => void) => {
    const nextParams = new URLSearchParams(searchParams.toString())
    updater(nextParams)
    const query = nextParams.toString()
    router.replace(query ? `${pathname}?${query}` : pathname)
  }

  const toggleMultiValue = (key: string, value: string) => {
    updateSearchParams((params) => {
      const values = parseCsv(params.get(key))
      const hasValue = values.includes(value)
      const nextValues = hasValue
        ? values.filter((current) => current !== value)
        : [...values, value]

      if (nextValues.length === 0) {
        params.delete(key)
        if (key === "macro") {
          params.delete("typology")
        }
        return
      }
      params.set(key, toCsv(nextValues))

      if (key === "macro") {
        const hasTypologyMacro = nextValues.some((macro) =>
          typologyMacroValues.has(macro as TypologyMacroValue),
        )
        if (!hasTypologyMacro) {
          params.delete("typology")
        }
      }
    })
  }

  const clearFilters = () => {
    router.replace(pathname)
  }

  useEffect(() => {
    if (selectedMacros.length === 0) return

    const normalizedMacros = selectedMacros.filter((macro) =>
      availableMacros.has(macro),
    )
    const changed =
      normalizedMacros.length !== selectedMacros.length ||
      normalizedMacros.some((macro, idx) => macro !== selectedMacros[idx])

    if (!changed) return

    updateSearchParams((params) => {
      if (normalizedMacros.length === 0) {
        params.delete("macro")
        params.delete("typology")
        return
      }
      params.set("macro", toCsv(normalizedMacros))
    })
  }, [selectedMacros, availableMacros])

  useEffect(() => {
    if (selectedTypologies.length === 0) return

    const validTypologies = new Set(typologyOptions.map((item) => item.value))
    const normalizedTypologies = shouldShowTypology
      ? selectedTypologies.filter((typology) => validTypologies.has(typology))
      : []

    const changed =
      normalizedTypologies.length !== selectedTypologies.length ||
      normalizedTypologies.some(
        (typology, idx) => typology !== selectedTypologies[idx],
      )

    if (!changed) return

    updateSearchParams((params) => {
      if (normalizedTypologies.length === 0) {
        params.delete("typology")
        return
      }
      params.set("typology", toCsv(normalizedTypologies))
    })
  }, [selectedTypologies, shouldShowTypology, typologyOptions])

  useEffect(() => {
    if (!isFiltersPanelOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isFiltersPanelOpen])

  return (
    <div className="mt-4">
      <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
        <button
          type="button"
          onClick={() => setIsFiltersPanelOpen(true)}
          className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-800 transition hover:border-neutral-500 dark:border-neutral-700 dark:text-white dark:hover:border-neutral-500"
        >
          Filtri
        </button>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {sortedListings.length} risultati
        </p>
      </div>

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
        onToggleContract={(value, selected) =>
          updateSearchParams((params) => {
            if (selected) {
              params.delete("contract")
            } else {
              params.set("contract", value)
            }
          })
        }
        onToggleMacro={(value) => toggleMultiValue("macro", value)}
        onToggleTypology={(value) => toggleMultiValue("typology", value)}
        onToggleCity={(value) => toggleMultiValue("city", value)}
      />

      <div className="min-w-0">
        <ListingsSortPanel
          selectedSort={selectedSort}
          onChangeSort={(value) =>
            updateSearchParams((params) => {
              if (value === "recentDesc") {
                params.delete("sort")
                return
              }
              params.set("sort", value)
            })
          }
        />

        {filteredListings.length === 0 ? (
          <p className="text-sm text-neutral-500">
            Nessun annuncio trovato con questi filtri.
          </p>
        ) : (
          <ListingsList listings={sortedListings} locale={locale} />
        )}
      </div>
    </div>
  )
}
