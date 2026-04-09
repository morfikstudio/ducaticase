"use client"

import { create } from "zustand"

import type { LISTINGS_PREVIEW_QUERY_RESULT } from "@/sanity/types"

type ListingsEntry = LISTINGS_PREVIEW_QUERY_RESULT[number]
type ListingsCountry = "it" | "intl"

type ListingsStore = {
  allListings: ListingsEntry[]
  selectedCountry: ListingsCountry
  countryFilteredListings: ListingsEntry[]
  isHydrated: boolean
  hydrateListings: (listings: ListingsEntry[]) => void
  setSelectedCountry: (value: ListingsCountry) => void
  clearListings: () => void
}

export const useListingsStore = create<ListingsStore>((set, get) => ({
  allListings: [],
  selectedCountry: "it",
  countryFilteredListings: [],
  isHydrated: false,
  hydrateListings(listings) {
    const { selectedCountry } = get()
    const countryFilteredListings =
      selectedCountry === "it"
        ? listings.filter((entry) => entry.country === "IT")
        : listings.filter(
            (entry) => Boolean(entry.country) && entry.country !== "IT",
          )

    set({
      allListings: listings,
      countryFilteredListings,
      isHydrated: true,
    })
  },
  setSelectedCountry(value) {
    const { allListings } = get()
    const countryFilteredListings =
      value === "it"
        ? allListings.filter((entry) => entry.country === "IT")
        : allListings.filter(
            (entry) => Boolean(entry.country) && entry.country !== "IT",
          )

    set({
      selectedCountry: value,
      countryFilteredListings,
    })
  },
  clearListings() {
    set({
      allListings: [],
      selectedCountry: "it",
      countryFilteredListings: [],
      isHydrated: false,
    })
  },
}))
