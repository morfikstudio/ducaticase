import { randomUUID } from "node:crypto"

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

// Reuse the old i18n heading so the migrated group looks identical to before.
const MIGRATED_TITLE = {
  _type: "localizedString",
  it: "Membri attivi delle principali associazioni del real estate nazionali e internazionali",
  en: "Active members of leading national and international real estate associations",
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
})

async function fetchDocs() {
  // "raw" perspective (default) returns both published and drafts.* documents.
  return client.fetch(
    `
      *[
        _type == "siteContent" &&
        sectionType == "homePage" &&
        defined(homePage.partners) &&
        count(homePage.partners) > 0 &&
        !defined(homePage.partnerGroups)
      ]{
        _id,
        "partners": homePage.partners
      }
    `,
  )
}

function randomKey() {
  return randomUUID().replace(/-/g, "").slice(0, 12)
}

async function run() {
  const docs = await fetchDocs()

  let scanned = 0
  let updated = 0

  for (const doc of docs) {
    scanned += 1

    const partners = Array.isArray(doc.partners) ? doc.partners : []
    if (partners.length === 0) continue

    const group = {
      _type: "homePartnerGroup",
      _key: randomKey(),
      title: MIGRATED_TITLE,
      partners,
    }

    console.log(
      `[migrate-partners-to-partner-groups] ${doc._id}: ${partners.length} partner(s) -> 1 group`,
    )

    if (isDryRun) continue

    await client
      .patch(doc._id)
      .set({ "homePage.partnerGroups": [group] })
      .unset(["homePage.partners"])
      .commit()

    updated += 1
  }

  console.log(
    `[migrate-partners-to-partner-groups] scanned=${scanned} updated=${updated} dryRun=${isDryRun}`,
  )
}

run().catch((error) => {
  console.error("[migrate-partners-to-partner-groups] failed:", error)
  process.exit(1)
})
