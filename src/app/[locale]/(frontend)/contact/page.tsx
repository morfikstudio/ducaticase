import type { Metadata } from "next"
import type { AppLocale } from "@/i18n/routing"

import { sanityFetch } from "@/sanity/lib/client"
import { CACHE_TAGS } from "@/sanity/lib/cache-tags"
import { pickLocalizedString } from "@/sanity/lib/locale"
import { CONTACT_SITE_CONTENT_QUERY } from "@/sanity/lib/queries"
import type { CONTACT_SITE_CONTENT_QUERY_RESULT } from "@/sanity/types"

import { buildPageMetadataByKey } from "@/seo/page-metadata"

import { ContactHero } from "@/components/ContactHero"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: localeParam } = await params
  return buildPageMetadataByKey("contact", localeParam as AppLocale)
}

type ContactPageProps = {
  params: Promise<{ locale: string }>
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale: localeParam } = await params
  const locale = localeParam as AppLocale

  const data = (await sanityFetch({
    query: CONTACT_SITE_CONTENT_QUERY,
    revalidate: 60,
    tags: [CACHE_TAGS.siteContent],
  })) as CONTACT_SITE_CONTENT_QUERY_RESULT | null

  const page = data?.contactPage ?? null
  const title = pickLocalizedString(page?.title ?? undefined, locale) ?? ""
  const subtitle =
    pickLocalizedString(page?.subtitle ?? undefined, locale) ?? ""
  const map = page?.map
  const mapCoords =
    map != null && typeof map.lat === "number" && typeof map.lng === "number"
      ? { lat: map.lat, lng: map.lng }
      : null

  return (
    <main className="w-full overflow-x-clip pt-32 md:pt-54 pb-24 lg:pb-32">
      <ContactHero
        title={title}
        heroLandscape={page?.heroImage?.imageLandscape}
        heroPortrait={page?.heroImage?.imagePortrait}
        subtitle={subtitle}
        text={page?.text}
        email={page?.info?.email?.trim() ?? ""}
        phone={page?.info?.phone?.trim() ?? ""}
        whatsapp={page?.info?.whatsapp?.trim() ?? ""}
        address={page?.info?.address?.trim() ?? ""}
        mapCoords={mapCoords}
        locale={locale}
      />
    </main>
  )
}
