import type { AppLocale } from "@/i18n/routing"

import { sanityFetch } from "@/sanity/lib/client"
import { pickLocalizedString } from "@/sanity/lib/locale"
import { ABOUT_SITE_CONTENT_QUERY } from "@/sanity/lib/queries"
import type { ABOUT_SITE_CONTENT_QUERY_RESULT } from "@/sanity/types"

import { AboutSection } from "@/components/AboutSection"
import { FeatureGrid } from "@/components/FeatureGrid"
import { HeroText } from "@/components/HeroText"
import { SplitBanner } from "@/components/SplitBanner"
import { SplitSectionDisplay } from "@/components/SplitSectionDisplay"
import { TeamGrid } from "@/components/TeamGrid"

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

  const historyItems = blocks.map((block) => ({
    key: block._key,
    title: pickLocalizedString(block.title ?? undefined, locale) ?? "",
    subtitle: pickLocalizedString(block.subtitle ?? undefined, locale) ?? "",
    body: block.body ?? undefined,
    locale,
    imageLandscape: block.images?.imageDesktop,
    imagePortrait: block.images?.imageMobile,
    reverse: block.reverse === true,
  }))

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

  // TEAM SECTION
  const teamSection = data?.aboutPage?.teamSection
  const teamTitle =
    pickLocalizedString(teamSection?.title ?? undefined, locale) ?? ""
  const teamSubtitle =
    pickLocalizedString(teamSection?.subtitle ?? undefined, locale) ?? ""
  const teamText =
    pickLocalizedString(teamSection?.text ?? undefined, locale) ?? ""
  const teamCtaLabel =
    pickLocalizedString(teamSection?.cta?.label ?? undefined, locale) ?? ""
  const teamCtaPath = teamSection?.cta?.path?.trim() ?? ""
  const showTeamCta = teamCtaLabel.trim() !== "" && teamCtaPath !== ""
  const teamMembers = teamSection?.teamMember ?? []
  const hasTeamSection =
    teamTitle.trim() !== "" ||
    teamSubtitle.trim() !== "" ||
    teamText.trim() !== "" ||
    teamMembers.length > 0

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

      {/* history blocks + today section as last panel */}
      {hasHistorySection ? (
        <section>
          <SplitSectionDisplay
            items={historyItems}
            lastSection={
              hasTodaySection ? (
                <AboutSection
                  title={todayTitle}
                  subtitle={todaySubtitle}
                  text={todayText}
                />
              ) : undefined
            }
          />
        </section>
      ) : null}

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

      {/* team section */}
      {hasTeamSection ? (
        <section>
          <TeamGrid
            title={teamTitle}
            subtitle={teamSubtitle}
            text={teamText}
            ctaLabel={showTeamCta ? teamCtaLabel : undefined}
            ctaHref={showTeamCta ? teamCtaPath : undefined}
            locale={locale}
            members={teamMembers}
          />
        </section>
      ) : null}
    </main>
  )
}
