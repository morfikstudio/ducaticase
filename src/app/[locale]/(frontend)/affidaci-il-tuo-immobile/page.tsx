import { routing, type AppLocale } from "@/i18n/routing"

import { sanityFetch } from "@/sanity/lib/client"
import { pickLocalizedString } from "@/sanity/lib/locale"
import { LIST_YOUR_PROPERTY_SITE_CONTENT_QUERY } from "@/sanity/lib/queries"
import type { LIST_YOUR_PROPERTY_SITE_CONTENT_QUERY_RESULT } from "@/sanity/types"

import { cn } from "@/utils/classNames"

import { HeroContent } from "@/components/HeroContent"

function normalizePathnameForIntlLink(path: string): string {
  const trimmed = path.trim()
  const withSlash =
    trimmed === "" || trimmed === "/"
      ? "/"
      : trimmed.startsWith("/")
        ? trimmed
        : `/${trimmed}`

  for (const loc of routing.locales) {
    const localeRoot = `/${loc}`
    if (withSlash === localeRoot) return "/"
    if (withSlash.startsWith(`${localeRoot}/`)) {
      return withSlash.slice(localeRoot.length) || "/"
    }
  }

  return withSlash
}

type PageProps = {
  params: Promise<{ locale: string }>
}

export default async function Page({ params }: PageProps) {
  const { locale: localeParam } = await params
  const locale = localeParam as AppLocale

  const data = (await sanityFetch({
    query: LIST_YOUR_PROPERTY_SITE_CONTENT_QUERY,
    revalidate: 60,
  })) as LIST_YOUR_PROPERTY_SITE_CONTENT_QUERY_RESULT

  const page = data?.listYourPropertyPage

  /* HERO */
  const hero = page?.heroImage
  const title = pickLocalizedString(page?.heroTitle ?? undefined, locale) ?? ""
  const subtitle =
    pickLocalizedString(page?.heroSubtitle ?? undefined, locale) ?? ""
  const payoff1 =
    pickLocalizedString(page?.heroPayoff1 ?? undefined, locale) ?? ""
  const payoff2 =
    pickLocalizedString(page?.heroPayoff2 ?? undefined, locale) ?? ""
  const heroLandscape = hero?.imageLandscape
  const heroPortrait = hero?.imagePortrait
  const cta = page?.heroCta
  const ctaLabel = pickLocalizedString(cta?.label ?? undefined, locale) ?? ""
  const ctaPath = cta?.path?.trim() ?? ""
  const showCta = ctaLabel.trim() !== "" && ctaPath !== ""
  const ctaHref = showCta ? normalizePathnameForIntlLink(ctaPath) : undefined
  const hasHero =
    title.trim() !== "" ||
    subtitle.trim() !== "" ||
    payoff1.trim() !== "" ||
    payoff2.trim() !== "" ||
    showCta ||
    Boolean(heroLandscape?.asset ?? heroPortrait?.asset)

  return (
    <main
      className={cn(
        "w-full overflow-x-clip",
        "pt-32 md:pt-54",
        // "pb-24",
      )}
    >
      {hasHero ? (
        <section>
          <HeroContent
            locale={locale}
            title={title}
            subtitle={subtitle}
            payoff1={payoff1}
            payoff2={payoff2}
            imageLandscape={heroLandscape}
            imagePortrait={heroPortrait}
            ctaLabel={showCta ? ctaLabel : undefined}
            ctaHref={ctaHref}
          />
        </section>
      ) : null}
    </main>
  )
}
