"use client"

import { useEffect, useMemo } from "react"
import { useSearchParams } from "next/navigation"

import { usePathname, useRouter } from "@/i18n/navigation"
import type { AppLocale } from "@/i18n/routing"
import { MACRO_CATEGORY_OPTIONS } from "@/sanity/lib/constants"
import { listingContractTypeLabel } from "@/sanity/lib/listingContractTypeLabel"
import { listingTypologyLabel } from "@/sanity/lib/listingTypologyLabel"
import type { LISTINGS_PREVIEW_QUERY_RESULT } from "@/sanity/types"

import { ListingsList } from "./ListingsList"

type ListingsEntry = LISTINGS_PREVIEW_QUERY_RESULT[number]
type ContractType = "sale" | "rent"
type TypologyMacroValue = "countryHouses" | "commercial" | "industrial"
type SortOption = "priceDesc" | "priceAsc" | "recentDesc" | "recentAsc"

type ListingsResultsWithFiltersProps = {
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

export function ListingsResultsWithFilters({
  listings,
  locale,
}: ListingsResultsWithFiltersProps) {
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
    selectedMacros.length > 0 &&
    selectedTypologyMacros.length === selectedMacros.length

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

  const typologiesByMacro = useMemo(() => {
    const map = new Map<string, Set<string>>()
    for (const entry of listings) {
      const macro = MACRO_CATEGORY_OPTIONS.find(
        (item) => item.documentType === entry._type,
      )
      if (!macro || !entry.typology) continue
      const current = map.get(macro.value) ?? new Set<string>()
      current.add(entry.typology)
      map.set(macro.value, current)
    }
    return map
  }, [listings])

  const effectiveSelectedTypologies = useMemo(() => {
    if (!shouldShowTypology) return []
    const availableTypologies = new Set(
      typologyOptions.map((item) => item.value),
    )
    return selectedTypologies.filter((value) => availableTypologies.has(value))
  }, [selectedTypologies, shouldShowTypology, typologyOptions])

  const incompatibleMacros = useMemo(() => {
    if (effectiveSelectedTypologies.length === 0) return new Set<string>()

    const selectedTypologiesSet = new Set(effectiveSelectedTypologies)
    const incompatible = new Set<string>()

    for (const option of MACRO_CATEGORY_OPTIONS) {
      const macroTypologies = typologiesByMacro.get(option.value)
      if (!macroTypologies) {
        incompatible.add(option.value)
        continue
      }

      const supportsAll = Array.from(selectedTypologiesSet).every((typology) =>
        macroTypologies.has(typology),
      )
      if (!supportsAll) {
        incompatible.add(option.value)
      }
    }

    return incompatible
  }, [effectiveSelectedTypologies, typologiesByMacro])

  const filteredListings = useMemo(() => {
    return listings.filter((entry) => {
      const entryContract = (entry as { listingContractType?: string | null })
        .listingContractType

      if (selectedContract && entryContract !== selectedContract) {
        return false
      }

      if (selectedMacros.length > 0) {
        const macro = MACRO_CATEGORY_OPTIONS.find(
          (item) => item.documentType === entry._type,
        )
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

      if (effectiveSelectedTypologies.length > 0) {
        if (
          !entry.typology ||
          !effectiveSelectedTypologies.includes(entry.typology)
        ) {
          return false
        }
      }

      return true
    })
  }, [
    listings,
    selectedContract,
    selectedMacros,
    selectedCities,
    effectiveSelectedTypologies,
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

  return (
    <div className="mt-4 grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
      <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800 lg:sticky lg:top-4">
        <p className="text-sm font-semibold text-neutral-700 dark:text-white">
          Filtri
        </p>

        <div className="mt-4">
          <p className="text-sm font-medium text-neutral-700 dark:text-white">
            Contratto
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {(["sale", "rent"] as const).map((value) => {
              const label = listingContractTypeLabel(value, locale) ?? value
              const selected = selectedContract === value
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    updateSearchParams((params) => {
                      if (selected) {
                        params.delete("contract")
                      } else {
                        params.set("contract", value)
                      }
                    })
                  }
                  className={`rounded-md border px-3 py-1.5 text-sm transition ${
                    selected
                      ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
                      : "border-neutral-300 text-neutral-700 hover:border-neutral-500 dark:border-neutral-700 dark:text-white dark:hover:border-neutral-500"
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium text-neutral-700 dark:text-white">
            Macro categoria
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {visibleMacroOptions.map((option) => {
              const selected = selectedMacros.includes(option.value)
              const disabled = !selected && incompatibleMacros.has(option.value)
              return (
                <button
                  key={option.value}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    if (disabled) return
                    toggleMultiValue("macro", option.value)
                  }}
                  className={`rounded-md border px-3 py-1.5 text-sm transition ${
                    selected
                      ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
                      : disabled
                        ? "cursor-not-allowed border-neutral-200 text-neutral-400 dark:border-neutral-800 dark:text-neutral-600"
                        : "border-neutral-300 text-neutral-700 hover:border-neutral-500 dark:border-neutral-700 dark:text-white dark:hover:border-neutral-500"
                  }`}
                >
                  {option.title}
                </button>
              )
            })}
          </div>
        </div>

        {shouldShowTypology ? (
          <div className="mt-4">
            <p className="text-sm font-medium text-neutral-700 dark:text-white">
              Tipologia
            </p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {typologyOptions.length === 0 ? (
                <p className="text-sm text-neutral-500">
                  Nessuna tipologia disponibile
                </p>
              ) : (
                typologyOptions.map((option) => {
                  const checked = effectiveSelectedTypologies.includes(
                    option.value,
                  )
                  return (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 text-sm text-neutral-700 dark:text-white"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          toggleMultiValue("typology", option.value)
                        }
                      />
                      <span>{option.label}</span>
                    </label>
                  )
                })
              )}
            </div>
          </div>
        ) : null}

        <div className="mt-4">
          <p className="text-sm font-medium text-neutral-700 dark:text-white">
            Localita
          </p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {cityOptions.map((city) => {
              const checked = selectedCities.includes(city)
              return (
                <label
                  key={city}
                  className="flex items-center gap-2 text-sm text-neutral-700 dark:text-white"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleMultiValue("city", city)}
                  />
                  <span>{city}</span>
                </label>
              )
            })}
          </div>
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm hover:border-neutral-500 dark:border-neutral-700 dark:hover:border-neutral-500"
          >
            Azzera filtri
          </button>
        </div>
      </div>

      <div className="min-w-0">
        <div className="mb-4 rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
          <p className="text-sm font-semibold">Ordinamento</p>
          <ul className="mt-2 space-y-2">
            {(
              [
                { value: "priceDesc", label: "Prezzo decrescente" },
                { value: "priceAsc", label: "Prezzo crescente" },
                { value: "recentDesc", label: "Piu recenti" },
                { value: "recentAsc", label: "Meno recenti" },
              ] as const
            ).map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() =>
                    updateSearchParams((params) => {
                      if (option.value === "recentDesc") {
                        params.delete("sort")
                        return
                      }
                      params.set("sort", option.value)
                    })
                  }
                  className={`text-left text-base leading-snug transition ${
                    selectedSort === option.value
                      ? "font-medium text-neutral-900 dark:text-white"
                      : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300"
                  }`}
                >
                  {selectedSort === option.value ? "• " : ""}
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

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
