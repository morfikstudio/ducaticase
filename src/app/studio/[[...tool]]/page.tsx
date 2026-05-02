import type { Metadata } from "next"
import { NextStudio, metadata as studioMetadata } from "next-sanity/studio"

import config from "../../../../sanity.config"

export const dynamic = "force-static"

export const metadata: Metadata = {
  ...studioMetadata,
  title: "Studio",
}

export { viewport } from "next-sanity/studio"

export default function StudioPage() {
  return <NextStudio config={config} />
}
