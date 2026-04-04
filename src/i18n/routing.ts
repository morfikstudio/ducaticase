import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  locales: ["it", "en"],
  defaultLocale: "it",
  localePrefix: "always",
  localeDetection: false, // Otherwise `Accept-Language` (e.g. browser in English) sends `/` to `/en`
})

export type AppLocale = (typeof routing.locales)[number]
