import { getTranslations } from "next-intl/server"

import type { AppLocale } from "@/i18n/routing"
import { sanityFetch } from "@/sanity/lib/client"
import { pickLocalizedString } from "@/sanity/lib/locale"
import {
  LISTINGS_PREVIEW_QUERY,
  SITE_CONTENT_QUERY,
} from "@/sanity/lib/queries"
import type {
  LISTINGS_PREVIEW_QUERY_RESULT,
  LocalizedString,
} from "@/sanity/types"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function Page({ params }: Props) {
  const { locale: localeParam } = await params
  const locale = localeParam as AppLocale
  const t = await getTranslations("Home")

  const [site, listings] = await Promise.all([
    sanityFetch({
      query: SITE_CONTENT_QUERY,
      params: { locale },
      revalidate: 60,
    }),
    sanityFetch({
      query: LISTINGS_PREVIEW_QUERY,
      revalidate: 60,
    }),
  ])

  const listingsWithLabels = Array.isArray(listings)
    ? (listings as LISTINGS_PREVIEW_QUERY_RESULT).map((row) => ({
        ...row,
        listingLabelResolved: pickLocalizedString(
          (row as { listingLabel?: LocalizedString | null }).listingLabel,
          locale,
        ),
      }))
    : listings

  console.log("siteContent", site)
  console.log("listings preview", listingsWithLabels)

  return (
    <main>
      <span>{t("placeholder")}</span>
    </main>
  )
}
