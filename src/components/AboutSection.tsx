"use client"

import { useGsapReveal } from "@/hooks/useGsapReveal"

import { cn } from "@/utils/classNames"

import { Container } from "@/components/ui/Container"

type AboutSectionProps = {
  title: string
  subtitle: string
  text: string
}

export function AboutSection({ title, subtitle, text }: AboutSectionProps) {
  const { ref: wrapRef } = useGsapReveal()

  return (
    <div
      className={cn(
        "relative isolate w-full",
        "bg-light-gray text-accent",
        "flex flex-col py-16 md:py-24 lg:py-32",
        "lg:min-h-svh",
      )}
    >
      <div
        ref={wrapRef}
        style={{ opacity: 0 }}
        className="flex w-full flex-1 md:items-center"
      >
        <Container className="w-full">
          <div
            className={cn(
              "grid grid-cols-12 gap-y-10 md:items-start md:gap-y-0",
              "h-full",
            )}
          >
            <p
              className={cn(
                "col-span-12 md:col-span-4",
                "type-body-3 font-semibold uppercase tracking-[0.08em]",
                "xl:col-start-2",
              )}
            >
              {title}
            </p>
            <div
              className={cn(
                "col-span-12 flex flex-col max-md:justify-end md:col-start-6 md:col-span-6",
                "xl:col-start-7 xl:col-span-5",
                "gap-6 md:gap-8",
              )}
            >
              <h3 className="type-heading-1 max-md:mt-24">{subtitle}</h3>
              <p className="type-body-2">{text}</p>
            </div>
          </div>
        </Container>
      </div>
    </div>
  )
}
