import type { AppLocale } from "@/i18n/routing"

import { sanityFetch } from "@/sanity/lib/client"
import { pickLocalizedString } from "@/sanity/lib/locale"
import { ABOUT_SITE_CONTENT_QUERY } from "@/sanity/lib/queries"
import type { ABOUT_SITE_CONTENT_QUERY_RESULT } from "@/sanity/types"

import { HeroText } from "@/components/HeroText"
import { SplitSection } from "@/components/SplitSection"
import { AboutSection } from "@/components/AboutSection"
import { FeatureGrid } from "@/components/FeatureGrid"
import { SplitBanner } from "@/components/SplitBanner"

type AboutPageProps = {
  params: Promise<{ locale: string }>
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale: localeParam } = await params
  const locale = localeParam as AppLocale

  const data = (await sanityFetch({
    query: ABOUT_SITE_CONTENT_QUERY,
    revalidate: 60,
  })) as ABOUT_SITE_CONTENT_QUERY_RESULT

  // HERO SECTION
  const heroText =
    pickLocalizedString(data?.aboutPage?.heroText ?? undefined, locale) ?? ""
  const heroDesktop = data?.aboutPage?.heroImages?.imageDesktop
  const heroMobile = data?.aboutPage?.heroImages?.imageMobile
  const hasHeroSection = heroText.trim() !== "" || heroDesktop || heroMobile

  // HISTORY BLOCKS SECTION
  const blocks = data?.aboutPage?.historySection ?? []
  const hasHistorySection = blocks.length > 0

  // TODAY SECTION
  const today = data?.aboutPage?.todaySection
  const todayTitle =
    pickLocalizedString(today?.title ?? undefined, locale) ?? ""
  const todaySubtitle =
    pickLocalizedString(today?.subtitle ?? undefined, locale) ?? ""
  const todayText = pickLocalizedString(today?.text ?? undefined, locale) ?? ""
  const hasTodaySection =
    todayTitle.trim() !== "" ||
    todaySubtitle.trim() !== "" ||
    todayText.trim() !== ""

  // SECTORS SECTION
  const sectorsRaw = data?.aboutPage?.sectorsSection ?? []
  const sectorsWithImage = sectorsRaw.filter(
    (
      block,
    ): block is (typeof sectorsRaw)[number] & {
      image: NonNullable<(typeof sectorsRaw)[number]["image"]>
    } => Boolean(block.image?.asset),
  )
  const hasSectorsSection = sectorsWithImage.length > 0
  const sectorsHeading =
    pickLocalizedString(
      data?.aboutPage?.sectorsHeading ?? undefined,
      locale,
    )?.trim() || "I settori in cui operiamo"
  const sectorItems = sectorsWithImage.map((block) => ({
    _key: block._key,
    title: pickLocalizedString(block.title ?? undefined, locale) ?? "",
    text: pickLocalizedString(block.text ?? undefined, locale) ?? "",
    image: block.image,
  }))

  // HIGHLIGHTS SECTION
  const highlightsRaw = data?.aboutPage?.highlightsSection ?? []
  const highlightsWithImage = highlightsRaw.filter((block) =>
    Boolean(block.image?.asset),
  )
  const hasHighlightsSection = highlightsWithImage.length > 0

  return (
    <main className="w-full overflow-x-clip">
      {/* hero section */}
      {hasHeroSection ? (
        <section>
          <HeroText
            text={heroText}
            locale={locale}
            heroLandscape={heroDesktop}
            heroPortrait={heroMobile}
          />
        </section>
      ) : null}

      {/* history blocks */}
      {hasHistorySection ? (
        <section>
          {blocks.map((block) => {
            const title =
              pickLocalizedString(block.title ?? undefined, locale) ?? ""
            const subtitle =
              pickLocalizedString(block.subtitle ?? undefined, locale) ?? ""
            const desktop = block.images?.imageDesktop
            const mobile = block.images?.imageMobile

            return (
              <div className="w-full" key={block._key}>
                <SplitSection
                  title={title}
                  subtitle={subtitle}
                  body={block.body ?? undefined}
                  locale={locale}
                  imageLandscape={desktop}
                  imagePortrait={mobile}
                  reverse={block.reverse === true}
                />
              </div>
            )
          })}
        </section>
      ) : null}

      {/* today section */}
      {hasTodaySection && (
        <section>
          <AboutSection
            title={todayTitle}
            subtitle={todaySubtitle}
            text={todayText}
          />
        </section>
      )}

      {/* sectors section */}
      {hasSectorsSection ? (
        <section>
          <FeatureGrid
            heading={sectorsHeading}
            items={sectorItems}
            locale={locale}
          />
        </section>
      ) : null}

      {/* highlights section */}
      {hasHighlightsSection ? (
        <section>
          {highlightsWithImage.map((block, index) => {
            const title =
              pickLocalizedString(block.title ?? undefined, locale) ?? ""
            const description =
              pickLocalizedString(block.text ?? undefined, locale) ?? ""
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
                reverse={index % 2 === 0}
              />
            )
          })}
        </section>
      ) : null}
    </main>
  )
}
