import { getTranslations } from "next-intl/server"

import { Button } from "@/components/ui/Button"
import { StatusPage } from "@/components/core/StatusPage"

/**
 * Rendered for `notFound()` inside the frontend segment — e.g. a listing id
 * that does not exist, or one that has been archived.
 *
 * Next keeps answering 404 here; the page only makes that legible instead of
 * showing its bare built-in fallback.
 */
export default async function FrontendNotFound() {
  const t = await getTranslations("notFoundPage")

  return (
    <StatusPage
      code={t("code")}
      title={t("title")}
      text={t("text")}
      actions={
        <>
          <Button href="/immobili" variant="primary" highlight>
            {t("ctaListings")}
          </Button>
          <Button href="/" variant="secondary">
            {t("ctaHome")}
          </Button>
        </>
      }
    />
  )
}
