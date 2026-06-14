"use client"

import { itITLocale } from "@sanity/locale-it-it"
import { AddIcon } from "@sanity/icons"
import { googleMapsInput } from "@sanity/google-maps-input"
import { visionTool } from "@sanity/vision"
import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { media } from "sanity-plugin-media"

import { apiVersion, dataset, projectId } from "./src/sanity/env"
import { schema } from "./src/sanity/schemaTypes"
import { structure } from "./src/sanity/structure"

import { CompressedUploadInput } from "./src/sanity/components/compressedUploadInput"

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
      id: "siteContent-homePage",
      title: "Home",
      schemaType: "siteContent",
      value: () => ({
        title: "Home",
        sectionType: "homePage",
      }),
    },
    {
      id: "siteContent-aboutPage",
      title: "Chi siamo",
      schemaType: "siteContent",
      value: () => ({
        title: "Chi siamo",
        sectionType: "aboutPage",
      }),
    },
    {
      id: "siteContent-contactPage",
      title: "Contatti",
      schemaType: "siteContent",
      value: () => ({
        title: "Contatti",
        sectionType: "contactPage",
      }),
    },
    {
      id: "siteContent-listYourPropertyPage",
      title: "Affidaci il tuo immobile",
      schemaType: "siteContent",
      value: () => ({
        title: "Affidaci il tuo immobile",
        sectionType: "listYourPropertyPage",
      }),
    },
  ],
  form: {
    // Compresses images client-side before upload
    components: {
      input: CompressedUploadInput,
    },
  },
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
    media(),
    ...(googleMapsApiKey
      ? [
          googleMapsInput({
            apiKey: googleMapsApiKey,
            defaultZoom: 14,
            defaultLocation: {
              lat: 45.46427374118163,
              lng: 9.189750092364932,
            },
          }),
        ]
      : []),
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})
