"use client"

import { useTranslations } from "next-intl"
import { usePathname, Link } from "@/i18n/navigation"
import { cn } from "@/utils/classNames"

type BreadcrumbItem = {
  label: string
  href?: string
}

export default function Breadcrumbs() {
  const pathname = usePathname()
  const t = useTranslations("breadcrumbs")
  const segments = pathname.split("/").filter(Boolean)

  if (segments.length === 0) return null

  let items: BreadcrumbItem[]

  if (segments[0] === "immobili") {
    items = [
      { label: "Home", href: "/" },
      { label: t("listings"), href: segments.length > 1 ? "/immobili" : undefined },
      ...(segments.length > 1 ? [{ label: t("listingDetail") }] : []),
    ]
  } else {
    items = [
      { label: "Home", href: "/" },
      ...segments.map((segment, index) => ({
        label: segment
          .replace(/-/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase()),
        href:
          index < segments.length - 1
            ? "/" + segments.slice(0, index + 1).join("/")
            : undefined,
      })),
    ]
  }

  return (
    <div className="hidden md:block px-10 pt-24">
      <nav aria-label="Breadcrumb" className={cn("flex items-center gap-2")}>
        <ol className="flex items-center gap-2">
          {items.map((item, index) => {
            const isLast = index === items.length - 1
            return (
              <li key={index} className="flex items-center gap-2">
                {index > 0 && (
                  <span className="type-body-3 text-gray" aria-hidden="true">
                    /
                  </span>
                )}
                {item.href ? (
                  <Link
                    href={item.href}
                    className="type-body-3 text-gray hover:underline underline-offset-4"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className="type-body-3 text-gray/50"
                    aria-current={isLast ? "page" : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </div>
  )
}
