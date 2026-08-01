import type { MetadataRoute } from "next"

import { routing } from "@/i18n/routing"

import siteSeo from "@/seo/main.json"
import type { SiteSeoConfig } from "@/seo/types"

const siteCfg = siteSeo as SiteSeoConfig
const defaultLocale = routing.defaultLocale
const defaultSite = siteCfg.site[defaultLocale]

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: defaultSite.name,
    short_name: defaultSite.name,
    description: defaultSite.defaultDescription,
    lang: defaultLocale,
    /* `localePrefix` is "always", so `/` is not a valid landing page */
    start_url: `/${defaultLocale}`,
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#181818",
    icons: [
      {
        src: "/images/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/images/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  }
}
