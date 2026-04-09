import type { ReactNode } from "react"
import { cn } from "@/utils/classNames"

type ContainerProps = {
  children: ReactNode
  className?: string
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[calc(1280px+96px)]",
        "px-3 md:px-6 lg:px-12",
        className,
      )}
    >
      {children}
    </div>
  )
}
