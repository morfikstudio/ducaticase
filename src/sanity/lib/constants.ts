import {
  BasketIcon,
  CubeIcon,
  EarthGlobeIcon,
  HeartIcon,
  HomeIcon,
  SunIcon,
} from "@sanity/icons"

export const CATEGORY_OPTIONS = [
  {
    title: { it: "Residenziale", en: "Residential" },
    value: "residential",
    documentType: "listingResidential",
    icon: HomeIcon,
  },
  {
    title: { it: "Dimore oltre la città", en: "Country homes" },
    value: "countryHouses",
    documentType: "listingCountryHouses",
    icon: SunIcon,
  },
  {
    title: { it: "Negozi e uffici", en: "Shops and offices" },
    value: "commercial",
    documentType: "listingShopsAndOffices",
    icon: BasketIcon,
  },
  {
    title: { it: "Industriale", en: "Industrial" },
    value: "industrial",
    documentType: "listingIndustrial",
    icon: CubeIcon,
  },
  {
    title: { it: "Hospitality", en: "Hospitality" },
    value: "hospitality",
    documentType: "listingHospitality",
    icon: HeartIcon,
  },
  {
    title: { it: "Terreni", en: "Land" },
    value: "land",
    documentType: "listingLand",
    icon: EarthGlobeIcon,
  },
] as const

export type CategoryValue = (typeof CATEGORY_OPTIONS)[number]["value"]

export type ListingTypeName = (typeof CATEGORY_OPTIONS)[number]["documentType"]

export const LISTING_DOCUMENT_SPECS = CATEGORY_OPTIONS.map((o) => ({
  name: o.documentType,
  title: o.title.it,
  icon: o.icon,
}))

export type LocalizedTypologyOption = {
  value: string
  title: { it: string; en: string }
}

export type LocalizedLabel = {
  it: string
  en: string
}

export const FIELD_LABELS = {
  priceEur: { it: "Prezzo (€)", en: "Price (€)" },
  amount: { it: "Importo", en: "Amount" },
  noPriceReason: {
    it: "Seleziona opzione senza prezzo",
    en: "Select no-price option",
  },
  hasChangingRoom: { it: "Spogliatoio", en: "Changing room" },
  commercialAreaSqm: {
    it: "Superficie commerciale (mq)",
    en: "Commercial area (sqm)",
  },
} as const satisfies Record<string, LocalizedLabel>

export const OPTIONAL_FIELD_LABELS: Record<string, LocalizedLabel> = {
  furnishing: { it: "Arredamento", en: "Furnishing" },
  garden: { it: "Giardino", en: "Garden" },
  carBox: { it: "Box auto", en: "Garage" },
  parkingSpaces: { it: "Posti auto", en: "Parking spaces" },
  hasBalcony: { it: "Balcone", en: "Balcony" },
  hasTerrace: { it: "Terrazzo", en: "Terrace" },
  hasCellar: { it: "Cantina", en: "Cellar" },
  hasAtticRoom: { it: "Solaio", en: "Attic room" },
  hasTavern: { it: "Taverna", en: "Tavern" },
  hasAlarmSystem: { it: "Impianto d'allarme", en: "Alarm system" },
  pool: { it: "Piscina", en: "Pool" },
  hasTennisCourt: { it: "Campo da tennis", en: "Tennis court" },
  hasAccessibleAccess: { it: "Accesso per disabili", en: "Accessible access" },
  climateControl: { it: "Impianto di climatizzazione", en: "Climate control" },
  outdoorAreaSqm: { it: "Superficie terreno (mq)", en: "Outdoor area (sqm)" },
  condoFees: { it: "Spese condominiali", en: "Condo fees" },
  hasAccessibleRestroom: {
    it: "Bagno per disabili",
    en: "Accessible restroom",
  },
  hasFlue: { it: "Canna fumaria", en: "Flue" },
  hasFireProtectionSystem: {
    it: "Impianto antincendio",
    en: "Fire protection system",
  },
  hasLoadingUnloading: { it: "Carico e scarico", en: "Loading and unloading" },
  hasDrivewayAccess: { it: "Passo carrabile", en: "Driveway access" },
  conciergeServiceShops: {
    it: "Servizio portineria / Reception",
    en: "Concierge / Reception",
  },
  officeLayout: { it: "Disposizione interni", en: "Office layout" },
  hasLoadingDocks: { it: "Banchine di carico/scarico", en: "Loading docks" },
  hasOverheadCranes: { it: "Carroponti", en: "Overhead cranes" },
  shedAreaSqm: { it: "Superficie Capannone (mq)", en: "Shed area (sqm)" },
  officeAreaSqm: { it: "Superficie Uffici (mq)", en: "Office area (sqm)" },
  landAreaSqm: { it: "Superficie Terreno (mq)", en: "Land area (sqm)" },
  hasChangingRoom: { it: "Spogliatoio", en: "Changing room" },
  hasFencedProperty: { it: "Proprietà recintata", en: "Fenced property" },
  conciergeService: {
    it: "Servizio portineria / Reception",
    en: "Concierge / Reception",
  },
  hasDrivableAccess: { it: "Accesso carrabile", en: "Drivable access" },
  heating: { it: "Riscaldamento", en: "Heating" },
  customSpecifications: {
    it: "Specifiche aggiuntive",
    en: "Additional specifications",
  },
  buildable: { it: "Edificabile", en: "Buildable" },
  agricultural: { it: "Agricolo", en: "Agricultural" },
}

