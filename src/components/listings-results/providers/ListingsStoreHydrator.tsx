"use client"

import { useEffect } from "react"

import type { LISTINGS_PREVIEW_QUERY_RESULT } from "@/sanity/types"
import { useListingsStore } from "@/stores/listingsStore"

type ListingsEntry = LISTINGS_PREVIEW_QUERY_RESULT[number]

type ListingsStoreHydratorProps = {
  listings: ListingsEntry[]
}

export function ListingsStoreHydrator({
  listings,
}: ListingsStoreHydratorProps) {
  const hydrateListings = useListingsStore((state) => state.hydrateListings)

  useEffect(() => {
    hydrateListings(listings)
  }, [hydrateListings, listings])

  return null
}
