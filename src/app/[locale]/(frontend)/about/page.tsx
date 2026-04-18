import type { AppLocale } from "@/i18n/routing"

import { sanityFetch } from "@/sanity/lib/client"
import { pickLocalizedString } from "@/sanity/lib/locale"
import { ABOUT_SITE_CONTENT_QUERY } from "@/sanity/lib/queries"
import type { ABOUT_SITE_CONTENT_QUERY_RESULT } from "@/sanity/types"

import { HeroText } from "@/components/HeroText"
import { SplitSection } from "@/components/SplitSection"
import { AboutSection } from "@/components/AboutSection"

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

  const heroText =
    pickLocalizedString(data?.aboutPage?.heroText ?? undefined, locale) ?? ""

  const heroDesktop = data?.aboutPage?.heroImages?.imageDesktop
  const heroMobile = data?.aboutPage?.heroImages?.imageMobile

  const blocks = data?.aboutPage?.historySection ?? []

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

  return (
    <main className="w-full overflow-x-clip">
      <section>
        <HeroText
          text={heroText}
          locale={locale}
          heroLandscape={heroDesktop}
          heroPortrait={heroMobile}
        />
      </section>

      {/* history blocks */}
      {blocks.map((block) => {
        const title =
          pickLocalizedString(block.title ?? undefined, locale) ?? ""
        const subtitle =
          pickLocalizedString(block.subtitle ?? undefined, locale) ?? ""
        const desktop = block.images?.imageDesktop
        const mobile = block.images?.imageMobile

        return (
          <section key={block._key}>
            <SplitSection
              title={title}
              subtitle={subtitle}
              body={block.body ?? undefined}
              locale={locale}
              imageLandscape={desktop}
              imagePortrait={mobile}
              reverse={block.reverse === true}
            />
          </section>
        )
      })}

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
    </main>
  )
}
