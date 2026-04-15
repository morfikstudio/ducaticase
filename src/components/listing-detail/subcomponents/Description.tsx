"use client"

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react"
import gsap from "gsap"
import { useTranslations } from "next-intl"

import type { AppLocale } from "@/i18n/routing"
import { Button } from "@/components/ui/Button"
import { PortableTextComponent } from "@/components/ui/PortableText"
import { pickLocalizedPortableText } from "@/sanity/lib/locale"
import type { LISTING_BY_ID_QUERY_RESULT } from "@/sanity/types"
import { prefersReducedMotion } from "@/utils/reducedMotion"
import { cn } from "@/utils/classNames"

type Content = NonNullable<LISTING_BY_ID_QUERY_RESULT>["content"]
type FloorPlans = NonNullable<LISTING_BY_ID_QUERY_RESULT>["floorPlans"]

type DescriptionProps = {
  excerpt: Content["excerpt"]
  description: Content["description"]
  floorPlans: FloorPlans | null | undefined
  locale: AppLocale
}

const excerptPortableClassName = cn(
  "[&_p]:type-body-1",
  "[&_p+_p]:mt-4",
  "[&_ul]:type-body-1 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5",
  "[&_ol]:type-body-1 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-5",
  "[&_li]:mt-1",
  "[&_strong]:font-semibold",
)

const descriptionPortableClassName = cn(
  "[&_p]:type-body-2",
  "[&_p+_p]:mt-4",
  "[&_ul]:type-body-2 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5",
  "[&_ol]:type-body-2 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-5",
  "[&_li]:mt-1",
  "[&_strong]:font-semibold",
)

const expandPanelClassName = cn(
  "grid overflow-hidden transition-[grid-template-rows] duration-400 ease-out",
  "motion-reduce:transition-none motion-reduce:duration-0",
)

function hasPortableText(
  text: Parameters<typeof pickLocalizedPortableText>[0],
  locale: AppLocale,
): boolean {
  const blocks = pickLocalizedPortableText(text, locale)
  return Array.isArray(blocks) && blocks.length > 0
}

function getFloorPlanItemsWithUrl(
  floorPlans: FloorPlans | null | undefined,
): NonNullable<FloorPlans["items"]> {
  const items = floorPlans?.items

  if (!items?.length) {
    return []
  }

  return items.filter(
    (item): item is typeof item & { asset: NonNullable<typeof item.asset> } =>
      Boolean(item.asset?.url),
  )
}

export function Description({
  excerpt,
  description,
  floorPlans,
  locale,
}: DescriptionProps) {
  const t = useTranslations("listingDetail")
  const panelId = useId()
  const toggleId = useId()
  const sectionRef = useRef<HTMLElement>(null)
  const [expanded, setExpanded] = useState(false)

  const hasExcerpt = hasPortableText(excerpt, locale)
  const hasDescription = hasPortableText(description, locale)
  const planItems = getFloorPlanItemsWithUrl(floorPlans)
  const hasFloorPlans = planItems.length > 0
  const shouldShow = hasExcerpt || hasDescription || hasFloorPlans

  useLayoutEffect(() => {
    if (!shouldShow || !sectionRef.current) {
      return
    }
    gsap.set(sectionRef.current, { opacity: 0, y: 20 })
  }, [shouldShow])

  /* Entry animation */
  useEffect(() => {
    if (!shouldShow || !sectionRef.current) {
      return
    }

    if (prefersReducedMotion()) {
      gsap.set(sectionRef.current, { opacity: 1, y: 0 })
      return
    }

    gsap.to(sectionRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power2.out",
    })
  }, [shouldShow])

  if (!shouldShow) {
    return null
  }

  const firstPlan = planItems[0]
  const firstAsset = firstPlan?.asset
  const firstPlanUrl = firstAsset?.url
  const extraPlans = planItems.slice(1)

  const actionJustify =
    hasDescription && hasFloorPlans
      ? "md:justify-between"
      : hasFloorPlans
        ? "md:justify-end"
        : "md:justify-start"

  return (
    <section
      ref={sectionRef}
      className="mt-6 w-full md:mt-8"
      style={{ opacity: 0 }}
    >
      <div className="w-full">
        {/* EXCERPT */}
        {hasExcerpt ? (
          <div className="grid grid-cols-12">
            <PortableTextComponent
              text={excerpt}
              locale={locale}
              className={cn(
                "col-span-12 md:col-start-3 md:col-span-8",
                excerptPortableClassName,
              )}
            />
          </div>
        ) : null}

        {/* DESCRIPTION */}
        {hasDescription ? (
          <div
            className={cn(
              hasExcerpt &&
                "transition-[margin] duration-400 ease-out motion-reduce:transition-none motion-reduce:duration-0",
              hasExcerpt && (expanded ? "mt-16" : "mt-0"),
              "grid grid-cols-12",
            )}
          >
            <div
              className={cn(
                "col-span-12 md:col-start-5 md:col-span-6",
                expandPanelClassName,
                expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="min-h-0 overflow-hidden">
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={toggleId}
                  aria-hidden={!expanded}
                  className={cn(
                    "transition-opacity duration-400 ease-out motion-reduce:transition-none motion-reduce:duration-0",
                    expanded ? "opacity-100" : "pointer-events-none opacity-0",
                  )}
                >
                  <PortableTextComponent
                    text={description}
                    locale={locale}
                    className={descriptionPortableClassName}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* ACTIONS */}
        {hasDescription || hasFloorPlans ? (
          <div className="mt-8 md:mt-16 grid grid-cols-12">
            <div
              className={cn(
                "w-full col-span-12 md:col-start-3 md:col-span-8",
                "flex flex-col md:flex-row items-start md:items-center gap-16 md:gap-4",
                actionJustify,
              )}
            >
              {hasDescription ? (
                <Button
                  id={toggleId}
                  type="button"
                  variant="secondary"
                  icon="detailsArrow"
                  iconPosition="end"
                  rotateIcon={expanded}
                  iconClassName={
                    expanded
                      ? "group-hover:-translate-y-0.75"
                      : "group-hover:translate-y-0.75"
                  }
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  onClick={() => setExpanded((v) => !v)}
                >
                  <span
                    key={String(expanded)}
                    className="animate-label-in motion-reduce:animate-none"
                  >
                    {expanded ? t("lessDetails") : t("moreDetails")}
                  </span>
                </Button>
              ) : null}

              {hasFloorPlans && firstPlanUrl && firstAsset ? (
                <div className="flex flex-col items-end gap-2">
                  <Button
                    href={firstPlanUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={firstAsset.originalFilename ?? undefined}
                    icon="externalLink"
                    iconPosition="end"
                    className="group/floor"
                    iconClassName="group-hover/floor:rotate-[45deg] group-hover/floor:translate-y-0"
                  >
                    {t("floorPlans")}
                  </Button>
                  {extraPlans.length > 0 ? (
                    <ul className="flex list-none flex-col items-end gap-1 pl-0">
                      {extraPlans.map((item) => {
                        const asset = item.asset
                        const url = asset?.url
                        if (!url || !asset) {
                          return null
                        }
                        const label =
                          asset.originalFilename?.trim() || t("floorPlans")
                        return (
                          <li key={item._key}>
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              download={asset.originalFilename ?? undefined}
                              className="type-body-3 text-primary underline-offset-4 hover:underline"
                            >
                              {label}
                            </a>
                          </li>
                        )
                      })}
                    </ul>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
