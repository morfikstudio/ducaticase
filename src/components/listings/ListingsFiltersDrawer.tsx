"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"

import type { AppLocale } from "@/i18n/routing"
import { listingContractTypeLabel } from "@/sanity/lib/listingContractTypeLabel"
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
  selectedMacros: string[]
  selectedCities: string[]
  shouldShowTypology: boolean
  effectiveSelectedTypologies: string[]
  visibleMacroOptions: MacroOption[]
  typologyOptions: TypologyOption[]
  cityOptions: string[]
  onClose: () => void
  onClearFilters: () => void
  onToggleContract: (value: "sale" | "rent", selected: boolean) => void
  onToggleMacro: (value: string) => void
  onToggleTypology: (value: string) => void
  onToggleCity: (value: string) => void
}

type CollapsibleSectionProps = {
  title: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}

function CollapsibleSection({
  title,
  isOpen,
  onToggle,
  children,
}: CollapsibleSectionProps) {
  return (
    <section className="mt-6 border-b border-neutral-300 pb-3 dark:border-neutral-700">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between py-2 text-left"
      >
        <span className="text-[24px] text-4 font-medium text-neutral-900 dark:text-white">
          {title}
        </span>
        <span
          className={`text-xl leading-none text-neutral-900 transition-transform dark:text-white ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        >
          ˅
        </span>
      </button>

      {isOpen ? <div className="pt-3">{children}</div> : null}
    </section>
  )
}

export function ListingsFiltersDrawer({
  isOpen,
  locale,
  selectedContract,
  selectedMacros,
  selectedCities,
  shouldShowTypology,
  effectiveSelectedTypologies,
  visibleMacroOptions,
  typologyOptions,
  cityOptions,
  onClose,
  onClearFilters,
  onToggleContract,
  onToggleMacro,
  onToggleTypology,
  onToggleCity,
}: ListingsFiltersDrawerProps) {
  const [isTypologyOpen, setIsTypologyOpen] = useState(false)
  const [isCityOpen, setIsCityOpen] = useState(false)
  const lenis = useLenis()
  const t = useTranslations("listingDetail")

  useEffect(() => {
    if (!lenis || !isOpen) return

    lenis.stop()
    return () => {
      lenis.start()
    }
  }, [lenis, isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-40 pointer-events-none">
      <button
        type="button"
        aria-label="Chiudi pannello filtri"
        className="absolute inset-0 bg-black/45 pointer-events-auto"
        onClick={onClose}
      />
      <aside className="absolute right-0 top-0 z-10 flex h-full w-full max-w-[520px] pointer-events-auto flex-col overflow-hidden bg-white shadow-2xl dark:bg-neutral-950">
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5 dark:border-neutral-800">
          <p className="text-3xl font-normal text-neutral-900 dark:text-white">
            Filtri
          </p>
          <button
            type="button"
            onClick={onClose}
            className="text-2xl leading-none text-neutral-700 transition hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
            aria-label="Chiudi"
          >
            ×
          </button>
        </div>

        <div
          data-lenis-prevent
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-5 touch-pan-y"
        >
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-neutral-700 dark:text-neutral-300">
              Contratto
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {(["sale", "rent"] as const).map((value) => {
                const label = listingContractTypeLabel(value, locale) ?? value
                const selected = selectedContract === value
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => onToggleContract(value, selected)}
                    className={`rounded-md border px-3 py-2 text-sm transition ${
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

          <div className="mt-6">
            <p className="text-sm font-medium uppercase tracking-wide text-neutral-700 dark:text-neutral-300">
              Categoria
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {visibleMacroOptions.map((option) => {
                const selected = selectedMacros.includes(option.value)
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onToggleMacro(option.value)}
                    className={`rounded-md border px-3 py-2 text-sm transition ${
                      selected
                        ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
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
            <CollapsibleSection
              title={`${effectiveSelectedTypologies.length > 0 ? `(${effectiveSelectedTypologies.length}) ` : ""}${t("typology")}`}
              isOpen={isTypologyOpen}
              onToggle={() => setIsTypologyOpen((value) => !value)}
            >
              <div className="grid grid-cols-1 gap-1">
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
                        className="flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-xs text-neutral-700 transition-colors hover:bg-neutral-200 dark:text-white dark:hover:bg-neutral-900"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => onToggleTypology(option.value)}
                        />
                        <span className="text-sm text-neutral-900 dark:text-white">
                          {option.label}
                        </span>
                      </label>
                    )
                  })
                )}
              </div>
            </CollapsibleSection>
          ) : null}

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
                    className="flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-xs text-neutral-700 transition-colors hover:bg-neutral-200 dark:text-white dark:hover:bg-neutral-900"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => onToggleCity(city)}
                    />
                    <span className="text-sm text-neutral-900 dark:text-white">
                      {city}
                    </span>
                  </label>
                )
              })}
            </div>
          </CollapsibleSection>
        </div>

        <div className="grid grid-cols-2 border-t border-neutral-200 dark:border-neutral-800">
          <button
            type="button"
            onClick={onClearFilters}
            className="border-r border-neutral-200 px-4 py-4 text-sm font-medium uppercase tracking-wide text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-900"
          >
            Azzera
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-neutral-900 px-4 py-4 text-sm font-medium uppercase tracking-wide text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-300"
          >
            Applica
          </button>
        </div>
      </aside>
    </div>
  )
}
