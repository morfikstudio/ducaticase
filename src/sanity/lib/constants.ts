import { BasketIcon, CubeIcon, HeartIcon, HomeIcon, SunIcon } from "@sanity/icons"

/** Macro categoria: valore compatto, titolo IT, `_type` documento Sanity, icona desk. */
export const MACRO_CATEGORY_OPTIONS = [
  {
    title: "Residenziale",
    value: "residential",
    documentType: "listingResidential",
    icon: HomeIcon,
  },
  {
    title: "Dimore oltre la città",
    value: "countryHouses",
    documentType: "listingCountryHouses",
    icon: SunIcon,
  },
  {
    title: "Negozi e uffici",
    value: "commercial",
    documentType: "listingShopsAndOffices",
    icon: BasketIcon,
  },
  {
    title: "Industriale",
    value: "industrial",
    documentType: "listingIndustrial",
    icon: CubeIcon,
  },
  {
    title: "Hospitality",
    value: "hospitality",
    documentType: "listingHospitality",
    icon: HeartIcon,
  },
] as const

export type MacroCategoryValue =
  (typeof MACRO_CATEGORY_OPTIONS)[number]["value"]

export type ListingTypeName =
  (typeof MACRO_CATEGORY_OPTIONS)[number]["documentType"]

/** Structure builder: stesso ordine e titoli di `MACRO_CATEGORY_OPTIONS`. */
export const LISTING_DOCUMENT_SPECS = MACRO_CATEGORY_OPTIONS.map((o) => ({
  name: o.documentType,
  title: o.title,
  icon: o.icon,
}))

export const COUNTRY_HOUSE_TYPOLOGY_OPTIONS = [
  { title: "Mare", value: "sea" },
  { title: "Laghi e campagna", value: "lakesAndCountryside" },
  { title: "Montagna", value: "mountain" },
] as const

export type CountryHouseTypologyValue =
  (typeof COUNTRY_HOUSE_TYPOLOGY_OPTIONS)[number]["value"]

export const SHOPS_AND_OFFICES_TYPOLOGY_OPTIONS = [
  { title: "Negozi", value: "shops" },
  { title: "Uffici", value: "offices" },
] as const

export type ShopsAndOfficesTypologyValue =
  (typeof SHOPS_AND_OFFICES_TYPOLOGY_OPTIONS)[number]["value"]

export const INDUSTRIAL_TYPOLOGY_OPTIONS = [
  { title: "Magazzini", value: "warehouses" },
  { title: "Capannoni", value: "sheds" },
] as const

export type IndustrialTypologyValue =
  (typeof INDUSTRIAL_TYPOLOGY_OPTIONS)[number]["value"]

export const FLOOR_OPTIONS = [
  { title: "1", value: "1" },
  { title: "2", value: "2" },
  { title: "3", value: "3" },
  { title: "4", value: "4" },
  { title: "5", value: "5" },
  { title: "6", value: "6" },
  { title: "7", value: "7" },
  { title: "8", value: "8" },
  { title: "9", value: "9" },
  { title: "10", value: "10" },
  { title: "Altro", value: "other" },
  { title: "Interrato", value: "underground" },
  { title: "Seminterrato", value: "semiUnderground" },
  { title: "Piano terra", value: "groundFloor" },
  { title: "Piano rialzato", value: "raisedGroundFloor" },
  { title: "Su più livelli", value: "multiLevel" },
  { title: "Attico", value: "penthouse" },
  { title: "Ultimo piano", value: "topFloor" },
  { title: "Mansarda", value: "attic" },
  { title: "Intero stabile", value: "entireBuilding" },
] as const

export const CONDO_FEE_CURRENCY_OPTIONS = [
  { title: "Euro (€)", value: "EUR" },
  { title: "Franco svizzero (CHF)", value: "CHF" },
] as const

export const CONCIERGE_SERVICE_OPTIONS = [
  { title: "Intera giornata", value: "fullDay" },
  { title: "Mezza giornata", value: "halfDay" },
  { title: "No", value: "none" },
] as const

export const HEATING_OPTIONS = [
  { title: "Autonomo", value: "autonomous" },
  { title: "Centralizzato", value: "centralized" },
  { title: "Altro", value: "other" },
] as const

