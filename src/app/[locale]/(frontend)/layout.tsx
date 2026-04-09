import BreakpointProvider from "@/components/providers/BreakpointProvider"
import LenisProvider from "@/components/providers/LenisProvider"
import FocusVisibleModality from "@/components/providers/FocusVisibleProvider"

export default function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <LenisProvider>
      {children}
      <BreakpointProvider />
      <FocusVisibleModality />
    </LenisProvider>
  )
}
