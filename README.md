# Ducati Case

Real estate listings site built with [Sanity.io](https://sanity.io) and [Next.js](https://nextjs.org). **Locales:** Italian (default) and English. The content model supports several listing types (residential, country homes, shops/offices and industrial each with a typology field); the frontend home is still evolving.

## Tech stack

- **Next.js 16** (App Router)
- **React 19**
- **Sanity v5** (Studio at `/studio`, Vision, Italian UI)
- **Tailwind CSS 4**
- **next-intl** (routing `/it` and `/en`, UI strings in `messages/`)
- **TypeScript** with Sanity TypeGen
- **GSAP**, **Lenis**, **Zustand** (animation, scroll, UI state)

## Prerequisites

- **Node.js v24.13.1** — `.nvmrc` is in the repo root; run `nvm use` before `npm install` and `npm run dev`.
- A [Sanity](https://sanity.io) account

## Pages

- **Home (IT)** — `/it`
- **Home (EN)** — `/en`
- **`/`** — redirects to the default (`/it`; browser/cookie detection is disabled so Italian stays the baseline)
- **Sanity Studio** — `/studio` (no locale prefix)

## Content model

- **`siteContent`** — global site content; translations via **document internationalization** (one document per locale, IT/EN in Studio).
- **Listing** — dedicated document types; user-facing copy (label, excerpt, description) is **localized** (`it` / `en` on the same document); numbers, structured addresses, enums, and media are shared:
  - Residential (`listingResidential`)
  - Country homes (`listingCountryHouses`)
  - Shops and offices (`listingShopsAndOffices`) — a single `_type` with required **`shopsAndOfficesTypology`** (`shops` | `offices`). Studio shows one desk entry (“Negozi e uffici”). Shop-only fields (e.g. display windows) and office-only fields (e.g. office layout, optional) are shown based on that typology. Concierge is stored as **`conciergeService`** (offices, property sheet, required when typology is offices) or **`conciergeServiceShops`** (shops, optional fields); in GROQ use e.g. `coalesce(conciergeService, conciergeServiceShops)` if you need a single value.
  - Industrial (`listingIndustrial`) — required **`industrialTypology`** (`warehouses` for Magazzini | `sheds` for Capannoni). One desk entry (“Industriale”). Required for both typologies: commercial area, **height** (`heightMeters`, metres), floor, energy class; **building year** is shown and required only for Magazzini (`warehouses`); it is hidden for Capannoni (`sheds`). Optional fields **only for Capannoni** (`sheds`): loading docks, overhead cranes, shed/office/land areas (`shedAreaSqm`, `officeAreaSqm`, `landAreaSqm`), changing room, fenced property, **`conciergeService`** — hidden for Magazzini. **`hasLoadingUnloading`** (“Carico e scarico”) is shown for Magazzini only; hidden for Capannoni. Optional for **both** typologies: **`hasDrivableAccess`** (“Accesso carrabile”; distinct from `hasDrivewayAccess` / “Passo carrabile”). Heating is optional.

Schemas live in `src/sanity/schemaTypes/`. After schema changes, run `npm run typegen` (requires `.env.local` with Project ID and dataset).

**Migrating existing content:** if your dataset still has documents with `_type` `listingShops` or `listingOffices`, convert them before relying on the new schema: set `_type` to `listingShopsAndOffices`, add `shopsAndOfficesTypology: "shops"` or `"offices"` to match the former type, then remove the old `_type` (use a one-off [Sanity migration](https://www.sanity.io/docs/migrations) or a small script with `@sanity/client`).

**Frontend:** GROQ queries receive `locale` where needed; when `en` is optional, copy falls back to `it` (see `src/sanity/lib/locale.ts`).

## Internationalization (Next.js)

- Config: `src/i18n/` (`routing.ts`, `request.ts`, `navigation.ts` for typed `Link` / redirects).
- Middleware: `src/middleware.ts` (excludes `/studio` and static assets).
- Root layout: `src/app/layout.tsx` (shared `<html>` / `<body>` with Studio); localized layout: `src/app/[locale]/`.
- Optional in production: `NEXT_PUBLIC_SITE_URL` for metadata/canonical URLs.

## Sanity setup

### 1. Create a Sanity project

- Go to [sanity.io/manage](https://sanity.io/manage) → **Create project**, or
- From the project folder: `npx sanity@latest init` and choose **Create new project**.

Save the **Project ID**.

### 2. Create datasets

In [sanity.io/manage](https://sanity.io/manage) → your project → **Datasets**: create `production` and, if needed, `development`.

From the CLI (with `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` in `.env.local`):

```bash
nvm use
npx sanity dataset create production
npx sanity dataset create development   # optional
```

### 3. Deploy the schema

```bash
nvm use
npx sanity schema deploy
```

### 4. Content

Add listings and content from **Sanity Studio** (`/studio` locally).

**Promote everything from development to production** (replaces production content):

```bash
npm run promote:dev-to-prod
```

Warning: this overwrites production with development. Use only when intentional.

## App setup

1. **Install dependencies**

   ```bash
   nvm use
   npm install
   ```

2. **Environment variables**

   Copy `.env.example` to `.env.local` and set at least:

   ```env
   NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
   NEXT_PUBLIC_SANITY_DATASET=production
   ```

   Optional: `NEXT_PUBLIC_SANITY_API_VERSION` (default: `2026-02-23`), `NEXT_PUBLIC_ALLOW_INDEXING`, `NEXT_PUBLIC_SITE_URL` (public site URL, SEO), `SANITY_API_TOKEN` (if needed for scripts or integrations).

3. **Development server**

   ```bash
   nvm use
   npm run dev
   ```

   - **Site:** [http://localhost:3000/it](http://localhost:3000/it) (or `/en`)
   - **Studio:** [http://localhost:3000/studio](http://localhost:3000/studio)

## Scripts

| Command                       | Description                                             |
| ----------------------------- | ------------------------------------------------------- |
| `npm run dev`                 | Start the development server                            |
| `npm run build`               | Production build                                        |
| `npm run start`               | Start the production server                             |
| `npm run typegen`             | Extract schema and regenerate Sanity types              |
| `npm run promote:dev-to-prod` | Copy development dataset → production (overwrites prod) |
| `npm run lint`                | Run ESLint                                              |
| `npm run format`              | Format with Prettier                                    |
| `npm run format:check`        | Check Prettier formatting                               |

## Project structure

- **`src/app/`** — App Router: `[locale]/(frontend)` for the site, `studio` for Studio
- **`src/i18n/`** — `next-intl` routing and request config
- **`messages/`** — UI strings for `it` / `en`
- **`src/sanity/`** — Sanity config, schema, GROQ queries, client
- **`src/components/`** — Shared components (e.g. `i18n/`, providers, images)

## Revalidation

Pages that read from Sanity use `revalidate: 60` (seconds). Webhooks and on-demand revalidation are not configured.
