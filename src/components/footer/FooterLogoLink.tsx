"use client"

import { Link, usePathname } from "@/i18n/navigation"
import { Logo } from "@/components/ui/Logo"
import { cn } from "@/utils/classNames"

export function FooterLogoLink() {
  const pathname = usePathname()
  const isHome = pathname === "/"

  const logo = (
    <span className="block [&_svg]:h-auto [&_svg]:w-full">
      <Logo />
    </span>
  )

  if (isHome) {
    return (
      <span
        className={cn("inline-block w-[min(100%,125px)] text-primary")}
        aria-current="page"
        aria-label="Homepage"
      >
        {logo}
      </span>
    )
  }

  return (
    <Link
      href="/"
      className="inline-block w-[min(100%,125px)] text-primary"
      aria-label="Homepage"
    >
      {logo}
    </Link>
  )
}
