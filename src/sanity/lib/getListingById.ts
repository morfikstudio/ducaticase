import { cache } from "react"

import { sanityFetch } from "@/sanity/lib/client"
import { CACHE_TAGS } from "@/sanity/lib/cache-tags"
import { LISTING_BY_ID_QUERY } from "@/sanity/lib/queries"
import type { LISTING_BY_ID_QUERY_RESULT } from "@/sanity/types"

export const getListingById = cache(async (id: string) => {
  return (await sanityFetch({
    query: LISTING_BY_ID_QUERY,
    params: { id },
    revalidate: 60,
    tags: [CACHE_TAGS.listing, CACHE_TAGS.listingById(id)],
  })) as LISTING_BY_ID_QUERY_RESULT
})
