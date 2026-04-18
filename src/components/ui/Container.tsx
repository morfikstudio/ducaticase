import type { ReactNode } from "react"
import { cn } from "@/utils/classNames"

export const CONTAINER_LAYOUT_CLASSNAME =
  "mx-auto w-full max-w-[calc(1440px+96px)] px-4 md:px-8 lg:px-12" as const

type ContainerProps = {
  children: ReactNode
  className?: string
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn(CONTAINER_LAYOUT_CLASSNAME, className)}>{children}</div>
  )
}
