import { cn } from "@/utils/classNames"

type SpacerProps = {
  type?: "s" | "m" | "l"
  classNames?: string
}

export function Spacer({ type = "m", classNames }: SpacerProps) {
  return (
    <div
      className={cn(type === "m" ? "h-[160px] lg:h-[260px]" : "", classNames)}
    />
  )
}
