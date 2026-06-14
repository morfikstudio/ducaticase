import { PDFDocument } from "pdf-lib"

import type { LISTING_BY_ID_QUERY_RESULT } from "@/sanity/types"

type Listing = NonNullable<LISTING_BY_ID_QUERY_RESULT>
type FloorPlanItem = NonNullable<
  Extract<Listing["floorPlans"], { items: unknown }>["items"]
>[number]

async function fetchBytes(url: string): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    return await res.arrayBuffer()
  } catch {
    return null
  }
}

const A4_WIDTH_PT = 595.28
const A4_HEIGHT_PT = 841.89

export async function mergeFloorPlans(
  brochurePdf: Uint8Array,
  floorPlans: Listing["floorPlans"],
): Promise<Uint8Array> {
  const items: FloorPlanItem[] =
    floorPlans && "items" in floorPlans && Array.isArray(floorPlans.items)
      ? (floorPlans.items as FloorPlanItem[])
      : []

  if (items.length === 0) return brochurePdf

  const merged = await PDFDocument.load(brochurePdf)

  // The brochure's last page is the back cover (contacts). Insert planimetrie
  // BEFORE it so the back cover stays last.
  let insertAt = Math.max(0, merged.getPageCount() - 1)

  for (const item of items) {
    const asset = item?.asset
    if (!asset?.url) continue
    const bytes = await fetchBytes(asset.url)
    if (!bytes) continue

    const mime = asset.mimeType ?? ""

    if (mime === "application/pdf") {
      try {
        const src = await PDFDocument.load(bytes)
        if (src.getPageCount() === 0) continue
        // One planimetria = one page. Always take the first page only.
        const [firstPage] = await merged.copyPages(src, [0])
        merged.insertPage(insertAt, firstPage)
        insertAt += 1
      } catch {
        // skip malformed planimetria
      }
      continue
    }

    if (mime.startsWith("image/")) {
      try {
        const isPng = mime === "image/png"
        const embedded = isPng
          ? await merged.embedPng(bytes)
          : await merged.embedJpg(bytes)

        const page = merged.insertPage(insertAt, [A4_WIDTH_PT, A4_HEIGHT_PT])
        const margin = 40
        const maxW = A4_WIDTH_PT - margin * 2
        const maxH = A4_HEIGHT_PT - margin * 2
        const scale = Math.min(maxW / embedded.width, maxH / embedded.height)
        const w = embedded.width * scale
        const h = embedded.height * scale
        page.drawImage(embedded, {
          x: (A4_WIDTH_PT - w) / 2,
          y: (A4_HEIGHT_PT - h) / 2,
          width: w,
          height: h,
        })
        insertAt += 1
      } catch {
        // skip unsupported image
      }
    }
  }

  return await merged.save()
}
