import { createClient } from "@sanity/client"

const isDryRun = process.argv.includes("--dry-run")

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-02-23"
const token = process.env.SANITY_API_TOKEN

if (!projectId || !dataset) {
  throw new Error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET.",
  )
}

if (!token) {
  throw new Error("Missing SANITY_API_TOKEN for write operations.")
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
})

async function fetchDocs() {
  return client.fetch(
    `
      *[
        _type == "siteContent" &&
        sectionType == "listYourPropertyPage" &&
        defined(listYourPropertyPage)
      ]{
        _id,
        listYourPropertyPage
      }
    `,
  )
}

function hasLegacyFields(data) {
  return Boolean(
    data?.serviziTitle ??
    data?.serviziSubtitle ??
    data?.serviziCta ??
    data?.serviziItems,
  )
}

async function run() {
  const docs = await fetchDocs()

  let scanned = 0
  let toUpdate = 0
  let updated = 0

  for (const doc of docs) {
    scanned += 1
    const page = doc.listYourPropertyPage ?? {}
    if (!hasLegacyFields(page)) continue

    toUpdate += 1

    if (isDryRun) continue

    await client
      .patch(doc._id)
      .set({
        "listYourPropertyPage.servicesTitle":
          page.servicesTitle ?? page.serviziTitle ?? null,
        "listYourPropertyPage.servicesSubtitle":
          page.servicesSubtitle ?? page.serviziSubtitle ?? null,
        "listYourPropertyPage.servicesCta":
          page.servicesCta ?? page.serviziCta ?? null,
        "listYourPropertyPage.servicesItems":
          page.servicesItems ?? page.serviziItems ?? [],
      })
      .unset([
        "listYourPropertyPage.serviziTitle",
        "listYourPropertyPage.serviziSubtitle",
        "listYourPropertyPage.serviziCta",
        "listYourPropertyPage.serviziItems",
      ])
      .commit()

    updated += 1
  }

  console.log(
    `[migrate-servizi-to-services] scanned=${scanned} toUpdate=${toUpdate} updated=${updated} dryRun=${isDryRun}`,
  )
}

run().catch((error) => {
  console.error("[migrate-servizi-to-services] failed:", error)
  process.exit(1)
})
