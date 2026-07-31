const LOCAL_ORIGIN = "http://localhost:3000"

let missingOriginReported = false

function normalize(origin: string): string {
  return origin.replace(/\/$/, "")
}

export function getSiteOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim()

  if (explicit) {
    return normalize(explicit)
  }

  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()

  if (vercelHost) {
    return normalize(
      /^https?:\/\//i.test(vercelHost) ? vercelHost : `https://${vercelHost}`,
    )
  }

  if (process.env.NODE_ENV === "production" && !missingOriginReported) {
    missingOriginReported = true
    console.error(
      "[seo] NEXT_PUBLIC_SITE_URL non impostata: canonical, hreflang, og:image e sitemap useranno " +
        `${LOCAL_ORIGIN} e le anteprime social non funzioneranno.`,
    )
  }

  return LOCAL_ORIGIN
}
