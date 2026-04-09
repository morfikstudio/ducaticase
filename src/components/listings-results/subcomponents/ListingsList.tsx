import { ListingCard } from "@/components/cards/ListingCard"
import type { AppLocale } from "@/i18n/routing"
import type { LISTINGS_PREVIEW_QUERY_RESULT } from "@/sanity/types"

type ListingsEntry = LISTINGS_PREVIEW_QUERY_RESULT[number]

type ListingsListProps = {
  listings: ListingsEntry[]
  locale: AppLocale
}

export function ListingsList({ listings, locale }: ListingsListProps) {
  return (
    <ul className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
      {listings.map((entry) => (
        <ListingCard key={entry._id} entry={entry} locale={locale} />
      ))}
    </ul>
  )
}
