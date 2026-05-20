import { COMPANY_EMAIL } from "@/sanity/lib/constants"

export function buildCompanyMailtoHref(subject: string): string {
  return `mailto:${COMPANY_EMAIL}?subject=${encodeURIComponent(subject)}`
}
