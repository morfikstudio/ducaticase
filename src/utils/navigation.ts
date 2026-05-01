import { routing } from "@/i18n/routing"

export function normalizePathnameForIntlLink(path: string): string {
  const trimmed = path.trim()
  const withSlash =
    trimmed === "" || trimmed === "/"
      ? "/"
      : trimmed.startsWith("/")
        ? trimmed
        : `/${trimmed}`

  for (const loc of routing.locales) {
    const localeRoot = `/${loc}`
    if (withSlash === localeRoot) return "/"
    if (withSlash.startsWith(`${localeRoot}/`)) {
      return withSlash.slice(localeRoot.length) || "/"
    }
  }

  return withSlash
}
