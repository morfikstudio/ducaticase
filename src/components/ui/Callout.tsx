import { cn } from "@/utils/classNames"

import { Icon } from "@/components/ui/Icon"

export type CalloutVariant = "success" | "error"

export type CalloutProps = {
  variant: CalloutVariant
  message: string
  className?: string
}

export function Callout({ variant, message, className }: CalloutProps) {
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      aria-live="polite"
      className={cn(
        "flex w-full items-center justify-center gap-2 rounded-[4px] bg-white px-5 py-4",
        "type-button uppercase text-black",
        className,
      )}
    >
      <Icon type={variant} size="s" />
      <span>{message}</span>
    </div>
  )
}
