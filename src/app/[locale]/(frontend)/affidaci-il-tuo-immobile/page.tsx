import type { Metadata } from "next"
import { type AppLocale } from "@/i18n/routing"

import { sanityFetch } from "@/sanity/lib/client"
import { pickLocalizedString } from "@/sanity/lib/locale"
import { LIST_YOUR_PROPERTY_SITE_CONTENT_QUERY } from "@/sanity/lib/queries"
import type { LIST_YOUR_PROPERTY_SITE_CONTENT_QUERY_RESULT } from "@/sanity/types"

import { buildPageMetadataByKey } from "@/seo/page-metadata"

import { cn } from "@/utils/classNames"
import { normalizePathnameForIntlLink } from "@/utils/navigation"

import { BannerText } from "@/components/BannerText"
import { Cover } from "@/components/Cover"
import { HeroContent } from "@/components/HeroContent"
import { ImageFeatureList } from "@/components/ImageFeatureList"
import { StickyTextBlocks } from "@/components/StickyTextBlocks"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: localeParam } = await params
  return buildPageMetadataByKey("listYourProperty", localeParam as AppLocale)
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
    Boolean(page?.heroPayoff1) ||
    Boolean(page?.heroPayoff2) ||
    showCta ||
    Boolean(heroLandscape?.asset ?? heroPortrait?.asset)

  /* COVER 1 */
  const cover1 = page?.cover1Image
  const cover1Landscape = cover1?.imageLandscape
  const cover1Portrait = cover1?.imagePortrait
  const hasCover1 = Boolean(cover1Landscape?.asset ?? cover1Portrait?.asset)

  /* SERVICES */
  const servicesTitle =
    pickLocalizedString(page?.servicesTitle ?? undefined, locale) ?? ""
  const servicesSubtitle = page?.servicesSubtitle ?? null
  const servicesItems =
    page?.servicesItems?.map((item, index) => ({
      key: item._key ?? String(index),
      title: pickLocalizedString(item.title ?? undefined, locale) ?? "",
      text: item.text,
    })) ?? []

  const servicesCta = page?.servicesCta
  const servicesCtaPath = servicesCta?.path?.trim() ?? ""

  const servicesCtaHref =
    servicesCtaPath !== ""
      ? normalizePathnameForIntlLink(servicesCtaPath)
      : undefined
  const servicesCtaLabel =
    pickLocalizedString(servicesCta?.label ?? undefined, locale) ?? ""
  const hasServices = Boolean(
    servicesTitle ?? servicesSubtitle ?? servicesItems?.length,
  )

  /* COVER 2 */
  const cover2 = page?.cover2Image
  const cover2Landscape = cover2?.imageLandscape
  const cover2Portrait = cover2?.imagePortrait
  const hasCover2 = Boolean(cover2Landscape?.asset ?? cover2Portrait?.asset)

  /* VALUES */
  const valuesTitle = page?.valuesTitle
  const valuesSubtitle = page?.valuesSubtitle
  const valuesItems = page?.valuesItems
  const valuesCta = page?.valuesCta
  const valuesCtaPath = valuesCta?.path?.trim() ?? ""
  const valuesCtaHref =
    valuesCtaPath !== ""
      ? normalizePathnameForIntlLink(valuesCtaPath)
      : undefined
  const valuesImage = page?.valuesImage
  const hasValues = Boolean(
    valuesTitle ?? valuesSubtitle ?? valuesItems ?? valuesCta,
  )

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
    <main className={cn("w-full", "overflow-x-clip", "pt-32 md:pt-54")}>
      {hasHero ? (
        <section>
          <HeroContent
            locale={locale}
            title={title}
            subtitle={subtitle}
            payoff1={page?.heroPayoff1}
            payoff2={page?.heroPayoff2}
            imageLandscape={heroLandscape}
            imagePortrait={heroPortrait}
            ctaLabel={showCta ? ctaLabel : undefined}
            ctaHref={ctaHref}
          />
        </section>
      ) : null}

      {hasCover1 ? (
        <section>
          <Cover
            locale={locale}
            imageLandscape={cover1Landscape}
            imagePortrait={cover1Portrait}
          />
        </section>
      ) : null}

      {hasServices ? (
        <section>
          <StickyTextBlocks
            locale={locale}
            title={servicesTitle}
            subtitle={servicesSubtitle}
            ctaLabel={servicesCtaLabel}
            ctaHref={servicesCtaHref}
            items={servicesItems}
          />
        </section>
      ) : null}

      {hasCover2 ? (
        <section>
          <Cover
            locale={locale}
            imageLandscape={cover2Landscape}
            imagePortrait={cover2Portrait}
          />
        </section>
      ) : null}

      {hasValues ? (
        <section>
          <ImageFeatureList
            locale={locale}
            title={valuesTitle}
            subtitle={valuesSubtitle}
            items={valuesItems}
            ctaLabel={valuesCta?.label}
            ctaHref={valuesCtaHref}
            image={valuesImage}
          />
        </section>
      ) : null}

      {hasBanner ? (
        <section>
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
