"use client"

import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react"
import { Link } from "@/i18n/navigation"

import { cn } from "@/utils/classNames"

type ButtonIcon = "externalLink" | "filters" | "detailsArrow" | "download"
type ButtonVariant = "primary" | "secondary" | "reverse"

type ButtonSharedProps = {
  variant?: ButtonVariant
  /** Primary variant only: visually highlights the button by default. */
  highlight?: boolean
  icon?: ButtonIcon
  /** Where to render `icon`. Chevron is always after the label. */
  iconPosition?: "start" | "end"
  chevron?: "up" | "down"
  isActive?: boolean
  rotateIcon?: boolean
  iconClassName?: string
  disabled?: boolean
}

type ButtonAsButton = ButtonSharedProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined
  }

type ButtonAsAnchor = ButtonSharedProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonSharedProps> & {
    href: string
  }

export type ButtonProps = ButtonAsButton | ButtonAsAnchor

function renderIcon(icon: ButtonIcon) {
  switch (icon) {
    case "externalLink":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M11.4084 10.8928V3.63095H4.14648"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M10.8964 4.14305L3.63103 11.4085"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        </svg>
      )
    case "filters":
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
    case "detailsArrow":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="13"
          viewBox="0 0 12 13"
          fill="none"
        >
          <path
            d="M0.56543 5.86523L5.70036 11.0002L10.8353 5.86523"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M5.70117 10.2749L5.70117 0"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        </svg>
      )
    case "download":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="16"
          viewBox="0 0 20 16"
          fill="none"
        >
          <path
            d="M0.799805 8.09961V14.3996H18.7998V8.09961"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M5.75 5.84961L9.8 9.89961L13.85 5.84961"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path d="M9.7998 9.9V0" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      )
    default:
      return null
  }
}

function getButtonClasses({
  variant,
  highlight,
  disabled,
  isActive,
  className,
}: {
  variant: ButtonVariant
  highlight: boolean
  disabled: boolean
  isActive: boolean
  className?: string
}) {
  if (variant === "secondary") {
    return cn(
      "type-button inline-flex w-fit items-center gap-3",
      "group border-0 bg-transparent p-0 text-left uppercase tracking-[0.08em] text-primary",
      disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
      className,
    )
  }

  if (variant === "reverse") {
    return cn(
      "inline-flex items-center justify-center gap-3",
      "px-8 py-3",
      "type-button rounded-[4px] border border-black",
      "cursor-pointer transition-all duration-200",
      disabled
        ? "cursor-not-allowed bg-transparent text-black opacity-50"
        : isActive || highlight
          ? "bg-black text-primary hover:bg-black hover:text-primary"
          : "bg-transparent text-black hover:bg-black hover:text-primary",
      className,
    )
  }

  return cn(
    "inline-flex items-center justify-center gap-3",
    "px-8 py-3",
    "type-button rounded-[4px] border",
    "cursor-pointer transition-all duration-200",
    disabled
      ? "cursor-not-allowed opacity-50"
      : isActive || highlight
        ? "border-primary bg-primary text-accent hover:border-primary hover:bg-primary hover:text-accent"
        : "border-gray text-primary hover:border-primary hover:bg-primary hover:text-accent",
    className,
  )
}

export function Button(props: ButtonProps) {
  const {
    className,
    variant = "primary",
    highlight = false,
    icon,
    iconPosition = "start",
    chevron,
    isActive = false,
    rotateIcon = false,
    iconClassName,
    disabled = false,
    children,
    ...rest
  } = props

  const classes = getButtonClasses({
    variant,
    highlight,
    disabled,
    isActive,
    className,
  })

  const iconEl = icon ? (
    <span
      aria-hidden="true"
      className={cn(
        "shrink-0 transition-transform duration-300 ease-out motion-reduce:transition-none",
        rotateIcon && "rotate-180",
        iconClassName,
      )}
    >
      {renderIcon(icon)}
    </span>
  ) : null

  const content = (
    <>
      {iconPosition === "start" ? iconEl : null}
      <span>{children}</span>
      {iconPosition === "end" ? iconEl : null}
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
    </>
  )

  const body =
    variant === "secondary" ? (
      <span className="inline-flex w-fit flex-col items-start gap-3">
        <span className="inline-flex items-center gap-3">{content}</span>
        <span aria-hidden className="relative h-px w-full overflow-hidden">
          <span className="absolute inset-0 bg-primary transition-transform duration-300 ease-out group-hover:translate-x-full motion-reduce:transition-none motion-reduce:transform-none" />
        </span>
      </span>
    ) : (
      content
    )

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...anchorProps } = rest
    return (
      <Link href={href} className={classes} {...anchorProps}>
        {body}
      </Link>
    )
  }

  const buttonProps = rest as ButtonHTMLAttributes<HTMLButtonElement>

  return (
    <button
      type="button"
      className={classes}
      disabled={disabled}
      {...buttonProps}
    >
      {body}
    </button>
  )
}
