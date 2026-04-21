export const GLOBAL_NAV_ITEMS = [
  { path: "/", label: { it: "Home", en: "Home" } },
  {
    path: "/affidaci-il-tuo-immobile",
    label: { it: "Affidaci il tuo immobile", en: "List your property with us" },
  },
  {
    path: "/immobili",
    label: { it: "I nostri immobili", en: "Our listings" },
  },
  {
    path: "/ricerca-su-misura",
    label: { it: "Ricerca su misura", en: "Tailored research" },
  },
  {
    path: "/ducati-per-le-aziende",
    label: { it: "Ducati per le aziende", en: "Ducati for companies" },
  },
  { path: "/about", label: { it: "Chi siamo", en: "About us" } },
  { path: "/contact", label: { it: "Contatti", en: "Contact" } },
] as const

export type SiteNavPath = (typeof GLOBAL_NAV_ITEMS)[number]["path"]

/** Sanity dropdown options (e.g. About page CTA internal path). */
export const INTERNAL_SITE_PATH_OPTIONS = GLOBAL_NAV_ITEMS.map(
  ({ path, label }) => ({
    title: `${label.it} · ${label.en}`,
    value: path,
  }),
) as readonly { title: string; value: string }[]

export const SITE_MENU_NAV_ITEMS = [
  {
    path: "/affidaci-il-tuo-immobile",
    label: { it: "Affidaci il tuo immobile", en: "List your property with us" },
  },
  {
    path: "/immobili",
    label: { it: "I nostri immobili", en: "Our listings" },
  },
  {
    path: "/ricerca-su-misura",
    label: { it: "Ricerca su misura", en: "Tailored research" },
  },
  {
    path: "/ducati-per-le-aziende",
    label: { it: "Ducati per le aziende", en: "Ducati for companies" },
  },
  { path: "/about", label: { it: "Chi siamo", en: "About us" } },
  { path: "/contact", label: { it: "Contatti", en: "Contact" } },
] as const

export const SITE_MENU_SOCIAL_LINKS = [
  {
    href: "https://www.facebook.com/ducaticase",
    label: { it: "Facebook", en: "Facebook" },
  },
  {
    href: "https://www.instagram.com/ducaticase",
    label: { it: "Instagram", en: "Instagram" },
  },
  {
    href: "https://it.linkedin.com/company/ducati-case-srl",
    label: { it: "LinkedIn", en: "LinkedIn" },
  },
] as const
