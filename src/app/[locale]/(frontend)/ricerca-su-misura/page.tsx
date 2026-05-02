import type { Metadata } from "next"
import { type AppLocale } from "@/i18n/routing"

import { sanityFetch } from "@/sanity/lib/client"
import { pickLocalizedString } from "@/sanity/lib/locale"
import { TAILORED_SEARCH_PAGE_SITE_CONTENT_QUERY } from "@/sanity/lib/queries"
import type { TAILORED_SEARCH_PAGE_SITE_CONTENT_QUERY_RESULT } from "@/sanity/types"

import { buildPageMetadataByKey } from "@/seo/page-metadata"

import { cn } from "@/utils/classNames"
import { normalizePathnameForIntlLink } from "@/utils/navigation"

import { BannerText } from "@/components/BannerText"
import { BannerForm } from "@/components/BannerForm"
import { ContactForm } from "@/components/ContactForm"
import { Cover } from "@/components/Cover"
import { HeroContent } from "@/components/HeroContent"
import { ImageFeatureList } from "@/components/ImageFeatureList"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: localeParam } = await params
  return buildPageMetadataByKey("tayloredSearch", localeParam as AppLocale)
}

type PageProps = {
  params: Promise<{ locale: string }>
}

export default async function Page({ params }: PageProps) {
  const { locale: localeParam } = await params
  const locale = localeParam as AppLocale

  const data = (await sanityFetch({
    query: TAILORED_SEARCH_PAGE_SITE_CONTENT_QUERY,
    revalidate: 60,
  })) as TAILORED_SEARCH_PAGE_SITE_CONTENT_QUERY_RESULT

  const page = data?.tailoredSearchPage

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

  /* BANNER FORM */
  const bannerFormTitle = page?.bannerFormTitle
  const bannerFormText = page?.bannerFormText
  const bannerFormCtaLabel = page?.bannerFormCtaLabel
  const hasBannerForm = Boolean(
    bannerFormTitle ?? bannerFormText ?? bannerFormCtaLabel,
  )

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

  /* BANNER 2 */
  const banner2Title = page?.banner2Title
  const banner2Text = page?.banner2Text
  const banner2Cta = page?.banner2Cta
  const banner2CtaPath = banner2Cta?.path?.trim() ?? ""
  const banner2CtaHref =
    banner2CtaPath !== ""
      ? normalizePathnameForIntlLink(banner2CtaPath)
      : undefined
  const banner2CtaLabel = banner2Cta?.label
  const hasBanner2 = Boolean(banner2Title ?? banner2Text ?? banner2Cta)

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

      {hasBannerForm ? (
        <section>
          <BannerForm
            locale={locale}
            title={bannerFormTitle}
            text={bannerFormText}
            ctaLabel={bannerFormCtaLabel}
            ctaHref="#dc-contact-form"
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

      <section>
        <ContactForm id="dc-contact-form" />
      </section>

      {hasBanner2 ? (
        <section>
          <BannerText
            locale={locale}
            title={banner2Title}
            text={banner2Text}
            ctaLabel={banner2CtaLabel}
            ctaHref={banner2CtaHref}
          />
        </section>
      ) : null}
    </main>
  )
}
