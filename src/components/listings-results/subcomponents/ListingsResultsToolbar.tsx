"use client"

import { type Dispatch, type SetStateAction } from "react"
import { useTranslations } from "next-intl"

import { useGsapReveal } from "@/hooks/useGsapReveal"
import { cn } from "@/utils/classNames"

import { Button } from "@/components/ui/Button"

import { ListingsCategoriesBar } from "./ListingsCategoriesBar"
import { ListingsResultsCount } from "./ListingsResultsCount"
import { ListingsSortPanel } from "./ListingsSortPanel"

type CategoryOption = {
  value: string
  title: string
}

type SortOption = "priceDesc" | "priceAsc" | "recentDesc" | "recentAsc"

type ListingsResultsToolbarProps = {
  hasSingleResultOnPage: boolean
  isCategoriesOpen: boolean
  setIsCategoriesOpen: Dispatch<SetStateAction<boolean>>
  onOpenFiltersPanel: () => void
  visibleCategoryOptions: CategoryOption[]
  selectedCategories: string[]
  onToggleCategory: (value: string) => void
  hasResults: boolean
  currentPage: number
  totalPages: number
  selectedSort: SortOption
  onChangeSort: (value: SortOption) => void
}

export function ListingsResultsToolbar({
  hasSingleResultOnPage,
  isCategoriesOpen,
  setIsCategoriesOpen,
  onOpenFiltersPanel,
  visibleCategoryOptions,
  selectedCategories,
  onToggleCategory,
  hasResults,
  currentPage,
  totalPages,
  selectedSort,
  onChangeSort,
}: ListingsResultsToolbarProps) {
  const t = useTranslations("listingsResults")
  const { ref: wrapRef } = useGsapReveal()

  return (
    <div ref={wrapRef} style={{ opacity: 0 }}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-end gap-4 lg:justify-between">
          <div className="hidden lg:inline-flex lg:w-auto">
            <Button
              chevron={isCategoriesOpen ? "up" : "down"}
              isActive={isCategoriesOpen || selectedCategories.length > 0}
              disabled={hasSingleResultOnPage}
              onClick={() => setIsCategoriesOpen((v) => !v)}
              className="lg:w-auto"
            >
              {t("categoriesButton")}
            </Button>
          </div>

          <div className="w-full lg:w-auto">
            <Button
              icon="filters"
              disabled={hasSingleResultOnPage}
              onClick={() => {
                setIsCategoriesOpen(false)
                onOpenFiltersPanel()
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
                  onToggleCategory={onToggleCategory}
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {hasResults ? (
        <div className="mt-12 flex items-center justify-between">
          <div>
            <ListingsResultsCount page={currentPage} totalPages={totalPages} />
          </div>
          <div className="min-w-0">
            <ListingsSortPanel
              selectedSort={selectedSort}
              onChangeSort={onChangeSort}
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}
