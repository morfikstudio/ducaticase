"use client"

import { useTranslations } from "next-intl"

import { cn } from "@/utils/classNames"

type CountryValue = "it" | "intl"

type ListingsHeaderProps = {
  activeCountry: CountryValue
  onCountrySwitch: (value: CountryValue) => void
}

export function ListingsHeader({
  activeCountry,
  onCountrySwitch,
}: ListingsHeaderProps) {
  const t = useTranslations("listingsResults")

  return (
    <div>
      <div
        className={cn(
          "flex items-center justify-center gap-4",
          "type-body-2 text-primary",
        )}
      >
        <button
          type="button"
          onClick={() => onCountrySwitch("it")}
          className={cn(
            "transition-opacity duration-100",
            "opacity-100 hover:opacity-100",
            activeCountry !== "it" ? "opacity-50 cursor-pointer" : "",
          )}
          aria-pressed={activeCountry === "it"}
          disabled={activeCountry === "it"}
        >
          {t("countryItaly")}
        </button>

        <span aria-hidden="true">|</span>

        <button
          type="button"
          onClick={() => onCountrySwitch("intl")}
          className={cn(
            "transition-opacity duration-100",
            "opacity-100 hover:opacity-100",
            activeCountry !== "intl" ? "opacity-50 cursor-pointer" : "",
          )}
          aria-pressed={activeCountry === "intl"}
          disabled={activeCountry === "intl"}
        >
          {t("countryInternational")}
        </button>
      </div>

      <h1 className={cn("type-display-1 text-primary text-center", "mt-12")}>
        {t("headerTitle")}
      </h1>
      <p className="type-body-2 text-primary text-center mt-6">
        {t("headerDescription")}
      </p>
    </div>
  )
}
