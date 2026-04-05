import { Link } from "@/i18n/navigation"
import { sanityFetch } from "@/sanity/lib/client"
import { LISTINGS_PREVIEW_QUERY } from "@/sanity/lib/queries"
import type { LISTINGS_PREVIEW_QUERY_RESULT } from "@/sanity/types"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function Page({ params }: Props) {
  await params

  const listings = (await sanityFetch({
    query: LISTINGS_PREVIEW_QUERY,
    revalidate: 60,
  })) as LISTINGS_PREVIEW_QUERY_RESULT

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <ul className="space-y-2">
        {listings.map((entry) => (
          <li key={entry._id}>
            <Link
              className="text-neutral-700 underline underline-offset-2 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white"
              href={`/immobili/${entry._id}`}
              target="_blank"
            >
              {entry._id}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
