import type { ReactNode } from "react"
import { cn } from "@/utils/classNames"

export const CONTAINER_LAYOUT_CLASSNAME =
  "mx-auto w-full max-w-[calc(1440px+96px)] px-4 md:px-8 lg:px-12" as const

export const CONTAINER_NARROW_LAYOUT_CLASSNAME =
  "mx-auto w-full max-w-[calc(1440px+96px)] px-4 md:px-8 lg:px-12" as const

type ContainerProps = {
  children: ReactNode
  className?: string
  type?: "default" | "narrow"
}

export function Container({
  children,
  className,
  type = "default",
}: ContainerProps) {
  const layoutClassName =
    type === "narrow"
      ? CONTAINER_NARROW_LAYOUT_CLASSNAME
      : CONTAINER_LAYOUT_CLASSNAME

  return (
    <div data-container-type={type} className={cn(layoutClassName, className)}>
      {children}
    </div>
  )
}
