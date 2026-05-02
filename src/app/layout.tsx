import type { Metadata } from "next"
import { Inter } from "next/font/google"
import localFont from "next/font/local"

import { cn } from "@/utils/classNames"

import { routing } from "@/i18n/routing"

import siteSeo from "@/seo/main.json"
import type { SiteSeoConfig } from "@/seo/types"
import { getSiteOrigin } from "@/seo/site-url"

import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const things = localFont({
  src: [
    {
      path: "../../public/fonts/ThingsRegular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Things-Italic.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-things",
})

/* METADATA */
const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true"
const shouldIndex = process.env.NODE_ENV === "production" && allowIndexing
const siteCfg = siteSeo as SiteSeoConfig
const defaultLocale = routing.defaultLocale
const defaultSite = siteCfg.site[defaultLocale]
const defaultHome = siteCfg.home[defaultLocale]

export const metadata: Metadata = {
  metadataBase: new URL(getSiteOrigin()),
  title: {
    default: defaultHome.title,
    template: `%s | ${defaultSite.name}`,
  },
  description: defaultHome.description,
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
}

/**
 * Root layout with `<html>` / `<body>` required by Next.js and `/studio` (Sanity).
 * Routes `/it` and `/en` update `lang` via {@link HtmlLangAttr} (`components/i18n/HtmlLangAttr.tsx`) in the `[locale]` layout.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="it"
      className={cn(inter.variable, things.variable)}
      suppressHydrationWarning
    >
      <body className="relative bg-white font-sans font-normal">
        {children}
      </body>
    </html>
  )
}
