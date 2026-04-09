"use client"

import { useTranslations } from "next-intl"

type ListingsResultsCountProps = {
  current: number
  total: number
}

export function ListingsResultsCount({
  current,
  total,
}: ListingsResultsCountProps) {
  const t = useTranslations("listingsResults")

  return (
    <p className="type-body-3 text-primary">
      {t("showingResults", { current, total })}
    </p>
  )
}
