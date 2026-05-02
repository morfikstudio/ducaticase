import type { AppLocale } from "@/i18n/routing"
import type { FOOTER_SITE_CONTENT_QUERY_RESULT } from "@/sanity/types"
import siteSeo from "@/seo/main.json"
import { absoluteUrl, buildLocalizedPathname } from "@/seo/page-metadata"
import type { SiteSeoConfig } from "@/seo/types"
import { getSiteOrigin } from "@/seo/site-url"

export function buildSiteJsonLdGraph(args: {
  locale: AppLocale
  footer: FOOTER_SITE_CONTENT_QUERY_RESULT
}): Record<string, unknown> {
  const origin = getSiteOrigin()
  const cfg = siteSeo as SiteSeoConfig
  const site = cfg.site[args.locale]
  const homePath = buildLocalizedPathname(args.locale, "/")
  const siteUrl = absoluteUrl(origin, homePath)
  const orgId = `${siteUrl}#organization`
  const websiteId = `${siteUrl}#website`
  const logoUrl = absoluteUrl(origin, "/images/og-default.jpg")

  const footerBlock = args.footer?.footer
  const streetAddress = [footerBlock?.addressLine1, footerBlock?.addressLine2]
    .filter(Boolean)
    .join(", ")
    .trim()

  const organization: Record<string, unknown> = {
    "@type": "RealEstateAgent",
    "@id": orgId,
    name: site.name,
    description: site.defaultDescription,
    url: siteUrl,
    logo: logoUrl,
  }

  if (streetAddress) {
    organization.address = {
      "@type": "PostalAddress",
      streetAddress,
    }
  }
  if (footerBlock?.email) {
    organization.email = footerBlock.email
  }
  if (footerBlock?.phone) {
    organization.telephone = footerBlock.phone
  }

  const inLanguage = args.locale === "it" ? "it-IT" : "en-US"

  const website: Record<string, unknown> = {
    "@type": "WebSite",
    "@id": websiteId,
    url: siteUrl,
    name: site.name,
    description: site.defaultDescription,
    inLanguage,
    publisher: { "@id": orgId },
  }

  return {
    "@context": "https://schema.org",
    "@graph": [organization, website],
  }
}
