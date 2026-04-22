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

function hasLegacyValues(data) {
  return Boolean(
    data?.valoriTitle ??
      data?.valoriSubtitle ??
      data?.valoriCta ??
      data?.valoriImage ??
      data?.valoriItems,
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
    if (!hasLegacyValues(page)) continue

    toUpdate += 1

    if (isDryRun) continue

    await client
      .patch(doc._id)
      .set({
        "listYourPropertyPage.valuesTitle":
          page.valuesTitle ?? page.valoriTitle ?? null,
        "listYourPropertyPage.valuesSubtitle":
          page.valuesSubtitle ?? page.valoriSubtitle ?? null,
        "listYourPropertyPage.valuesCta": page.valuesCta ?? page.valoriCta ?? null,
        "listYourPropertyPage.valuesImage":
          page.valuesImage ?? page.valoriImage ?? null,
        "listYourPropertyPage.valuesItems":
          page.valuesItems ?? page.valoriItems ?? [],
      })
      .unset([
        "listYourPropertyPage.valoriTitle",
        "listYourPropertyPage.valoriSubtitle",
        "listYourPropertyPage.valoriCta",
        "listYourPropertyPage.valoriImage",
        "listYourPropertyPage.valoriItems",
      ])
      .commit()

    updated += 1
  }

  console.log(
    `[migrate-list-your-property-values-fields] scanned=${scanned} toUpdate=${toUpdate} updated=${updated} dryRun=${isDryRun}`,
  )
}

run().catch((error) => {
  console.error("[migrate-list-your-property-values-fields] failed:", error)
  process.exit(1)
})
