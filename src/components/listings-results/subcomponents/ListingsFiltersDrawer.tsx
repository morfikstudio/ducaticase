"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslations } from "next-intl"

import type { AppLocale } from "@/i18n/routing"
import { listingContractTypeLabel } from "@/sanity/lib/listingContractTypeLabel"

import { cn } from "@/utils/classNames"

import { useLenis } from "@/components/providers/LenisProvider"
import { Checkbox } from "@/components/ui/form-controls/Checkbox"

type MacroOption = {
  value: string
  title: string
}

type TypologyOption = {
  value: string
  label: string
}

type ListingsFiltersDrawerProps = {
  isOpen: boolean
  locale: AppLocale
  selectedContract: "sale" | "rent" | null
  visibleContractOptions: ("sale" | "rent")[]
  selectedCategories: string[]
  selectedCities: string[]
  shouldShowTypology: boolean
  effectiveSelectedTypologies: string[]
  visibleCategoryOptions: MacroOption[]
  typologyOptions: TypologyOption[]
  cityOptions: string[]
  onClose: () => void
  onClearFilters: () => void
  onToggleContract: (value: "sale" | "rent", selected: boolean) => void
  onToggleCategory: (value: string) => void
  onToggleTypology: (value: string) => void
  onToggleCity: (value: string) => void
}

type CollapsibleSectionProps = {
  title: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}

type FilterButtonProps = {
  title: string
  selected: boolean
  onClick: () => void
  variant: "m" | "l"
}

