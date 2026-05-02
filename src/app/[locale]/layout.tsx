import { notFound } from "next/navigation"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"

import { HtmlLangAttr } from "@/components/i18n/HtmlLangAttr"
import { SiteJsonLd } from "@/components/seo/SiteJsonLd"
import { routing, type AppLocale } from "@/i18n/routing"

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
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
      <SiteJsonLd locale={locale as AppLocale} />
      <HtmlLangAttr />
      {children}
    </NextIntlClientProvider>
  )
}
