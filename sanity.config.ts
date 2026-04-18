"use client"

/**
 * This configuration is used to for the Sanity Studio that's mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import { itITLocale } from "@sanity/locale-it-it"
import { AddIcon } from "@sanity/icons"
import { googleMapsInput } from "@sanity/google-maps-input"
import { visionTool } from "@sanity/vision"
import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from "./src/sanity/env"
import { schema } from "./src/sanity/schemaTypes"
import { structure } from "./src/sanity/structure"

const googleMapsApiKey =
  process.env.SANITY_STUDIO_GOOGLE_MAPS_API_KEY ??
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  schema,
  initialValueTemplates: [
    {
      id: "siteContent-aboutPage",
      title: "Pagina About",
      schemaType: "siteContent",
      value: () => ({
        title: "Pagina About",
        sectionType: "aboutPage",
      }),
    },
  ],
  document: {
    newDocumentOptions: (prev) =>
      prev.map((item) => ({
        ...item,
        icon: AddIcon,
      })),
  },
  plugins: [
    itITLocale(),
    structureTool({ structure }),
    ...(googleMapsApiKey
      ? [googleMapsInput({ apiKey: googleMapsApiKey })]
      : []),
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})