export function ListingsFiltersDrawer({
  isOpen,
  locale,
  selectedContract,
  visibleContractOptions,
  selectedCategories,
  selectedCities,
  shouldShowTypology,
  effectiveSelectedTypologies,
  visibleCategoryOptions,
  typologyOptions,
  cityOptions,
  onClose,
  onClearFilters,
  onToggleContract,
  onToggleCategory,
  onToggleTypology,
  onToggleCity,
}: ListingsFiltersDrawerProps) {
  const [isTypologyOpen, setIsTypologyOpen] = useState(false)
  const [isCityOpen, setIsCityOpen] = useState(false)
  const [shouldRender, setShouldRender] = useState(isOpen)
  const [isVisible, setIsVisible] = useState(false)
  const lenis = useLenis()
  const t = useTranslations("listingsResults")

  const hasActiveFilters = useMemo(
    () =>
      selectedContract != null ||
      selectedCategories.length > 0 ||
      selectedCities.length > 0 ||
      effectiveSelectedTypologies.length > 0,
    [
      selectedContract,
      selectedCategories,
      selectedCities,
      effectiveSelectedTypologies,
    ],
  )

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsVisible(true))
      })
      return () => cancelAnimationFrame(raf)
    } else {
      setIsVisible(false)
      const timer = setTimeout(() => setShouldRender(false), 320)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  useEffect(() => {
    if (!lenis || !isOpen) return

    lenis.stop()
    return () => {
      lenis.start()
    }
  }, [lenis, isOpen])

  const CollapsibleSection = useCallback(
    ({ title, isOpen, onToggle, children }: CollapsibleSectionProps) => {
      return (
        <section className="mt-6 pb-3 border-b border-gray">
          <button
            type="button"
            onClick={onToggle}
            className="flex w-full items-center justify-between py-2 text-left cursor-pointer"
          >
            <span className="type-body-2 font-medium text-accent">{title}</span>

            <span
              className={cn(
                "text-accent",
                "transition-transform",
                !isOpen ? "rotate-180" : "",
              )}
              aria-hidden="true"
            >
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.75 5L5 1L9.25 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>

          {isOpen ? <div className="pt-3">{children}</div> : null}
        </section>
      )
    },
    [],
  )

  const FilterButton = useCallback(
    ({ title, selected, onClick, variant = "m" }: FilterButtonProps) => {
      return (
        <button
          type="button"
          onClick={onClick}
          className={cn(
            "type-body-2 text-accent",
            "transition cursor-pointer",
            "border rounded-md border-gray",
            selected ? "font-medium bg-[#F1F1F1] border-accent" : "",
            variant === "l" ? "px-3 py-4" : "px-3 py-2",
            "hover:border-accent",
          )}
        >
          {title}
        </button>
      )
    },
    [],
  )

  return shouldRender ? (
    <div className="fixed inset-0 z-40 pointer-events-none">
      <button
        type="button"
        aria-label={t("closeFiltersPanelAriaLabel")}
        className={cn(
          "absolute inset-0",
          "bg-black/60 pointer-events-auto",
          "transition-opacity duration-300 ease-out",
          isVisible ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          "absolute right-0 top-0 z-10",
          "h-full w-full max-w-[580px]",
          "flex flex-col",
          "pointer-events-auto overflow-hidden",
          "bg-white shadow-2xl",
          "transition-transform duration-300 ease-out",
          isVisible ? "translate-x-0" : "translate-x-full",
        )}
      >
        <button
          type="button"
          className="absolute right-6 top-6 text-accent cursor-pointer z-10"
          aria-label={t("close")}
          onClick={onClose}
        >
          <svg
            aria-hidden="true"
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1L14 14M14 1L1 14"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* WRAPPER */}
        <div
          data-lenis-prevent
          className={cn(
            "relative px-6 md:px-10 py-14",
            "min-h-0 flex-1 overflow-y-auto overscroll-contain touch-pan-y",
            /* Prevent scroll snapping when the scrollbar appears */
            "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
          )}
        >
          {/* TITLE */}
          <p className="type-body-1 font-medium text-accent">
            {t("filtersTitle")}
          </p>

          {/* CONTRACT TYPE */}
          <div
            className={cn(
              "mt-5 grid gap-2",
              visibleContractOptions.length > 1 ? "grid-cols-2" : "grid-cols-1",
            )}
          >
            {visibleContractOptions.map((value) => {
              const label = listingContractTypeLabel(value, locale) ?? value
              const selected = selectedContract === value

              return (
                <FilterButton
                  key={value}
                  title={label}
                  selected={selected}
                  onClick={() => onToggleContract(value, selected)}
                  variant="l"
                />
              )
            })}
          </div>

          {/* CATEGORIES */}
          <div className="mt-8">
            <p className="type-body-2 font-medium text-accent">
              {t("category")}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {visibleCategoryOptions.map((option) => {
                const selected = selectedCategories.includes(option.value)
                return (
                  <FilterButton
                    key={option.value}
                    title={option.title}
                    selected={selected}
                    onClick={() => onToggleCategory(option.value)}
                    variant="m"
                  />
                )
              })}
            </div>
          </div>

          {/* LOCATION */}
          <CollapsibleSection
            title={`${selectedCities.length > 0 ? `(${selectedCities.length}) ` : ""}${t("location")}`}
            isOpen={isCityOpen}
            onToggle={() => setIsCityOpen((value) => !value)}
          >
            <div className="grid grid-cols-1 gap-1">
              {cityOptions.map((city) => {
                const checked = selectedCities.includes(city)
                return (
                  <label
                    key={city}
                    className={cn(
                      "w-full px-3 py-2",
                      "flex items-center gap-3",
                      "cursor-pointer rounded-md",
                      "hover:bg-light-gray",
                      "transition-colors",
                    )}
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => onToggleCity(city)}
                    />
                    <span className="type-body-2 text-accent">{city}</span>
                  </label>
                )
              })}
            </div>
          </CollapsibleSection>

          {/* TYPOLGY */}
          {shouldShowTypology ? (
            <CollapsibleSection
              title={`${effectiveSelectedTypologies.length > 0 ? `(${effectiveSelectedTypologies.length}) ` : ""}${t("typology")}`}
              isOpen={isTypologyOpen}
              onToggle={() => setIsTypologyOpen((value) => !value)}
            >
              <div className="grid grid-cols-1 gap-1">
                {typologyOptions.length === 0 ? (
                  <p className="text-sm text-neutral-500">
                    {t("noTypologyAvailable")}
                  </p>
                ) : (
                  typologyOptions.map((option) => {
                    const checked = effectiveSelectedTypologies.includes(
                      option.value,
                    )
                    return (
                      <label
                        key={option.value}
                        className={cn(
                          "w-full px-3 py-2",
                          "flex items-center gap-3",
                          "cursor-pointer rounded-md",
                          "hover:bg-light-gray",
                          "transition-colors",
                        )}
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => onToggleTypology(option.value)}
                        />
                        <span className="type-body-2 text-accent">
                          {option.label}
                        </span>
                      </label>
                    )
                  })
                )}
              </div>
            </CollapsibleSection>
          ) : null}
        </div>

        {/* ACTIONS */}
        <div className="grid grid-cols-2">
          <button
            type="button"
            disabled={!hasActiveFilters}
            onClick={onClearFilters}
            className={cn(
              "px-4 py-5",
              "border-t border-gray",
              "type-button text-accent",
              hasActiveFilters
                ? "cursor-pointer hover:bg-neutral-100"
                : "cursor-not-allowed opacity-40",
            )}
          >
            {t("clearFilters")}
          </button>

          <button
            type="button"
            disabled={!hasActiveFilters}
            onClick={onClose}
            className={cn(
              "px-4 py-5",
              "type-button",
              hasActiveFilters
                ? "bg-accent text-primary cursor-pointer"
                : "bg-accent/40 text-primary/60 cursor-not-allowed",
            )}
          >
            {t("applyFilters")}
          </button>
        </div>
      </aside>
    </div>
  ) : null
}