export const FURNISHING_OPTIONS = [
  { title: "Arredato", value: "furnished" },
  { title: "Non arredato", value: "unfurnished" },
  { title: "Parzialmente arredato", value: "partiallyFurnished" },
  { title: "Solo cucina arredata", value: "kitchenOnlyFurnished" },
] as const

export const GARDEN_OPTIONS = [
  { title: "Privato", value: "private" },
  { title: "Comune", value: "shared" },
  { title: "Privato e Comune", value: "privateAndShared" },
] as const

/** Classe energetica: schema normativo + classi collegate. */
export const ENERGY_CLASS_SCHEME_OPTIONS = [
  { title: "Non classificabile", value: "notClassifiable" },
  { title: "In fase di realizzazione", value: "inProgress" },
  { title: "(DL 192 del 19/08/05)", value: "dl192_2005" },
  { title: "(Legge 90/2013)", value: "law90_2013" },
] as const

export const ENERGY_CLASS_DL192_OPTIONS = [
  { title: "A+", value: "A+" },
  { title: "A", value: "A" },
  { title: "B", value: "B" },
  { title: "C", value: "C" },
  { title: "D", value: "D" },
  { title: "E", value: "E" },
  { title: "F", value: "F" },
  { title: "G", value: "G" },
] as const

export const ENERGY_CLASS_LAW90_OPTIONS = [
  { title: "A4", value: "A4" },
  { title: "A3", value: "A3" },
  { title: "A2", value: "A2" },
  { title: "A1", value: "A1" },
  { title: "B", value: "B" },
  { title: "C", value: "C" },
  { title: "D", value: "D" },
  { title: "E", value: "E" },
  { title: "F", value: "F" },
  { title: "G", value: "G" },
] as const

export const LOCATION_COUNTRY_OPTIONS = [
  { title: "Italia", value: "IT" },
  { title: "Francia", value: "FR" },
  { title: "Svizzera", value: "CH" },
  { title: "Germania", value: "DE" },
  { title: "Austria", value: "AT" },
  { title: "Spagna", value: "ES" },
  { title: "Regno Unito", value: "GB" },
  { title: "Stati Uniti", value: "US" },
] as const

