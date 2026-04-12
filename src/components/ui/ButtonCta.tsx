import type { ComponentProps } from "react"

import { Link } from "@/i18n/navigation"
import { cn } from "@/utils/classNames"

type AppLinkProps = ComponentProps<typeof Link>

export type ButtonCtaProps = Omit<AppLinkProps, "className" | "href"> & {
  href: AppLinkProps["href"]
  className?: string
  isActive?: boolean
}

export function ButtonCta({
  href,
  className,
  isActive = false,
  children,
  ...linkProps
}: ButtonCtaProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center",
        "px-8 py-3",
        "type-button rounded-[4px] border",
        "transition-all duration-200",
        isActive
          ? "border-primary bg-primary text-accent"
          : "border-gray text-primary hover:border-primary hover:bg-primary hover:text-accent",
        className,
      )}
      {...linkProps}
    >
      {children}
    </Link>
  )
}
