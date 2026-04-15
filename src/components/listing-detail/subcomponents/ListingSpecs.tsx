"use client"

import { useEffect, useLayoutEffect } from "react"
import gsap from "gsap"

import { useInView } from "@/hooks/useInView"

import { prefersReducedMotion } from "@/utils/reducedMotion"
import { cn } from "@/utils/classNames"

type SpecRowData = {
  label: string
  value: string
}

/** Placeholder: replace with Sanity-driven data. */
const LEFT_SPEC_ROWS: SpecRowData[] = [
  { label: "Terrazzo", value: "Sì" },
  { label: "Pavimenti", value: "Sì" },
  { label: "Portineria", value: "Sì" },
  { label: "Box", value: "Sì" },
  { label: "Piano", value: "5/6" },
  { label: "Anno di costruzione", value: "1960" },
  { label: "Riscaldamento", value: "Centralizzato" },
]

/** Placeholder: replace with Sanity-driven data. */
const RIGHT_SPEC_ROWS: SpecRowData[] = [
  { label: "Terrazzo", value: "Sì" },
  { label: "Pavimenti", value: "Sì" },
  { label: "Portineria", value: "Sì" },
  { label: "Lorem ipsum", value: "A partire da € 80.000" },
  { label: "Piano", value: "5/6" },
  { label: "Tipo di impianto", value: "A radiatori" },
  { label: "Tipo di alimentazione", value: "Metano" },
]

function SpecColumn({ rows }: { rows: SpecRowData[] }) {
  return (
    <dl className="min-w-0">
      {rows.map((row, index) => (
        <div
          key={`${row.label}-${index}`}
          className={cn(
            "flex flex-row items-baseline justify-between gap-4",
            "border-b border-dark py-5",
            "-mx-6 px-6 md:mx-0 md:px-8",
          )}
        >
          <dt className="type-body-2 shrink-0 text-gray">{row.label}</dt>
          <dd className="type-body-2 min-w-0 text-right text-primary wrap-break-word">
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}

export function ListingSpecs() {
  const { ref: sectionRef, show } = useInView()

  /* Initial state */
  useLayoutEffect(() => {
    if (!sectionRef.current) return
    gsap.set(sectionRef.current, { opacity: 0, y: 20 })
  }, [])

  /* Entry animation */
  useEffect(() => {
    if (!show || !sectionRef.current) return

    if (prefersReducedMotion()) {
      gsap.set(sectionRef.current, { opacity: 1, y: 0 })
      return
    }

    gsap.to(sectionRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
      clearProps: "all",
    })
  }, [show])

  return (
    <section ref={sectionRef} className="w-full">
      <h2 className="type-heading-1 text-primary">Caratteristiche</h2>

      <div className="grid grid-cols-1 gap-y-0 md:grid-cols-2 md:gap-x-6 mt-6">
        <SpecColumn rows={LEFT_SPEC_ROWS} />
        <SpecColumn rows={RIGHT_SPEC_ROWS} />
      </div>
    </section>
  )
}
