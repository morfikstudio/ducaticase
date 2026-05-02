import type { Metadata } from "next"
import type { AppLocale } from "@/i18n/routing"

import { buildPageMetadataByKey } from "@/seo/page-metadata"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: localeParam } = await params
  return buildPageMetadataByKey("contact", localeParam as AppLocale)
}

export default function ContactPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <p>Contact Page</p>
    </main>
  )
}
