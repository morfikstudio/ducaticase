import { NextResponse } from "next/server"

import { sanityFetch } from "@/sanity/lib/client"
import { LISTING_BY_ID_QUERY } from "@/sanity/lib/queries"
import { pickLocalizedString } from "@/sanity/lib/locale"
import type { LISTING_BY_ID_QUERY_RESULT } from "@/sanity/types"
import type { AppLocale } from "@/i18n/routing"

import { launchBrowser } from "@/lib/brochure/launchBrowser"
import { mergeFloorPlans } from "@/lib/brochure/mergeFloorPlans"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 60

type Params = { locale: string; id: string }

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80)
}

export async function GET(
  request: Request,
  { params }: { params: Promise<Params> },
) {
  const { locale, id } = await params
  const origin = new URL(request.url).origin
  const targetUrl = `${origin}/${locale}/brochure/${id}`

  const listing = (await sanityFetch({
    query: LISTING_BY_ID_QUERY,
    params: { id },
    revalidate: 0,
  })) as LISTING_BY_ID_QUERY_RESULT

  const title =
    (listing?.content
      ? pickLocalizedString(listing.content.title, locale as AppLocale)
      : null) ?? "brochure"
  const asciiFilename = `${slugify(title)}.pdf`
  const utf8Filename = encodeURIComponent(`${title}.pdf`)

  const browser = await launchBrowser()
  try {
    const page = await browser.newPage()
    await page.emulateMediaType("print")
    await page.goto(targetUrl, { waitUntil: "networkidle0", timeout: 45_000 })

    const brochurePdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    })

    const finalPdf = listing?.floorPlans
      ? await mergeFloorPlans(brochurePdf as Uint8Array, listing.floorPlans)
      : (brochurePdf as Uint8Array)

    return new NextResponse(finalPdf as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${asciiFilename}"; filename*=UTF-8''${utf8Filename}`,
        "Cache-Control": "private, no-store",
      },
    })
  } finally {
    await browser.close()
  }
}
