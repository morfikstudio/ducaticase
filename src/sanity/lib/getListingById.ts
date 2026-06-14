import { cache } from "react"

import { sanityFetch } from "@/sanity/lib/client"
import { CACHE_TAGS } from "@/sanity/lib/cache-tags"
import {
  LISTING_BY_ID_INCLUDE_ARCHIVED_QUERY,
  LISTING_BY_ID_QUERY,
} from "@/sanity/lib/queries"
import type { LISTING_BY_ID_QUERY_RESULT } from "@/sanity/types"

type GetListingByIdOptions = {
  includeArchived?: boolean
}

export const getListingById = cache(
  async (id: string, options?: GetListingByIdOptions) => {
    const includeArchived = options?.includeArchived ?? false
    const query = includeArchived
      ? LISTING_BY_ID_INCLUDE_ARCHIVED_QUERY
      : LISTING_BY_ID_QUERY

    return (await sanityFetch({
      query,
      params: { id },
      revalidate: includeArchived ? 0 : 60,
      tags: [CACHE_TAGS.listing, CACHE_TAGS.listingById(id)],
    })) as LISTING_BY_ID_QUERY_RESULT
  },
)
