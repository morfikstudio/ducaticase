import { sanityFetch } from "@/sanity/lib/client"

import {
  LISTINGS_PREVIEW_QUERY,
  SITE_CONTENT_QUERY,
} from "@/sanity/lib/queries"

export default async function Page() {
  const [site, listings] = await Promise.all([
    sanityFetch({ query: SITE_CONTENT_QUERY, revalidate: 60 }),
    sanityFetch({ query: LISTINGS_PREVIEW_QUERY, revalidate: 60 }),
  ])

  console.log("siteContent", site)
  console.log("listings preview", listings)

  return (
    <main>
      <span>LISTING WILL BE HERE</span>
    </main>
  )
}
