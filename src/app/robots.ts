import type { MetadataRoute } from "next"

import { isSeoEnabled } from "@/seo/seo-flag"
import { getSiteOrigin } from "@/seo/site-url"

export default function robots(): MetadataRoute.Robots {
  if (!isSeoEnabled()) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    }
  }

  const origin = getSiteOrigin()

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/studio", "/api/", "/*/preview/", "/*/brochure/"],
      },
    ],
    sitemap: `${origin}/sitemap.xml`,
  }
}
