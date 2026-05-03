import type { Metadata } from "next"
import type { AppLocale } from "@/i18n/routing"

import { sanityFetch } from "@/sanity/lib/client"
import {
  pickLocalizedPortableText,
  pickLocalizedString,
} from "@/sanity/lib/locale"
import { CONTACT_SITE_CONTENT_QUERY } from "@/sanity/lib/queries"
import type { CONTACT_SITE_CONTENT_QUERY_RESULT } from "@/sanity/types"

import { buildPageMetadataByKey } from "@/seo/page-metadata"

import { LocationMap } from "@/components/LocationMap"
import { Container } from "@/components/ui/Container"
import { PortableTextComponent } from "@/components/ui/PortableText"
import { SanityImage } from "@/components/ui/SanityImage"

function whatsappHref(raw: string): string {
  const t = raw.trim()
  if (t === "") return "#"
  if (/^https?:\/\//i.test(t)) return t
  const digits = t.replace(/\D/g, "")
  return digits !== "" ? `https://wa.me/${digits}` : "#"
}

function phoneHref(raw: string): string {
  const compact = raw.replace(/\s/g, "")
  return compact !== "" ? `tel:${compact}` : "#"
}

function portableTextHasBlocks(
  text: Parameters<typeof pickLocalizedPortableText>[0],
  locale: AppLocale,
): boolean {
  const blocks = pickLocalizedPortableText(text, locale)
  return Array.isArray(blocks) && blocks.length > 0
}

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
  })) as CONTACT_SITE_CONTENT_QUERY_RESULT | null

  const page = data?.contactPage ?? null
  const title = pickLocalizedString(page?.title ?? undefined, locale) ?? ""
  const subtitle =
    pickLocalizedString(page?.subtitle ?? undefined, locale) ?? ""

  const heroLandscape = page?.heroImage?.imageLandscape
  const heroPortrait = page?.heroImage?.imagePortrait
  const hasHeroImage = Boolean(heroLandscape?.asset ?? heroPortrait?.asset)

  const hasTextBody = portableTextHasBlocks(page?.text ?? undefined, locale)

  const info = page?.info
  const email = info?.email?.trim() ?? ""
  const phone = info?.phone?.trim() ?? ""
  const whatsapp = info?.whatsapp?.trim() ?? ""
  const address = info?.address?.trim() ?? ""

  const map = page?.map
  const mapCoords =
    map != null && typeof map.lat === "number" && typeof map.lng === "number"
      ? { lat: map.lat, lng: map.lng }
      : null
  const lat = mapCoords?.lat || 0
  const lng = mapCoords?.lng || 0

  const hasIntro =
    title.trim() !== "" || subtitle.trim() !== "" || hasTextBody || hasHeroImage

  const hasContactLinks =
    email !== "" || phone !== "" || whatsapp !== "" || address !== ""

  return (
    <main className="w-full overflow-x-clip md:pt-32">
      <Container className="pt-20 md:pt-10">
        {hasIntro ? (
          <section className="mb-12 flex flex-col gap-8 md:mb-20">
            {title.trim() !== "" ? (
              <h1 className="type-heading-2 text-primary">{title}</h1>
            ) : null}
            {hasHeroImage ? (
              <div className="relative aspect-4/5 w-full max-w-3xl overflow-hidden rounded-md bg-light-gray md:aspect-video">
                <SanityImage
                  landscape={heroLandscape ?? undefined}
                  portrait={heroPortrait ?? undefined}
                  locale={locale}
                  altFallback={title}
                  landscapeParams={{
                    width: 1920,
                    height: 1080,
                    sizes: "(max-width: 767px) 100vw, min(100vw, 48rem)",
                  }}
                  portraitParams={{
                    width: 720,
                    height: 900,
                    sizes: "(max-width: 767px) 100vw, min(100vw, 48rem)",
                  }}
                  fill
                  className="object-cover object-center"
                />
              </div>
            ) : null}
            {subtitle.trim() !== "" ? (
              <p className="type-body-1 font-medium text-primary">{subtitle}</p>
            ) : null}
            {hasTextBody ? (
              <PortableTextComponent
                text={page?.text}
                locale={locale}
                className="type-body-2 text-primary max-w-2xl [&_p]:type-body-2"
              />
            ) : null}
          </section>
        ) : null}

        {hasContactLinks ? (
          <section className="type-body-2 text-primary mb-12 flex flex-col gap-3">
            {email !== "" ? (
              <a
                className="underline-offset-4 hover:underline"
                href={`mailto:${email}`}
              >
                {email}
              </a>
            ) : null}
            {phone !== "" ? (
              <a
                className="underline-offset-4 hover:underline"
                href={phoneHref(phone)}
              >
                {phone}
              </a>
            ) : null}
            {whatsapp !== "" ? (
              <a
                className="underline-offset-4 hover:underline"
                href={whatsappHref(whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {whatsapp}
              </a>
            ) : null}
            {address !== "" ? (
              <p className="whitespace-pre-line">{address}</p>
            ) : null}
          </section>
        ) : null}

        {mapCoords ? (
          <section className="my-16 md:my-32">
            <LocationMap lat={lat} lng={lng} location={null} />
          </section>
        ) : null}
      </Container>
    </main>
  )
}
