import { routing, type AppLocale } from "@/i18n/routing"

import { sanityFetch } from "@/sanity/lib/client"
import { pickLocalizedString } from "@/sanity/lib/locale"
import { LIST_YOUR_PROPERTY_SITE_CONTENT_QUERY } from "@/sanity/lib/queries"
import type { LIST_YOUR_PROPERTY_SITE_CONTENT_QUERY_RESULT } from "@/sanity/types"

import { cn } from "@/utils/classNames"

import { BannerText } from "@/components/BannerText"
import { Cover } from "@/components/Cover"
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

  /* COVER 1 */
  const cover1 = page?.cover1Image
  const cover1Landscape = cover1?.imageLandscape
  const cover1Portrait = cover1?.imagePortrait
  const hasCover1 = Boolean(cover1Landscape?.asset ?? cover1Portrait?.asset)

  /* COVER 2 */
  const cover2 = page?.cover2Image
  const cover2Landscape = cover2?.imageLandscape
  const cover2Portrait = cover2?.imagePortrait
  const hasCover2 = Boolean(cover2Landscape?.asset ?? cover2Portrait?.asset)

  /* BANNER */
  const bannerTitle = page?.bannerTitle
  const bannerText = page?.bannerText
  const bannerCta = page?.bannerCta
  const bannerCtaPath = bannerCta?.path?.trim() ?? ""
  const bannerCtaHref =
    bannerCtaPath !== ""
      ? normalizePathnameForIntlLink(bannerCtaPath)
      : undefined
  const bannerCtaLabel = bannerCta?.label
  const hasBanner = Boolean(bannerTitle ?? bannerText ?? bannerCta)

  return (
    <main className={cn("w-full overflow-x-clip", "pt-32 md:pt-54")}>
      {hasHero ? (
        <section aria-label="Hero">
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

      {hasCover1 ? (
        <section aria-label="Cover 1">
          <Cover
            locale={locale}
            imageLandscape={cover1Landscape}
            imagePortrait={cover1Portrait}
          />
        </section>
      ) : null}

      {hasCover2 ? (
        <section aria-label="Cover 2">
          <Cover
            locale={locale}
            imageLandscape={cover2Landscape}
            imagePortrait={cover2Portrait}
          />
        </section>
      ) : null}

      {hasBanner ? (
        <section aria-label="Banner">
          <BannerText
            locale={locale}
            title={bannerTitle}
            text={bannerText}
            ctaLabel={bannerCtaLabel}
            ctaHref={bannerCtaHref}
          />
        </section>
      ) : null}
    </main>
  )
}
