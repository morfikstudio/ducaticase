import type { ReactNode } from "react"

export function CaptionBlockStyle({ children }: { children: ReactNode }) {
  return <span style={{ fontSize: "13px", fontWeight: 400 }}>{children}</span>
}
