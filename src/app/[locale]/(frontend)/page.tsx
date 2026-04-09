import { Link } from "@/i18n/navigation"

export default async function Page() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="type-display-1 text-gray">Ducati Case</h1>
      <Link href="/immobili">IMMOBILI</Link>
    </main>
  )
}
