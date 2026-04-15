import { NextResponse } from "next/server"

const STATIC_MAP_BASE = "https://maps.googleapis.com/maps/api/staticmap"
const MAX_DIMENSION = 640
const ZOOM = 15

/** Roadmap desaturated to grayscale (Static Maps styling). */
const GRAYSCALE_STYLE_PARAMS = ["feature:all|saturation:-100"] as const

function parseCoord(value: string | null): number | null {
  if (value == null || value === "") {
    return null
  }
  const n = Number(value)
  if (!Number.isFinite(n)) {
    return null
  }
  return n
}

function parseDimension(value: string | null): number | null {
  if (value == null || value === "") {
    return null
  }
  const n = Math.floor(Number(value))
  if (!Number.isFinite(n) || n < 1 || n > MAX_DIMENSION) {
    return null
  }
  return n
}

function buildGoogleStaticMapUrl(params: {
  lat: number
  lng: number
  width: number
  height: number
  apiKey: string
}): string {
  const { lat, lng, width, height, apiKey } = params

  const search = new URLSearchParams()

  search.set("center", `${lat},${lng}`)
  search.set("zoom", String(ZOOM))
  search.set("size", `${width}x${height}`)
  search.set("scale", "2")
  search.set("maptype", "roadmap")

  for (const style of GRAYSCALE_STYLE_PARAMS) {
    search.append("style", style)
  }

  search.set("key", apiKey)

  return `${STATIC_MAP_BASE}?${search.toString()}`
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const lat = parseCoord(searchParams.get("lat"))
  const lng = parseCoord(searchParams.get("lng"))
  const width = parseDimension(searchParams.get("w"))
  const height = parseDimension(searchParams.get("h"))

  if (lat == null || lng == null || width == null || height == null) {
    return NextResponse.json(
      { error: "Invalid or missing lat, lng, w, or h" },
      { status: 400 },
    )
  }

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return NextResponse.json(
      { error: "Coordinates out of range" },
      { status: 400 },
    )
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: "Maps API key not configured" },
      { status: 503 },
    )
  }

  const googleUrl = buildGoogleStaticMapUrl({ lat, lng, width, height, apiKey })

  let upstream: Response

  try {
    upstream = await fetch(googleUrl, { next: { revalidate: 86400 } })
  } catch {
    return NextResponse.json(
      { error: "Upstream fetch failed" },
      { status: 502 },
    )
  }

  if (!upstream.ok) {
    const errText = await upstream.text().catch(() => "")

    return NextResponse.json(
      { error: "Static map request failed", detail: errText.slice(0, 200) },
      { status: 502 },
    )
  }

  const contentType = upstream.headers.get("content-type") ?? "image/png"
  const body = upstream.body

  if (!body) {
    return NextResponse.json({ error: "Empty map response" }, { status: 502 })
  }

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  })
}