export const ITALIAN_PROVINCE_OPTIONS = [
  { title: "Agrigento", value: "AG" },
  { title: "Alessandria", value: "AL" },
  { title: "Ancona", value: "AN" },
  { title: "Arezzo", value: "AR" },
  { title: "Ascoli Piceno", value: "AP" },
  { title: "Asti", value: "AT" },
  { title: "Avellino", value: "AV" },
  { title: "Bari", value: "BA" },
  { title: "Barletta-Andria-Trani", value: "BT" },
  { title: "Belluno", value: "BL" },
  { title: "Benevento", value: "BN" },
  { title: "Bergamo", value: "BG" },
  { title: "Biella", value: "BI" },
  { title: "Bologna", value: "BO" },
  { title: "Bolzano", value: "BZ" },
  { title: "Brescia", value: "BS" },
  { title: "Brindisi", value: "BR" },
  { title: "Cagliari", value: "CA" },
  { title: "Caltanissetta", value: "CL" },
  { title: "Campobasso", value: "CB" },
  { title: "Caserta", value: "CE" },
  { title: "Catania", value: "CT" },
  { title: "Catanzaro", value: "CZ" },
  { title: "Chieti", value: "CH" },
  { title: "Como", value: "CO" },
  { title: "Cosenza", value: "CS" },
  { title: "Cremona", value: "CR" },
  { title: "Crotone", value: "KR" },
  { title: "Cuneo", value: "CN" },
  { title: "Enna", value: "EN" },
  { title: "Fermo", value: "FM" },
  { title: "Ferrara", value: "FE" },
  { title: "Firenze", value: "FI" },
  { title: "Foggia", value: "FG" },
  { title: "Forlì-Cesena", value: "FC" },
  { title: "Frosinone", value: "FR" },
  { title: "Genova", value: "GE" },
  { title: "Gorizia", value: "GO" },
  { title: "Grosseto", value: "GR" },
  { title: "Imperia", value: "IM" },
  { title: "Isernia", value: "IS" },
  { title: "L'Aquila", value: "AQ" },
  { title: "La Spezia", value: "SP" },
  { title: "Latina", value: "LT" },
  { title: "Lecce", value: "LE" },
  { title: "Lecco", value: "LC" },
  { title: "Livorno", value: "LI" },
  { title: "Lodi", value: "LO" },
  { title: "Lucca", value: "LU" },
  { title: "Macerata", value: "MC" },
  { title: "Mantova", value: "MN" },
  { title: "Massa-Carrara", value: "MS" },
  { title: "Matera", value: "MT" },
  { title: "Messina", value: "ME" },
  { title: "Milano", value: "MI" },
  { title: "Modena", value: "MO" },
  { title: "Monza e Brianza", value: "MB" },
  { title: "Napoli", value: "NA" },
  { title: "Novara", value: "NO" },
  { title: "Nuoro", value: "NU" },
  { title: "Oristano", value: "OR" },
  { title: "Padova", value: "PD" },
  { title: "Palermo", value: "PA" },
  { title: "Parma", value: "PR" },
  { title: "Pavia", value: "PV" },
  { title: "Perugia", value: "PG" },
  { title: "Pesaro e Urbino", value: "PU" },
  { title: "Pescara", value: "PE" },
  { title: "Piacenza", value: "PC" },
  { title: "Pisa", value: "PI" },
  { title: "Pistoia", value: "PT" },
  { title: "Pordenone", value: "PN" },
  { title: "Potenza", value: "PZ" },
  { title: "Prato", value: "PO" },
  { title: "Ragusa", value: "RG" },
  { title: "Ravenna", value: "RA" },
  { title: "Reggio Calabria", value: "RC" },
  { title: "Reggio Emilia", value: "RE" },
  { title: "Rieti", value: "RI" },
  { title: "Rimini", value: "RN" },
  { title: "Roma", value: "RM" },
  { title: "Rovigo", value: "RO" },
  { title: "Salerno", value: "SA" },
  { title: "Sassari", value: "SS" },
  { title: "Savona", value: "SV" },
  { title: "Siena", value: "SI" },
  { title: "Siracusa", value: "SR" },
  { title: "Sondrio", value: "SO" },
  { title: "Sud Sardegna", value: "SU" },
  { title: "Taranto", value: "TA" },
  { title: "Teramo", value: "TE" },
  { title: "Terni", value: "TR" },
  { title: "Torino", value: "TO" },
  { title: "Trapani", value: "TP" },
  { title: "Trento", value: "TN" },
  { title: "Treviso", value: "TV" },
  { title: "Trieste", value: "TS" },
  { title: "Udine", value: "UD" },
  { title: "Valle d'Aosta", value: "AO" },
  { title: "Varese", value: "VA" },
  { title: "Verbano-Cusio-Ossola", value: "VB" },
  { title: "Vercelli", value: "VC" },
  { title: "Venezia", value: "VE" },
  { title: "Verona", value: "VR" },
  { title: "Vibo Valentia", value: "VV" },
  { title: "Vicenza", value: "VI" },
  { title: "Viterbo", value: "VT" },
] as const

export const MAX_MAIN_IMAGE_BYTES = 2 * 1024 * 1024
export const MAX_FLOOR_PLAN_PDF_BYTES = 10 * 1024 * 1024

/** Layout spazi ufficio (listing commerciali). */
export const OFFICE_LAYOUT_OPTIONS = [
  { title: "Open space", value: "openSpace" },
  { title: "Uffici singoli", value: "individualOffices" },
  { title: "Altro", value: "other" },
] as const

export const CAR_BOX_OPTIONS = [
  { title: "Singolo", value: "single" },
  { title: "Doppio", value: "double" },
  { title: "Altro", value: "other" },
] as const

export const PARKING_SPACES_OPTIONS = [
  { title: "Coperto", value: "covered" },
  { title: "Scoperto", value: "uncovered" },
  { title: "Altro", value: "other" },
] as const

export const POOL_OPTIONS = [
  { title: "Sì", value: "yes" },
  { title: "Condominiale", value: "condominium" },
] as const

export const CLIMATE_CONTROL_OPTIONS = [
  { title: "Autonomo", value: "autonomous" },
  { title: "Centralizzato", value: "centralized" },
  { title: "Predisposizione impianto", value: "preInstallation" },
] as const
