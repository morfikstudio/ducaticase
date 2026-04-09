import { Inter } from "next/font/google"
import localFont from "next/font/local"

import { cn } from "@/utils/classNames"

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
