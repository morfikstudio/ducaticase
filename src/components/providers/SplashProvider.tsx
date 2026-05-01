"use client"

import { createContext, useContext, useState } from "react"

type SplashContextValue = {
  splashDone: boolean
  onSplashDone: () => void
}

const SplashContext = createContext<SplashContextValue>({
  splashDone: true,
  onSplashDone: () => {},
})

export function SplashProvider({ children }: { children: React.ReactNode }) {
  const [splashDone, setSplashDone] = useState(false)

  return (
    <SplashContext.Provider
      value={{ splashDone, onSplashDone: () => setSplashDone(true) }}
    >
      {children}
    </SplashContext.Provider>
  )
}

export function useSplashContext() {
  return useContext(SplashContext)
}
