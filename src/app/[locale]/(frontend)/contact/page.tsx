import type { Metadata } from "next"
import type { AppLocale } from "@/i18n/routing"

import { buildPageMetadataByKey } from "@/seo/page-metadata"

import { Container } from "@/components/ui/Container"
import { LocationMap } from "@/components/LocationMap"

const CONTACT_OFFICE_LAT = 45.47754073006904
const CONTACT_OFFICE_LNG = 9.199793510511462

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: localeParam } = await params
  return buildPageMetadataByKey("contact", localeParam as AppLocale)
}

export default function ContactPage() {
  return (
    <main className="w-full overflow-x-clip md:pt-32">
      <Container className="pt-20 md:pt-10">
        <section className="my-16 md:my-32">
          <LocationMap
            lat={CONTACT_OFFICE_LAT}
            lng={CONTACT_OFFICE_LNG}
            location={null}
          />
        </section>
      </Container>
    </main>
  )
}
