import { StatementHero } from "@/components/StatementHero"
import { Spacer } from "@/components/ui/Spacer"

export default async function Page() {
  return (
    <main>
      <StatementHero
        title="Una storia di immobili,<br />una visione per il futuro."
        imageSrc="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80"
        imageAlt="Architettura moderna al crepuscolo, esterni minimal con illuminazione calda"
      />
      <Spacer />
      <Spacer />
    </main>
  )
}
