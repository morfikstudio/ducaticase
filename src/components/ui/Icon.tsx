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

export type IconProps = { size?: IconSize } & {
  type: "chevron"
  direction: ChevronDirection
}

export function Icon({ size = "m", ...props }: IconProps) {
  if (props.type === "chevron") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 26 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(sizeClass[size], chevronRotateClass[props.direction])}
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

  return null
}
