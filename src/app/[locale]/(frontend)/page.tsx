import type { AppLocale } from "@/i18n/routing"
import { getTranslations } from "next-intl/server"

import { sanityFetch } from "@/sanity/lib/client"
import {
  pickLocalizedPortableText,
  pickLocalizedString,
} from "@/sanity/lib/locale"
import { HOME_SITE_CONTENT_QUERY } from "@/sanity/lib/queries"
import type {
  HOME_SITE_CONTENT_QUERY_RESULT,
  LISTINGS_PREVIEW_QUERY_RESULT,
} from "@/sanity/types"

import { cn } from "@/utils/classNames"

import { IntroSection } from "@/components/IntroSection"
import { ListingsCarousel } from "@/components/ListingsCarousel"
import { MainHero } from "@/components/MainHero"
import { PartnersSection } from "@/components/PartnersSection"
import { QuoteCarousel } from "@/components/QuoteCarousel"
import { SplitBanner } from "@/components/SplitBanner"
import { StatementHero } from "@/components/StatementHero"
import { WaveText } from "@/components/WaveText"

function portableTextHasBlocks(
  text: Parameters<typeof pickLocalizedPortableText>[0],
  locale: AppLocale,
): boolean {
  const blocks = pickLocalizedPortableText(text, locale)
  return Array.isArray(blocks) && blocks.length > 0
}

function pathWithLocalePrefix(locale: AppLocale, path: string): string {
  const trimmed = path.trim()
  const normalized =
    trimmed === "" ? "/" : trimmed.startsWith("/") ? trimmed : `/${trimmed}`
  if (normalized === "/") return `/${locale}`
  return `/${locale}${normalized}`
}

function portableTextToPlain(
  text: Parameters<typeof pickLocalizedPortableText>[0],
  locale: AppLocale,
): string {
  const picked = pickLocalizedPortableText(text, locale)
  if (!Array.isArray(picked)) return ""
  const lines: string[] = []
  for (const block of picked) {
    if (
      !block ||
      typeof block !== "object" ||
      (block as { _type?: string })._type !== "block"
    ) {
      continue
    }
    const children = (block as { children?: Array<{ text?: string }> }).children
    if (!Array.isArray(children)) continue
    const segment = children.map((c) => c.text ?? "").join("")
    const t = segment.trim()
    if (t) lines.push(t)
  }
  return lines.join("\n\n")
}

type PageProps = {
  params: Promise<{ locale: string }>
}

type ListingPreviewEntry = LISTINGS_PREVIEW_QUERY_RESULT[number]

function isListingPreviewWithImage(
  entry: unknown,
): entry is ListingPreviewEntry {
  if (!entry || typeof entry !== "object" || !("_id" in entry)) {
    return false
  }
  const mainImage = (entry as { mainImage?: { asset?: unknown } }).mainImage
  return Boolean(mainImage?.asset)
}

