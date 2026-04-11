import type { AppLocale } from "@/i18n/routing"
import { sanityFetch } from "@/sanity/lib/client"
import { FOOTER_SITE_CONTENT_QUERY } from "@/sanity/lib/queries"
import type { FOOTER_SITE_CONTENT_QUERY_RESULT } from "@/sanity/types"

import LenisProvider from "@/components/providers/LenisProvider"
import BreakpointProvider from "@/components/providers/BreakpointProvider"
import FocusVisibleModality from "@/components/providers/FocusVisibleProvider"
import Footer from "@/components/footer"

import { footerContentFromSanity } from "@/lib/formatFooterContent"

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

  const footerDoc = (await sanityFetch({
    query: FOOTER_SITE_CONTENT_QUERY,
    revalidate: 60,
  })) as FOOTER_SITE_CONTENT_QUERY_RESULT

  const footerContent = footerContentFromSanity(footerDoc, locale)

  return (
    <LenisProvider>
      <div className="flex min-h-screen flex-col">
        <div className="flex-1">{children}</div>
        <Footer content={footerContent} />
      </div>

      <BreakpointProvider />
      <FocusVisibleModality />
    </LenisProvider>
  )
}