export function typologyOptionsForStudio(
  options: ReadonlyArray<LocalizedTypologyOption>,
): Array<{ title: string; value: string }> {
  return options.map((o) => ({ value: o.value, title: o.title.it }))
}

export const COUNTRY_HOUSE_TYPOLOGY_OPTIONS = [
  {
    value: "sea",
    title: { it: "Mare", en: "Sea" },
  },
  {
    value: "lakesAndCountryside",
    title: { it: "Laghi e campagna", en: "Lakes and countryside" },
  },
  {
    value: "mountain",
    title: { it: "Montagna", en: "Mountain" },
  },
] as const satisfies readonly LocalizedTypologyOption[]

export type CountryHouseTypologyValue =
  (typeof COUNTRY_HOUSE_TYPOLOGY_OPTIONS)[number]["value"]

export const SHOPS_AND_OFFICES_TYPOLOGY_OPTIONS = [
  {
    value: "shops",
    title: { it: "Negozi", en: "Shops" },
  },
  {
    value: "offices",
    title: { it: "Uffici", en: "Offices" },
  },
] as const satisfies readonly LocalizedTypologyOption[]

export type ShopsAndOfficesTypologyValue =
  (typeof SHOPS_AND_OFFICES_TYPOLOGY_OPTIONS)[number]["value"]

export const INDUSTRIAL_TYPOLOGY_OPTIONS = [
  {
    value: "warehouses",
    title: { it: "Magazzini", en: "Warehouses" },
  },
  {
    value: "sheds",
    title: { it: "Capannoni", en: "Sheds" },
  },
] as const satisfies readonly LocalizedTypologyOption[]

export type IndustrialTypologyValue =
  (typeof INDUSTRIAL_TYPOLOGY_OPTIONS)[number]["value"]

export const PRICE_FALLBACK_OPTIONS = [
  {
    value: "privateNegotiation",
    title: { it: "Trattativa riservata", en: "Private negotiation" },
  },
  {
    value: "priceOnRequest",
    title: { it: "Prezzo su richiesta", en: "Price on request" },
  },
] as const satisfies readonly LocalizedTypologyOption[]

export type PriceFallbackValue =
  (typeof PRICE_FALLBACK_OPTIONS)[number]["value"]

export const LISTING_CONTRACT_TYPE_OPTIONS = [
  {
    value: "sale",
    title: { it: "Vendita", en: "Sale" },
  },
  {
    value: "rent",
    title: { it: "Affitto", en: "Rent" },
  },
] as const satisfies readonly LocalizedTypologyOption[]

export type ListingContractTypeValue =
  (typeof LISTING_CONTRACT_TYPE_OPTIONS)[number]["value"]

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

export const LAND_ACCESS_OPTIONS = [
  { title: "Strada asfaltata", value: "asphalt" },
  { title: "Strada sterrata", value: "dirt" },
  { title: "Altro", value: "other" },
] as const

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
  { title: "Svizzera", value: "CH" },
  { title: "Austria", value: "AT" },
  { title: "Francia", value: "FR" },
  { title: "Germania", value: "DE" },
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
