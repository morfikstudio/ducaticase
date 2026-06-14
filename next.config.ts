import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts")

const enableFetchLogging = process.env.NEXT_FETCH_LOGGING === "true"

const nextConfig: NextConfig = {
  env: {
    SANITY_STUDIO_LISTING_PREVIEW_SECRET:
      process.env.SANITY_STUDIO_LISTING_PREVIEW_SECRET,
  },
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
  logging: enableFetchLogging
    ? {
        fetches: {
          fullUrl: true,
        },
      }
    : false,
}

export default withNextIntl(nextConfig)