export default async function Page({ params }: PageProps) {
  const { locale: localeParam } = await params
  const locale = localeParam as AppLocale

  const data = (await sanityFetch({
    query: HOME_SITE_CONTENT_QUERY,
    revalidate: 60,
  })) as HOME_SITE_CONTENT_QUERY_RESULT

  // HERO
  const hero = data?.homePage
  const heroTitle =
    pickLocalizedString(hero?.heroTitle ?? undefined, locale) ?? ""
  const heroLandscape = hero?.heroImage?.imageLandscape
  const heroPortrait = hero?.heroImage?.imagePortrait
  const hasHero =
    heroTitle.trim() !== "" ||
    Boolean(heroLandscape?.asset ?? heroPortrait?.asset)

  // INTRO
  const whoCta = hero?.whoWeAreCta
  const whoCtaLabel =
    pickLocalizedString(whoCta?.label ?? undefined, locale) ?? ""
  const whoCtaPath = whoCta?.path?.trim() ?? ""
  const showWhoCta = whoCtaLabel.trim() !== "" && whoCtaPath !== ""
  const whoCtaHref = showWhoCta
    ? pathWithLocalePrefix(locale, whoCtaPath)
    : undefined
  const hasIntro =
    portableTextHasBlocks(hero?.whoWeAreText1, locale) ||
    portableTextHasBlocks(hero?.whoWeAreText2, locale) ||
    showWhoCta

  // PAYOFF
  const payoffTitle =
    pickLocalizedString(hero?.payoffTitle ?? undefined, locale) ?? ""
  const payoffImage = hero?.payoffImage
  const payoffLandscape = payoffImage?.imageLandscape
  const payoffPortrait = payoffImage?.imagePortrait
  const hasPayoff =
    payoffTitle.trim() !== "" ||
    Boolean(payoffLandscape?.asset ?? payoffPortrait?.asset)

  // HIGHLIGHTS
  const highlightsRaw = hero?.highlights ?? []
  const highlightsWithImage = highlightsRaw.filter((block) =>
    Boolean(block.image?.asset),
  )
  const hasHighlights = highlightsWithImage.length > 0

  // FEATURED LISTINGS
  const tHome = await getTranslations({ locale, namespace: "homePage" })
  const featuredRaw = hero?.featuredListings ?? []
  const featuredEntries = featuredRaw.filter(isListingPreviewWithImage)
  const hasFeaturedListings = featuredEntries.length > 0

  // TESTIMONIALS
  const testimonialsRaw = hero?.testimonials ?? []
  const testimonialEntries = testimonialsRaw.filter((t) =>
    portableTextHasBlocks(t.text, locale),
  )
  const hasTestimonials = testimonialEntries.length > 0
  const testimonialsTitle =
    pickLocalizedString(hero?.testimonialsTitle ?? undefined, locale) ?? ""
  const testimonialsSubtitle =
    pickLocalizedString(hero?.testimonialsSubtitle ?? undefined, locale) ?? ""

  // PARTNERS
  const partnersRaw = hero?.partners ?? []
  const partnersWithImage = partnersRaw.filter((p) => Boolean(p.image?.asset))
  const hasPartners = partnersWithImage.length > 0

  return (
    <main className="w-full overflow-x-clip">
      {/* HERO */}
      {hasHero ? (
        <section>
          <MainHero
            locale={locale}
            title={heroTitle}
            imageLandscape={heroLandscape}
            imagePortrait={heroPortrait}
          />
        </section>
      ) : null}

      {/* INTRO */}
      {hasIntro ? (
        <section className="py-24 md:py-32 lg:py-48">
          <IntroSection
            locale={locale}
            text1={hero?.whoWeAreText1 ?? undefined}
            text2={hero?.whoWeAreText2 ?? undefined}
            ctaLabel={showWhoCta ? whoCtaLabel : undefined}
            ctaHref={whoCtaHref}
          />
        </section>
      ) : null}

      {/* PAYOFF */}
      {hasPayoff ? (
        <section className="lg:pb-58">
          <StatementHero
            locale={locale}
            title={payoffTitle}
            imageLandscape={payoffLandscape}
            imagePortrait={payoffPortrait}
          />
        </section>
      ) : null}

      {/* HIGHLIGHTS */}
      {hasHighlights ? (
        <section>
          {highlightsWithImage.map((block, index) => {
            const title =
              pickLocalizedString(block.title ?? undefined, locale) ?? ""
            const description = portableTextToPlain(
              block.text ?? undefined,
              locale,
            )
            const imageAlt =
              pickLocalizedString(block.image?.alt ?? undefined, locale) ?? ""

            const ctaLabel =
              pickLocalizedString(block.cta?.label ?? undefined, locale) ?? ""
            const ctaPath = block.cta?.path?.trim() ?? ""
            const showCta = ctaLabel.trim() !== "" && ctaPath !== ""

            return (
              <SplitBanner
                key={block._key}
                title={title}
                description={description}
                ctaLabel={showCta ? ctaLabel : undefined}
                ctaHref={showCta ? ctaPath : undefined}
                image={block.image ?? undefined}
                locale={locale}
                imageAlt={imageAlt}
                reverse={index % 2 === 1}
              />
            )
          })}
        </section>
      ) : null}

      {/* FEATURED LISTINGS */}
      {hasFeaturedListings ? (
        <section className="py-32 md:py-48 lg:py-56">
          <ListingsCarousel
            locale={locale}
            entries={featuredEntries}
            title={tHome("featuredListingsTitle")}
          />
        </section>
      ) : null}

      {/* TESTIMONIALS */}
      {hasTestimonials ? (
        <section>
          <QuoteCarousel
            locale={locale}
            subtitle={testimonialsSubtitle}
            title={testimonialsTitle}
            items={testimonialEntries}
          />
        </section>
      ) : null}

      {/* CONTACT US */}
      <section className="py-56 lg:py-64">
        <WaveText
          word1={tHome("contactSectionWord1")}
          word2={tHome("contactSectionWord2")}
          href="/contact"
        />
      </section>

      {/* PARTNERS */}
      {hasPartners ? (
        <section
          className={cn("py-32 md:py-40 lg:py-52", "bg-white text-accent")}
        >
          <PartnersSection
            title={tHome("partnersSectionTitle")}
            partners={partnersWithImage}
          />
        </section>
      ) : null}
    </main>
  )
}
