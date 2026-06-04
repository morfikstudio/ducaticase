import { cn } from "@/utils/classNames"

export type ChevronDirection = "left" | "right" | "up" | "down"
type IconSize = "s" | "m" | "l"

const sizeClass: Record<IconSize, string> = {
  s: "size-[14px] shrink-0 md:size-[21px]",
  m: "size-[18px] shrink-0 md:size-[26px]",
  l: "size-[26px] shrink-0",
}

const chevronRotateClass: Record<ChevronDirection, string> = {
  right: "rotate-0",
  down: "rotate-90",
  left: "rotate-180",
  up: "-rotate-90",
}

export type IconProps = { size?: IconSize; className?: string } & (
  | { type: "chevron"; direction: ChevronDirection }
  | { type: "success" }
  | { type: "error" }
)

export function Icon({ size = "m", className, ...props }: IconProps) {
  if (props.type === "chevron") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 26 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          sizeClass[size],
          chevronRotateClass[props.direction],
          className,
        )}
      >
        <path
          d="M9 5L17 13L9 21"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  if (props.type === "success") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(sizeClass[size], className)}
      >
        <circle cx="10" cy="10" r="10" fill="#22C55E" />
        <path
          d="M6 10.5L8.5 13L14 7.5"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  if (props.type === "error") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(sizeClass[size], className)}
      >
        <circle cx="10" cy="10" r="10" fill="#EF4444" />
        <path
          d="M7 7L13 13M13 7L7 13"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  return null
}
