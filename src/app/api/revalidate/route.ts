import { revalidatePath, revalidateTag } from "next/cache"
import { type NextRequest, NextResponse } from "next/server"
import { parseBody } from "next-sanity/webhook"

import { CACHE_TAGS } from "@/sanity/lib/cache-tags"

type RevalidateWebhookPayload = {
  paths?: string[]
  tags?: string[]
}

function revalidateListingExtras() {
  revalidatePath("/sitemap.xml")
}

function revalidateSiteContentLayout() {
  revalidatePath("/it", "layout")
  revalidatePath("/en", "layout")
}

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.SANITY_REVALIDATE_SECRET
    if (!secret) {
      return new Response("Missing environment variable SANITY_REVALIDATE_SECRET", {
        status: 500,
      })
    }

    const { isValidSignature, body } =
      await parseBody<RevalidateWebhookPayload>(req, secret, true)

    if (!isValidSignature) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 401 })
    }

    const paths = body?.paths ?? []
    const tags = body?.tags ?? []

    if (paths.length === 0 && tags.length === 0) {
      return NextResponse.json(
        { message: "No paths or tags to revalidate" },
        { status: 400 },
      )
    }

    for (const tag of tags) {
      revalidateTag(tag, "max")
    }

    for (const path of paths) {
      revalidatePath(path)
    }

    if (tags.includes(CACHE_TAGS.listing) || tags.some((t) => t.startsWith("listing:"))) {
      revalidateListingExtras()
    }

    if (tags.includes(CACHE_TAGS.siteContent)) {
      revalidateSiteContentLayout()
    }

    return NextResponse.json({
      revalidated: true,
      paths,
      tags,
    })
  } catch (err: unknown) {
    console.error(err)
    const message = err instanceof Error ? err.message : "Unknown error"
    return new Response(message, { status: 500 })
  }
}
