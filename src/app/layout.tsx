import { Geist_Mono } from "next/font/google"
import localFont from "next/font/local"

import "./globals.css"
import { cn } from "@/utils/classNames"

const helvetica = localFont({
  src: [
    {
      path: "../../public/fonts/HelveticaNeue-Medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-helvetica",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
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
      className={cn(helvetica.variable, geistMono.variable)}
      suppressHydrationWarning
    >
      <body className="relative bg-white font-sans font-normal">
        {children}
      </body>
    </html>
  )
}
