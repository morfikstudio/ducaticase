import { cn } from "@/utils/classNames"

type LoadingSpinnerProps = {
  className?: string
  sizeClassName?: string
  label?: string
}

export function LoadingSpinner({
  className,
  sizeClassName = "h-10 w-10",
  label = "Loading...",
}: LoadingSpinnerProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div
        className={cn(
          "rounded-full border-2 border-primary/25 border-t-primary",
          "animate-spin",
          sizeClassName,
        )}
        aria-label={label}
        role="status"
      />
    </div>
  )
}
