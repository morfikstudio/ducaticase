import { notFound } from "next/navigation"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"
import type { Metadata } from "next"

import { HtmlLangAttr } from "@/components/i18n/HtmlLangAttr"
import { routing } from "@/i18n/routing"

const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true"
const shouldIndex = process.env.NODE_ENV === "production" && allowIndexing

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const title = "Ducati Case"
  const description =
    locale === "en"
      ? "Ducati Case — real estate agency"
      : "Ducati Case — agenzia immobiliare"

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  const metadataBase =
    siteUrl !== undefined && siteUrl !== "" ? new URL(siteUrl) : undefined

  return {
    metadataBase: metadataBase ?? undefined,
    title,
    description,
    robots: {
      index: shouldIndex,
      follow: shouldIndex,
      nocache: !shouldIndex,
      googleBot: {
        index: shouldIndex,
        follow: shouldIndex,
        nocache: !shouldIndex,
      },
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        it: "/it",
        en: "/en",
      },
    },
  }
}

export default async function LocaleRootLayout({ children, params }: Props) {
  const { locale } = await params

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <HtmlLangAttr />
      {children}
    </NextIntlClientProvider>
  )
}
