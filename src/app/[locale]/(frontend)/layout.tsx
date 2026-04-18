import type { AppLocale } from "@/i18n/routing"
import { sanityFetch } from "@/sanity/lib/client"
import {
  MENU_SITE_CONTENT_QUERY,
  FOOTER_SITE_CONTENT_QUERY,
} from "@/sanity/lib/queries"
import type {
  MENU_SITE_CONTENT_QUERY_RESULT,
  FOOTER_SITE_CONTENT_QUERY_RESULT,
} from "@/sanity/types"

import { LenisProvider } from "@/components/providers/LenisProvider"
import { BreakpointProvider } from "@/components/providers/BreakpointProvider"
import { FocusVisibleModality } from "@/components/providers/FocusVisibleProvider"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { NavBar } from "@/components/nav/NavBar"
import { Footer } from "@/components/footer"

import { footerContentFromSanity } from "@/lib/formatFooterContent"
import { menuContentFromSanity } from "@/lib/formatMenuContent"

type FrontendLayoutProps = Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>

export default async function FrontendLayout({
  children,
  params,
}: FrontendLayoutProps) {
  const { locale: localeParam } = await params
  const locale = localeParam as AppLocale

  const [menuDoc, footerDoc] = await Promise.all([
    sanityFetch({
      query: MENU_SITE_CONTENT_QUERY,
      revalidate: 60,
    }) as Promise<MENU_SITE_CONTENT_QUERY_RESULT>,
    sanityFetch({
      query: FOOTER_SITE_CONTENT_QUERY,
      revalidate: 60,
    }) as Promise<FOOTER_SITE_CONTENT_QUERY_RESULT>,
  ])

  const footerContent = footerContentFromSanity(footerDoc, locale)
  const menuContent = menuContentFromSanity(menuDoc, locale)

  return (
    <LenisProvider>
      <NavBar locale={locale} menuContent={menuContent} />
      <div className="absolute top-0 left-0 w-full z-10">
        <Breadcrumbs />
      </div>
      <div className="flex min-h-screen flex-col">
        <div className="flex-1">{children}</div>
      </div>
      <Footer content={footerContent} />
      <BreakpointProvider />
      <FocusVisibleModality />
    </LenisProvider>
  )
}
