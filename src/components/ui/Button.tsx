"use client"

import type { ButtonHTMLAttributes } from "react"

import { cn } from "@/utils/classNames"

type ButtonIcon = "filters"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ButtonIcon
  chevron?: "up" | "down"
  isActive?: boolean
  disabled?: boolean
}

function renderIcon(icon: ButtonIcon) {
  if (icon === "filters") {
    return (
      <svg
        width="18"
        height="18"
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 10H12M18 10H26M4 20H8M14 20H26"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="15" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
        <circle cx="11" cy="20" r="3" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
}

export function Button({
  className,
  icon,
  chevron,
  isActive = false,
  disabled = false,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center gap-3",
        "px-8 py-3",
        "type-button rounded-[4px] border",
        "cursor-pointer transition-all duration-200",
        disabled ? "opacity-50 cursor-not-allowed" : "",
        isActive
          ? "border-primary bg-primary text-accent"
          : "border-gray text-primary hover:border-primary hover:bg-primary hover:text-accent",
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {icon ? <span aria-hidden="true">{renderIcon(icon)}</span> : null}
      <span>{children}</span>
      {chevron ? (
        <span
          aria-hidden="true"
          className={cn(
            "transition-transform duration-200",
            chevron === "up" ? "rotate-180" : "",
          )}
        >
          <svg
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.75 1L5 5L9.25 1"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      ) : null}
    </button>
  )
}
