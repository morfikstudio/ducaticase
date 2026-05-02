import type { AppLocale } from "@/i18n/routing"
import { sanityFetch } from "@/sanity/lib/client"
import { FOOTER_SITE_CONTENT_QUERY } from "@/sanity/lib/queries"
import type { FOOTER_SITE_CONTENT_QUERY_RESULT } from "@/sanity/types"
import { buildSiteJsonLdGraph } from "@/seo/json-ld/site-graph"

import { JsonLd } from "./JsonLd"

type Props = {
  locale: AppLocale
}

export async function SiteJsonLd({ locale }: Props) {
  let footer: FOOTER_SITE_CONTENT_QUERY_RESULT = null
  try {
    footer = (await sanityFetch({
      query: FOOTER_SITE_CONTENT_QUERY,
      revalidate: 3600,
    })) as FOOTER_SITE_CONTENT_QUERY_RESULT
  } catch {
    footer = null
  }

  const graph = buildSiteJsonLdGraph({ locale, footer })
  return <JsonLd data={graph} />
}
