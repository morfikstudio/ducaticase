# Ducati Case

Sito per annunci immobiliari basato su [Sanity.io](https://sanity.io) e [Next.js](https://nextjs.org). Il modello contenuti distingue più tipologie di listing (residenziale, terreni, uffici, ecc.); il frontend è in evoluzione sulla home.

## Tech stack

- **Next.js 16** (App Router)
- **React 19**
- **Sanity v5** (Studio su `/studio`, Vision, interfaccia in italiano)
- **Tailwind CSS 4**
- **TypeScript** con Sanity TypeGen
- **GSAP**, **Lenis**, **Zustand** (animazioni, scroll, stato UI)

## Prerequisiti

- **Node.js v24.13.1** — in root c’è `.nvmrc`; eseguire `nvm use` prima di `npm install` e `npm run dev`.
- Account [Sanity](https://sanity.io)

## Pagine

- **Home** — `/`
- **Sanity Studio** — `/studio`

## Content model

- **`siteContent`** — documento singleton per contenuti generali del sito (es. titolo).
- **Listing** — tipologie documento dedicate, ciascuna con campi propri (posizione, superfici, servizi, media, ecc.):
  - Residenziale (`listingResidential`)
  - Dimore oltre la città (`listingCountryHouses`)
  - Uffici e negozi (`listingOfficesAndRetail`)
  - Industriale (`listingIndustrial`)
  - Hospitality (`listingHospitality`)
  - Terreni (`listingLand`)

Gli schema sono in `src/sanity/schemaTypes/`. Dopo modifiche allo schema: `npm run typegen` (richiede `.env.local` con Project ID e dataset).

## Setup Sanity

### 1. Crea un progetto Sanity

- Vai su [sanity.io/manage](https://sanity.io/manage) → **Create project**, oppure
- Dalla cartella del progetto: `npx sanity@latest init` e scegli **Create new project**.

Annota il **Project ID**.

### 2. Crea i dataset

In [sanity.io/manage](https://sanity.io/manage) → tuo progetto → **Datasets**: crea `production` e, se serve, `development`.

Da CLI (con `NEXT_PUBLIC_SANITY_PROJECT_ID` e `NEXT_PUBLIC_SANITY_DATASET` in `.env.local`):

```bash
nvm use
npx sanity dataset create production
npx sanity dataset create development   # opzionale
```

### 3. Deploy dello schema

```bash
nvm use
npx sanity schema deploy
```

### 4. Contenuto

Inserisci annunci e contenuti da **Sanity Studio** (`/studio` in locale).

**Promuovere tutto da development a production** (sostituisce il contenuto di production):

```bash
npm run promote:dev-to-prod
```

Attenzione: sovrascrive production con development. Usare solo quando sei sicuro.

## Setup app

1. **Installa le dipendenze**

   ```bash
   nvm use
   npm install
   ```

2. **Variabili d’ambiente**

   Copia `.env.example` in `.env.local` e compila almeno:

   ```env
   NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
   NEXT_PUBLIC_SANITY_DATASET=production
   ```

   Opzionale: `NEXT_PUBLIC_SANITY_API_VERSION` (default: `2026-02-23`), `NEXT_PUBLIC_ALLOW_INDEXING`, `SANITY_API_TOKEN` (se serve per script o integrazioni).

3. **Avvio in sviluppo**

   ```bash
   nvm use
   npm run dev
   ```

   - **Sito:** [http://localhost:3000](http://localhost:3000)
   - **Studio:** [http://localhost:3000/studio](http://localhost:3000/studio)

## Scripts

| Comando                       | Descrizione                                               |
| ----------------------------- | --------------------------------------------------------- |
| `npm run dev`                 | Avvia il server di sviluppo                               |
| `npm run build`               | Build di produzione                                       |
| `npm run start`               | Avvia il server di produzione                             |
| `npm run typegen`             | Estrae lo schema e rigenera i tipi Sanity                 |
| `npm run promote:dev-to-prod` | Copia dataset development → production (sovrascrive prod) |
| `npm run lint`                | Esegue ESLint                                             |
| `npm run format`              | Formatta con Prettier                                     |
| `npm run format:check`        | Verifica formattazione Prettier                           |

## Struttura progetto

- **`src/app/`** — Next.js App Router (`(frontend)` per il sito, `studio` per il Studio)
- **`src/sanity/`** — Config Sanity, schema, query GROQ, client
- **`src/components/`** — Componenti condivisi (es. provider, immagini)

## Revalidation

La home usa fetch verso Sanity con `revalidate: 60` (secondi). Non sono configurati webhook né revalidate on-demand.
