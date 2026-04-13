"use client"

import { useLayoutEffect, useMemo, useRef } from "react"
import { useTranslations } from "next-intl"
import { usePathname, Link } from "@/i18n/navigation"
import gsap from "gsap"

import { cn } from "@/utils/classNames"
import { prefersReducedMotion } from "@/utils/reducedMotion"

import { Container } from "@/components/ui/Container"

type BreadcrumbItem = {
  label: string
  href?: string
}

export function Breadcrumbs() {
  const pathname = usePathname()
  const t = useTranslations("breadcrumbs")

  const olRef = useRef<HTMLOListElement>(null)

  const items = useMemo((): BreadcrumbItem[] => {
    const segments = pathname.split("/").filter(Boolean)
    if (segments.length === 0) return []

    if (segments[0] === "immobili") {
      return [
        { label: "Home", href: "/" },
        {
          label: t("listings"),
          href: segments.length > 1 ? "/immobili" : undefined,
        },
        ...(segments.length > 1 ? [{ label: t("listingDetail") }] : []),
      ]
    }

    return [
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
  }, [pathname, t])

  /* Entry animation */
  useLayoutEffect(() => {
    if (items.length === 0 || !olRef.current || prefersReducedMotion()) {
      return
    }

    const elements = olRef.current.querySelectorAll<HTMLElement>(":scope > li")

    if (elements.length === 0) {
      return
    }

    gsap.set(elements, { opacity: 0, y: 20 })
    gsap.to(elements, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: "power2.out",
    })

    return () => {
      gsap.killTweensOf(elements)
    }
  }, [pathname, items.length])

  return items.length > 0 ? (
    <Container className="hidden md:block max-w-auto pt-24">
      <nav aria-label="Breadcrumb" className={cn("flex items-center gap-2")}>
        <ol ref={olRef} className="flex items-center gap-2">
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
    </Container>
  ) : null
}
