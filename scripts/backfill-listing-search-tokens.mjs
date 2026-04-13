import { createClient } from "@sanity/client"

const LISTING_TYPES = [
  "listingResidential",
  "listingCountryHouses",
  "listingShopsAndOffices",
  "listingIndustrial",
  "listingHospitality",
  "listingLand",
]

const CONTRACT_TYPE_SEARCH_TOKENS = {
  sale: "sale vendita vend",
  rent: "rent affitto aff",
}

const BATCH_SIZE = 200
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

function expectedTokensFor(contractType) {
  if (typeof contractType !== "string") return undefined
  return CONTRACT_TYPE_SEARCH_TOKENS[contractType]
}

async function fetchCandidates(afterId) {
  return client.fetch(
    `
      *[
        _type in $listingTypes &&
        defined(listingContractType) &&
        _id > $afterId
      ] | order(_id asc)[0...$batchSize]{
        _id,
        _type,
        listingContractType,
        listingSearchTokens
      }
    `,
    {
      listingTypes: LISTING_TYPES,
      afterId,
      batchSize: BATCH_SIZE,
    },
  )
}

async function run() {
  let afterId = ""
  let scanned = 0
  let toUpdate = 0
  let updated = 0

  while (true) {
    const docs = await fetchCandidates(afterId)
    if (docs.length === 0) break

    scanned += docs.length
    afterId = docs[docs.length - 1]._id

    const patches = []
    for (const doc of docs) {
      const expected = expectedTokensFor(doc.listingContractType)
      if (!expected) continue
      if (doc.listingSearchTokens === expected) continue

      toUpdate += 1
      patches.push({
        id: doc._id,
        patch: {
          set: {
            listingSearchTokens: expected,
          },
        },
      })
    }

    if (!isDryRun && patches.length > 0) {
      const tx = client.transaction()
      for (const p of patches) {
        tx.patch(p.id, p.patch)
      }
      await tx.commit()
      updated += patches.length
    }
  }

  console.log(
    `[backfill-listing-search-tokens] scanned=${scanned} toUpdate=${toUpdate} updated=${isDryRun ? 0 : updated} dryRun=${isDryRun}`,
  )
}

run().catch((error) => {
  console.error("[backfill-listing-search-tokens] failed:", error)
  process.exit(1)
})
