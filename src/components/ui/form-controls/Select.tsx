"use client"

import { useEffect, useId, useRef, useState } from "react"

import { Icon } from "@/components/ui/Icon"

import { cn } from "@/utils/classNames"

export type SelectOption = {
  value: string
  label: string
}

export type SelectProps = {
  id?: string
  name?: string
  value: string
  onChange: (value: string) => void
  options: ReadonlyArray<SelectOption>
  placeholder: string
  required?: boolean
  /** When true, renders the trigger with an error (red) border. */
  invalid?: boolean
  className?: string
  "aria-invalid"?: boolean
  "aria-describedby"?: string
}

export function Select({
  id,
  name,
  value,
  onChange,
  options,
  placeholder,
  required,
  invalid,
  className,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
}: SelectProps) {
  const generatedId = useId()
  const buttonId = id ?? generatedId
  const listboxId = `${buttonId}-listbox`

  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const selectedOption = options.find((option) => option.value === value)

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [open])

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {name ? (
        <input type="hidden" name={name} value={value} required={required} />
      ) : null}

      <button
        type="button"
        id={buttonId}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-required={required}
        aria-invalid={ariaInvalid ?? invalid}
        aria-describedby={ariaDescribedBy}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex w-full items-center justify-between gap-3 rounded-[4px] border border-dark-gray bg-transparent px-4 py-3",
          "type-body-2 text-left transition-colors duration-200",
          "focus:border-white focus:outline-none",
          open && "border-white",
          invalid && "border-red-500",
          selectedOption ? "text-white" : "text-gray",
        )}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span
          aria-hidden="true"
          className={cn(
            "text-gray transition-transform duration-200",
            open && "-rotate-180 text-white",
          )}
        >
          <Icon type="chevron" direction="down" size="s" />
        </span>
      </button>

      <div
        className={cn(
          "absolute left-0 right-0 top-[calc(100%+4px)] z-20 grid overflow-hidden",
          "transition-[grid-template-rows,opacity] duration-300 ease-out",
          open
            ? "grid-rows-[1fr] opacity-100"
            : "pointer-events-none grid-rows-[0fr] opacity-0",
        )}
      >
        <ul
          id={listboxId}
          role="listbox"
          aria-labelledby={buttonId}
          className={cn(
            "min-h-0 overflow-hidden rounded-[4px] border border-dark-gray bg-black",
          )}
        >
          {options.map((option) => {
            const isSelected = option.value === value
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                tabIndex={-1}
                onClick={() => {
                  onChange(option.value)
                  setOpen(false)
                }}
                className={cn(
                  "cursor-pointer px-4 py-3 type-body-2 text-white transition-colors duration-150",
                  "hover:bg-white/10",
                  isSelected && "bg-white/10",
                )}
              >
                {option.label}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
