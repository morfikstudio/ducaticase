"use client"

import { useTranslations } from "next-intl"

import { cn } from "@/utils/classNames"

type ListingsPaginationProps = {
  currentPage: number
  totalPages: number
  onUserPageChange: (page: number) => void
}

function paginationItems(
  currentPage: number,
  totalPages: number,
): Array<number | "ellipsis"> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const pages = new Set<number>()
  pages.add(1)
  pages.add(totalPages)
  for (let i = currentPage - 1; i <= currentPage + 1; i++) {
    if (i >= 1 && i <= totalPages) {
      pages.add(i)
    }
  }

  const sorted = [...pages].sort((a, b) => a - b)
  const out: Array<number | "ellipsis"> = []
  let previous = 0

  for (const page of sorted) {
    if (page - previous > 1) {
      out.push("ellipsis")
    }
    out.push(page)
    previous = page
  }

  return out
}

const pageButtonClass = cn(
  "inline-flex size-12 shrink-0 items-center justify-center",
  "rounded-[4px] type-body-2",
  "border border-transparent",
  "transition-colors duration-100 cursor-pointer",
)

function ChevronLeft() {
  return (
    <svg
      width="9"
      height="15"
      viewBox="0 0 10 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M8 2L2 8L8 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg
      width="9"
      height="15"
      viewBox="0 0 10 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M2 2L8 8L2 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ListingsPagination({
  currentPage,
  totalPages,
  onUserPageChange,
}: ListingsPaginationProps) {
  const t = useTranslations("listingsResults")
  const items = paginationItems(currentPage, totalPages)

  return (
    <nav
      className="mt-8 flex flex-wrap items-center justify-center gap-4"
      aria-label={t("paginationNavAriaLabel")}
    >
      {currentPage > 1 ? (
        <button
          type="button"
          className={cn(
            pageButtonClass,
            "bg-dark text-primary",
            "hover:border-primary focus-visible:border-primary",
          )}
          aria-label={t("paginationPrevAriaLabel")}
          onClick={() => onUserPageChange(currentPage - 1)}
        >
          <ChevronLeft />
        </button>
      ) : null}

      {items.map((item, index) =>
        item === "ellipsis" ? (
          <span
            key={`e-${index}`}
            className={cn(
              "size-12",
              "inline-flex items-center justify-center",
              "type-body-2 text-primary",
            )}
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            className={cn(
              pageButtonClass,
              item === currentPage
                ? "bg-primary text-accent border-transparent cursor-not-allowed"
                : cn(
                    "bg-dark text-primary",
                    "hover:border-primary focus-visible:border-primary",
                  ),
            )}
            aria-current={item === currentPage ? "page" : undefined}
            aria-label={t("paginationPageAriaLabel", { page: item })}
            onClick={() => onUserPageChange(item)}
            disabled={item === currentPage}
          >
            {item}
          </button>
        ),
      )}

      {currentPage < totalPages ? (
        <button
          type="button"
          className={cn(
            pageButtonClass,
            "bg-dark text-primary",
            "hover:border-primary focus-visible:border-primary",
          )}
          aria-label={t("paginationNextAriaLabel")}
          onClick={() => onUserPageChange(currentPage + 1)}
        >
          <ChevronRight />
        </button>
      ) : null}
    </nav>
  )
}
