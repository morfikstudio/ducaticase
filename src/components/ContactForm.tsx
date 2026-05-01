"use client"

import { useEffect } from "react"

import { useGsapReveal } from "@/hooks/useGsapReveal"

export type ContactFormProps = {
  id: string
}

export function ContactForm({ id }: ContactFormProps) {
  const { ref: wrapRef } = useGsapReveal()

  /* SCROLL TO FORM ON PAGE LOAD */
  useEffect(() => {
    const hash = window.location.hash
    if (!hash) return

    const id = hash.replace(/^#/, "")
    const timer = setTimeout(() => {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return id ? (
    <div
      ref={wrapRef}
      style={{ opacity: 0 }}
      id={id}
      className="h-screen w-full flex items-center justify-center bg-dark"
    >
      <span>CONTACT FORM PLACEHOLDER</span>
    </div>
  ) : null
}
