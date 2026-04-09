"use client"

import { useState } from "react"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { useTranslations } from "next-intl"

import { cn } from "@/utils/classNames"

type SortOption = "priceDesc" | "priceAsc" | "recentDesc" | "recentAsc"

type ListingsSortPanelProps = {
  selectedSort: SortOption
  onChangeSort: (value: SortOption) => void
}

const SORT_OPTIONS: ReadonlyArray<{ value: SortOption; labelKey: string }> = [
  { value: "priceDesc", labelKey: "sortPriceDesc" },
  { value: "priceAsc", labelKey: "sortPriceAsc" },
  { value: "recentDesc", labelKey: "sortRecentDesc" },
  { value: "recentAsc", labelKey: "sortRecentAsc" },
]

export function ListingsSortPanel({
  selectedSort,
  onChangeSort,
}: ListingsSortPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const t = useTranslations("listingsResults")

  return (
    <div className="flex justify-end">
      <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenu.Trigger asChild>
          <button
            type="button"
            className={cn(
              "inline-flex items-center gap-1",
              "type-body-3 text-primary",
              "cursor-pointer",
              "rounded-sm",
            )}
          >
            <span>{t("sortBy")}</span>
            <span
              className={cn(
                "inline-flex h-6 w-6 items-center justify-center",
                "rotate-180 transition-transform",
                isOpen ? "rotate-0" : "",
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
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            sideOffset={16}
            className={cn(
              "z-20 w-[250px] rounded-md p-8",
              "bg-primary text-accent",
            )}
          >
            <DropdownMenu.RadioGroup
              value={selectedSort}
              onValueChange={(value) => onChangeSort(value as SortOption)}
            >
              <ul className="space-y-4">
                {SORT_OPTIONS.map((option) => {
                  const isSelected = selectedSort === option.value
                  return (
                    <li key={option.value}>
                      <DropdownMenu.RadioItem
                        value={option.value}
                        className={cn(
                          "w-full",
                          "type-body-3 text-accent text-left",
                          "px-1 rounded-sm",
                          "transition-all",
                          isSelected
                            ? "pl-3 font-semibold opacity-100 pointer-events-none"
                            : "opacity-90 hover:underline cursor-pointer",
                        )}
                      >
                        {isSelected ? "•" : ""}
                        <span className="pl-2">{t(option.labelKey)}</span>
                      </DropdownMenu.RadioItem>
                    </li>
                  )
                })}
              </ul>
            </DropdownMenu.RadioGroup>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  )
}
