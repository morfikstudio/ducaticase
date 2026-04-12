import { CONTAINER_LAYOUT_CLASSNAME } from "@/components/ui/Container"
import { cn } from "@/utils/classNames"

function brTagsToNewlines(text: string): string {
  return text.replace(/<br\s*\/?>/gi, "\n")
}

const mobileMediaColumn = "min-h-[min(90vh,482px)] h-[min(90vh,482px)]" as const

const mobileTitleLayer = "h-[min(90vh,482px)] min-h-[min(90vh,482px)]" as const

const tabletDesktopImageWidth =
  "md:w-[calc(50vw+min(100vw,86rem)/4-12px)] lg:w-[calc(50vw+min(100vw,86rem)/4-24px)]" as const

export type StatementHeroProps = {
  title: string
  imageSrc: string
  imageAlt: string
  className?: string
}

export function StatementHero({
  title,
  imageSrc,
  imageAlt,
  className,
}: StatementHeroProps) {
  return (
    <section className={cn("relative bg-bg", className)}>
      <div className="relative isolate w-full md:min-h-[min(100vh,840px)]">
        <div
          className={cn(
            "relative w-full overflow-hidden",
            mobileMediaColumn,
            "md:absolute md:inset-y-0 md:left-0 md:right-auto md:h-full md:min-h-0",
            tabletDesktopImageWidth,
          )}
        >
          <img
            src={imageSrc}
            alt={imageAlt}
            className="absolute inset-0 size-full object-cover md:min-h-full"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[rgba(35,35,35,0.3)]"
          />
        </div>

        <div aria-hidden className="min-h-[104px] shrink-0 bg-bg md:hidden" />

        <div
          className={cn(
            "absolute top-0 right-0 left-0 z-10 flex justify-start",
            mobileTitleLayer,
            "items-end",
            CONTAINER_LAYOUT_CLASSNAME,
            "md:inset-0 md:grid md:h-full md:grid-cols-12 md:items-center md:py-20",
          )}
        >
          <div
            className={cn(
              "type-display-1 w-full translate-y-1/2 text-left whitespace-pre-line text-primary",
              "md:col-span-10 md:col-start-3 md:max-w-none md:translate-y-0 md:px-0",
            )}
          >
            {brTagsToNewlines(title)}
          </div>
        </div>
      </div>
    </section>
  )
}
