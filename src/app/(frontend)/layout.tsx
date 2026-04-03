import BreakpointProvider from "@/components/providers/BreakpointProvider"
import LenisProvider from "@/components/providers/LenisProvider"

export default function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <LenisProvider>
      {children}
      <BreakpointProvider />
    </LenisProvider>
  )
}
