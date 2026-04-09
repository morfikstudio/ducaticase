"use client"

import { useEffect, useMemo } from "react"
import { useSearchParams } from "next/navigation"

import { usePathname, useRouter } from "@/i18n/navigation"
import type { AppLocale } from "@/i18n/routing"
import { CATEGORY_OPTIONS } from "@/sanity/lib/constants"
import { listingTypologyLabel } from "@/sanity/lib/listingTypologyLabel"
import type { LISTINGS_PREVIEW_QUERY_RESULT } from "@/sanity/types"

type ListingsEntry = LISTINGS_PREVIEW_QUERY_RESULT[number]
type ContractType = "sale" | "rent"
type CountryValue = "it" | "intl"
type TypologyCategoryValue = "countryHouses" | "commercial" | "industrial"
type SortOption = "priceDesc" | "priceAsc" | "recentDesc" | "recentAsc"

type UseListingsFiltersParams = {
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

function normalizeCountry(value: string | null): CountryValue {
  return value === "intl" ? "intl" : "it"
}

export function useListingsFilters({
  listings,
  locale,
}: UseListingsFiltersParams) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const selectedContract = searchParams.get("contract") as ContractType | null
  const selectedCountry = normalizeCountry(searchParams.get("country"))
  const selectedSort = normalizeSort(searchParams.get("sort"))
  const selectedCategories = parseCsv(searchParams.get("category"))
  const selectedCities = parseCsv(searchParams.get("city"))
  const selectedTypologies = parseCsv(searchParams.get("typology"))
  const typologyCategoryValues = new Set<TypologyCategoryValue>([
    "countryHouses",
    "commercial",
    "industrial",
  ])

  const selectedTypologyCategories = selectedCategories.filter((category) =>
    typologyCategoryValues.has(category as TypologyCategoryValue),
  )
  const shouldShowTypology =
    selectedCategories.length > 0 && selectedTypologyCategories.length > 0

  const visibleContractOptions = useMemo(() => {
    const available = new Set<ContractType>()

    for (const entry of listings) {
      if (entry.listingContractType === "sale") {
        available.add("sale")
      }
      if (entry.listingContractType === "rent") {
        available.add("rent")
      }
    }

    return (["sale", "rent"] as const).filter((value) => available.has(value))
  }, [listings])

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
      const category = CATEGORY_OPTIONS.find(
        (item) => item.documentType === entry._type,
      )
      if (!category || !selectedTypologyCategories.includes(category.value)) {
        continue
      }
      const label = listingTypologyLabel(entry._type, entry.typology, locale)
      if (!label) continue
      map.set(entry.typology, label)
    }
    return Array.from(map.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label, locale))
  }, [listings, locale, selectedTypologyCategories])

  const availableCategories = useMemo(() => {
    const categories = new Set<string>()
    for (const entry of listings) {
      const category = CATEGORY_OPTIONS.find(
        (item) => item.documentType === entry._type,
      )
      if (category) {
        categories.add(category.value)
      }
    }
    return categories
  }, [listings])

  const visibleCategoryOptions = useMemo(
    () =>
      CATEGORY_OPTIONS.filter((option) =>
        availableCategories.has(option.value),
      ),
    [availableCategories],
  )

  const categoryByDocumentType = useMemo(
    () =>
      new Map(
        CATEGORY_OPTIONS.map((option) => [option.documentType, option]),
      ),
    [],
  )

  const typologiesByCategory = useMemo(() => {
    const map = new Map<string, Set<string>>()
    for (const entry of listings) {
      const category = categoryByDocumentType.get(entry._type)
      if (!category || !entry.typology) continue
      const current = map.get(category.value) ?? new Set<string>()
      current.add(entry.typology)
      map.set(category.value, current)
    }
    return map
  }, [listings, categoryByDocumentType])

  const effectiveSelectedTypologies = useMemo(() => {
    if (!shouldShowTypology) return []
    const availableTypologies = new Set(
      typologyOptions.map((item) => item.value),
    )
    return selectedTypologies.filter((value) => availableTypologies.has(value))
  }, [selectedTypologies, shouldShowTypology, typologyOptions])

  const selectedTypologiesByCategory = useMemo(() => {
    const map = new Map<string, Set<string>>()
    if (effectiveSelectedTypologies.length === 0) return map

    for (const [categoryValue, categoryTypologies] of typologiesByCategory.entries()) {
      const selectedForMacro = effectiveSelectedTypologies.filter((typology) =>
        categoryTypologies.has(typology),
      )
      if (selectedForMacro.length > 0) {
        map.set(categoryValue, new Set(selectedForMacro))
      }
    }

    return map
  }, [effectiveSelectedTypologies, typologiesByCategory])

  const filteredListings = useMemo(() => {
    return listings.filter((entry) => {
      const entryContract = (entry as { listingContractType?: string | null })
        .listingContractType

      if (selectedContract && entryContract !== selectedContract) {
        return false
      }

      if (selectedCategories.length > 0) {
        const category = categoryByDocumentType.get(entry._type)
        if (!category || !selectedCategories.includes(category.value)) {
          return false
        }
      }

      if (selectedCities.length > 0) {
        const city = entry.city?.trim()
        if (!city || !selectedCities.includes(city)) {
          return false
        }
      }

      const entryCategory = categoryByDocumentType.get(entry._type)?.value
      if (entryCategory) {
        const categoryScopedTypologies =
          selectedTypologiesByCategory.get(entryCategory)
        if (categoryScopedTypologies) {
          if (!entry.typology || !categoryScopedTypologies.has(entry.typology)) {
            return false
          }
        }
      }

      return true
    })
  }, [
    listings,
    selectedContract,
    selectedCategories,
    selectedCities,
    selectedTypologiesByCategory,
    categoryByDocumentType,
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
      if (key === "category") {
          params.delete("typology")
        }
        return
      }
      params.set(key, toCsv(nextValues))

      if (key === "category") {
        const hasTypologyCategory = nextValues.some((category) =>
          typologyCategoryValues.has(category as TypologyCategoryValue),
        )
        if (!hasTypologyCategory) {
          params.delete("typology")
        }
      }
    })
  }

  const clearFilters = () => {
    router.replace(pathname)
  }

  const toggleContract = (value: "sale" | "rent", selected: boolean) => {
    updateSearchParams((params) => {
      if (selected) {
        params.delete("contract")
      } else {
        params.set("contract", value)
      }
    })
  }

  const changeSort = (value: SortOption) => {
    updateSearchParams((params) => {
      if (value === "recentDesc") {
        params.delete("sort")
        return
      }
      params.set("sort", value)
    })
  }

  const changeCountry = (value: CountryValue) => {
    updateSearchParams((params) => {
      if (value === "it") {
        params.delete("country")
        return
      }
      params.set("country", value)
    })
  }

  useEffect(() => {
    if (selectedCategories.length === 0) return

    const normalizedCategories = selectedCategories.filter((category) =>
      availableCategories.has(category),
    )
    const changed =
      normalizedCategories.length !== selectedCategories.length ||
      normalizedCategories.some(
        (category, idx) => category !== selectedCategories[idx],
      )

    if (!changed) return

    updateSearchParams((params) => {
      if (normalizedCategories.length === 0) {
        params.delete("category")
        params.delete("typology")
        return
      }
      params.set("category", toCsv(normalizedCategories))
    })
  }, [selectedCategories, availableCategories])

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
    if (!selectedContract) return
    if (visibleContractOptions.includes(selectedContract)) return

    updateSearchParams((params) => {
      params.delete("contract")
    })
  }, [selectedContract, visibleContractOptions])

  return {
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
    toggleCategory: (value: string) => toggleMultiValue("category", value),
    toggleTypology: (value: string) => toggleMultiValue("typology", value),
    toggleCity: (value: string) => toggleMultiValue("city", value),
    changeSort,
    changeCountry,
  }
}
