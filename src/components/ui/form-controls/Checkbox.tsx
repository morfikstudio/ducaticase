"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"

import { cn } from "@/utils/classNames"

type CheckboxProps = React.ComponentProps<typeof CheckboxPrimitive.Root>

export function Checkbox({ className, children, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-neutral-400 bg-white text-white transition-colors outline-none",
        "hover:border-neutral-500 data-[state=checked]:border-black data-[state=checked]:bg-black",
        "focus-visible:ring-2 focus-visible:ring-neutral-900/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
        </svg>
      </CheckboxPrimitive.Indicator>
      {children}
    </CheckboxPrimitive.Root>
  )
}
