"use client"

type SortOption = "priceDesc" | "priceAsc" | "recentDesc" | "recentAsc"

type ListingsSortPanelProps = {
  selectedSort: SortOption
  onChangeSort: (value: SortOption) => void
}

const SORT_OPTIONS: ReadonlyArray<{ value: SortOption; label: string }> = [
  { value: "priceDesc", label: "Prezzo decrescente" },
  { value: "priceAsc", label: "Prezzo crescente" },
  { value: "recentDesc", label: "Piu recenti" },
  { value: "recentAsc", label: "Meno recenti" },
]

export function ListingsSortPanel({
  selectedSort,
  onChangeSort,
}: ListingsSortPanelProps) {
  return (
    <div className="mb-4 rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
      <p className="text-sm font-semibold">Ordinamento</p>
      <ul className="mt-2 space-y-2">
        {SORT_OPTIONS.map((option) => (
          <li key={option.value}>
            <button
              type="button"
              onClick={() => onChangeSort(option.value)}
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
  )
}
