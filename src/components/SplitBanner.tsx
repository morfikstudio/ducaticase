import { cn } from "@/utils/classNames"

import { ButtonCta } from "@/components/ui/ButtonCta"

/** Converte `<br>`, `<br />` ecc. in newline per `whitespace-pre-line` (contenuto da CMS/HTML leggero). */
function brTagsToNewlines(text: string): string {
  return text.replace(/<br\s*\/?>/gi, "\n")
}

export type SplitBannerProps = {
  title: string
  description: string
  ctaLabel: string
  /** Se assente, il CTA è mostrato come testo stilizzato (non cliccabile) */
  ctaHref?: string
  imageSrc: string
  imageAlt: string
  /** Inverte colonne su desktop (immagine a sinistra) */
  reverse?: boolean
  className?: string
}

export function SplitBanner({
  title,
  description,
  ctaLabel,
  ctaHref,
  imageSrc,
  imageAlt,
  reverse = false,
  className,
}: SplitBannerProps) {
  return (
    <section className={cn("bg-bg", className)}>
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:min-h-[min(100vh,686px)]">
        <div
          className={cn(
            "flex flex-col justify-center gap-11 px-6 py-14 lg:px-12 lg:py-20 xl:pl-24",
            reverse ? "lg:order-2" : "lg:order-1",
          )}
        >
          <div className="flex max-w-[499px] flex-col gap-7">
            <div className="type-heading-1 text-primary">{title}</div>
            <p className="type-body-2 whitespace-pre-line text-gray">
              {brTagsToNewlines(description)}
            </p>
          </div>

          <ButtonCta className="self-start" href={ctaHref ?? ""}>
            {ctaLabel}
          </ButtonCta>
        </div>

        <div
          className={cn(
            "relative min-h-[280px] w-full overflow-hidden lg:min-h-0",
            reverse ? "lg:order-1" : "lg:order-2",
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- URL da CMS o CDN esterni */}
          <img
            src={imageSrc}
            alt={imageAlt}
            className="size-full min-h-[280px] object-cover lg:absolute lg:inset-0 lg:min-h-full"
          />

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-linear-to-b from-[rgba(27,27,27,0.22)] to-[rgba(0,0,0,0)] to-[20.452%]"
          />
        </div>
      </div>
    </section>
  )
}
