"use client"

import { cn } from "@/utils/classNames"

type CategoryOption = {
  value: string
  title: string
}

type ListingsCategoriesBarProps = {
  visibleCategoryOptions: CategoryOption[]
  selectedCategories: string[]
  onToggleCategory: (value: string) => void
}

export function ListingsCategoriesBar({
  visibleCategoryOptions,
  selectedCategories,
  onToggleCategory,
}: ListingsCategoriesBarProps) {
  return (
    <div className="flex w-full flex-nowrap gap-2">
      {visibleCategoryOptions.map((option) => {
        const isSelected = selectedCategories.includes(option.value)
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onToggleCategory(option.value)}
            className={cn(
              "flex min-w-0 flex-1 items-center justify-center gap-2",
              "px-3 py-3",
              "type-body-3 rounded-[4px] border",
              "cursor-pointer transition-all duration-200",
              isSelected
                ? "border-primary bg-primary text-accent"
                : "border-dark bg-dark text-primary hover:border-primary hover:bg-primary hover:text-accent",
            )}
          >
            <span className="h-[10px] w-[10px] shrink-0" aria-hidden="true" />
            <span className="min-w-0 truncate">{option.title}</span>
            <span
              className="flex h-[10px] w-[10px] shrink-0 items-center justify-center"
              aria-hidden="true"
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={cn(
                  "transition-opacity duration-200",
                  isSelected ? "opacity-100" : "opacity-0",
                )}
              >
                <path
                  d="M1 1L9 9M9 1L1 9"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </button>
        )
      })}
    </div>
  )
}
