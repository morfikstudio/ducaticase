"use client"

import type { Reference } from "@sanity/types"
import { Box, Flex } from "@sanity/ui"
import { useClient, type ObjectItem, type ObjectItemProps } from "sanity"
import { useEffect, useState } from "react"

function refIdFromValue(value: unknown): string | null {
  if (!value || typeof value !== "object") return null
  const ref = (value as { _ref?: unknown })._ref
  return typeof ref === "string" && ref.length > 0 ? ref : null
}

function publishedAndDraftIds(ref: string): { pub: string; draft: string } {
  if (ref.startsWith("drafts.")) {
    return { pub: ref.slice("drafts.".length), draft: ref }
  }
  return { pub: ref, draft: `drafts.${ref}` }
}

/**
 * Riga dell’array "Immobili in evidenza": opacità 50% quando il listing
 * referenziato è archiviato (lo stato viene osservato via listen sul documento).
 */
export function FeaturedListingArrayItem(
  props: ObjectItemProps<Reference & ObjectItem>,
) {
  const client = useClient({ apiVersion: "2024-01-01" })
  const refId = refIdFromValue(props.value)
  const [isArchived, setIsArchived] = useState(false)

  useEffect(() => {
    if (!refId) {
      setIsArchived(false)
      return
    }

    const { pub, draft } = publishedAndDraftIds(refId)

    const fetchArchived = () =>
      client
        .fetch<boolean>(
          `coalesce(*[_id == $draft][0].isArchived, *[_id == $pub][0].isArchived, false)`,
          { pub, draft },
        )
        .then((v) => setIsArchived(v === true))
        .catch(() => setIsArchived(false))

    void fetchArchived()

    const sub = client
      .listen(`*[_id == $pub || _id == $draft]`, { pub, draft })
      .subscribe(() => {
        void fetchArchived()
      })

    return () => sub.unsubscribe()
  }, [client, refId])

  return (
    <Flex align="center" gap={3} style={{ opacity: isArchived ? 0.5 : 1 }}>
      <Box flex={1} style={{ minWidth: 0 }}>
        {props.renderDefault(props)}
      </Box>
    </Flex>
  )
}
