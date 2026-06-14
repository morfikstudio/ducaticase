export const CACHE_TAGS = {
  siteContent: "siteContent",
  listing: "listing",
  listingById: (id: string) => `listing:${id}`,
} as const
