import type { ReactNode } from "react"

import { Container } from "@/components/ui/Container"

type StatusPageProps = {
  /** HTTP status shown to the visitor, e.g. "404" or "500". */
  code: string
  title: string
  text: string
  /** Buttons / links offering a way out. */
  actions: ReactNode
}

/**
 * Shared shell for the 404 and error pages.
 *
 * Both used to fall through to Next's bare default page, which looks identical
 * in either case — a missing listing and a failed render were indistinguishable
 * on screen even though the HTTP status differed. Showing the status code makes
 * the two tellable apart at a glance, by visitors and by us.
 */
export function StatusPage({ code, title, text, actions }: StatusPageProps) {
  return (
    <main
      data-component="StatusPage"
      className="flex w-full items-center md:pt-32"
    >
      <Container className="flex flex-col items-start gap-6 py-32 md:py-48">
        <p className="type-display-1 text-gray" aria-hidden="true">
          {code}
        </p>

        <h1 className="type-heading-1 text-white">{title}</h1>

        <p className="type-body-3 md:type-body-2 max-w-[60ch] text-gray">
          {text}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-4">{actions}</div>
      </Container>
    </main>
  )
}
