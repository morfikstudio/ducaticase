"use client"

import { useEffect } from "react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/Button"
import { StatusPage } from "@/components/core/StatusPage"

type ErrorPageProps = {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Catches render failures in the frontend segment.
 *
 * Without it a thrown error fell through to Next's built-in page, which is
 * visually identical to the built-in 404 — a broken listing looked exactly like
 * a missing one. The HTTP status stays 500: this only makes the failure
 * readable and offers a way out.
 */
export default function FrontendError({ error, reset }: ErrorPageProps) {
  const t = useTranslations("errorPage")

  useEffect(() => {
    // Surfaces the digest, which is the only handle on the server-side stack.
    console.error("Frontend render error", error.digest, error)
  }, [error])

  return (
    <StatusPage
      code={t("code")}
      title={t("title")}
      text={t("text")}
      actions={
        <>
          <Button variant="primary" highlight onClick={reset}>
            {t("retry")}
          </Button>
          <Button href="/" variant="secondary">
            {t("ctaHome")}
          </Button>
        </>
      }
    />
  )
}
