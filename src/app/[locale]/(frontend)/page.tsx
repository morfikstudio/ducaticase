import { SplitBanner } from "@/components/split-banner"
import { StatementHero } from "@/components/statement-hero"
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
      <SplitBanner
        title="Affidaci il tuo immobile"
        description="Vendere un immobile richiede strategia, esperienza e controllo di ogni dettaglio.<br />Dalla valutazione immobiliare alla negoziazione, fino al rogito, gestiamo l'intero processo con un approccio professionale e strutturato, coordinando ogni aspetto tecnico, legale e fiscale."
        ctaLabel="Valorizza e vendi con noi"
        ctaHref="/immobili"
        imageSrc="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80"
        imageAlt="Interno luminoso con soggiorno open space e ampie vetrate"
      />
      <SplitBanner
        title="Ducati case per le aziende"
        description="Affianchiamo aziende, brand e investitori nell’acquisto e locazione di immobili commerciali e corporate.<br />Operiamo con una visione consulenziale su asset strategici, supportando operazioni di espansione, posizionamento e riorganizzazione immobiliare."
        ctaLabel="Scopri il settore corporate"
        ctaHref="/immobili"
        imageSrc="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80"
        imageAlt="Interno luminoso con soggiorno open space e ampie vetrate"
        reverse
      />
      <SplitBanner
        title="Ricerca su misura"
        description="Ogni esigenza immobiliare è diversa.<br />Attiviamo ricerche mirate, anche su opportunità riservate e off-market, per individuare soluzioni coerenti con obiettivi patrimoniali e strategie di investimento."
        ctaLabel="Scopri di più"
        ctaHref="/immobili"
        imageSrc="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80"
        imageAlt="Interno luminoso con soggiorno open space e ampie vetrate"
      />
      <Spacer />
    </main>
  )
}
