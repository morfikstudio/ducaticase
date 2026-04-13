"use client"

import { useEffect, useMemo } from "react"
import { set, unset, type StringInputProps, useFormValue } from "sanity"

const CONTRACT_TYPE_SEARCH_TOKENS: Record<string, readonly string[]> = {
  sale: ["sale", "vendita", "vend"],
  rent: ["rent", "affitto", "aff"],
}

function mapContractTypeToSearchTokens(value: unknown): string | undefined {
  if (typeof value !== "string" || value.trim() === "") {
    return undefined
  }

  const tokens = CONTRACT_TYPE_SEARCH_TOKENS[value]
  if (!tokens || tokens.length === 0) {
    return undefined
  }

  return tokens.join(" ")
}

export function ListingSearchTokensInput(props: StringInputProps) {
  const contractType = useFormValue(["listingContractType"])
  const nextTokens = useMemo(
    () => mapContractTypeToSearchTokens(contractType),
    [contractType],
  )

  const currentValue = typeof props.value === "string" ? props.value.trim() : ""
  const targetValue = nextTokens?.trim() ?? ""

  useEffect(() => {
    if (currentValue === targetValue) {
      return
    }

    props.onChange(targetValue ? set(targetValue) : unset())
  }, [currentValue, targetValue, props])

  return props.renderDefault(props)
}
