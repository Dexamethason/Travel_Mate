/**
 * Mapowanie kodów IATA linii lotniczych na pełne nazwy
 * Źródło: IATA Airline Codes Database
 */
export interface Airline {
  code: string;
  name: string;
}

/**
 * Normalizuje tekst usuwając polskie znaki diakrytyczne
 */
function normalizeText(text: string): string {
  if (!text) return '';

  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ł/g, 'l')
    .replace(/Ł/g, 'l');
}

/**
 * Mapa kodów IATA na pełne nazwy przewoźników
 */
export const AIRLINE_NAMES: Record<string, string> = {
  // Polskie linie lotnicze
  LO: 'LOT Polish Airlines',
  W6: 'Wizz Air',

  // Popularne tanie linie w Europie
  FR: 'Ryanair',
  U2: 'easyJet',
  VY: 'Vueling',
  HV: 'Transavia',

  // Główne europejskie przewoźniki
  BA: 'British Airways',
  LH: 'Lufthansa',
  AF: 'Air France',
  KL: 'KLM Royal Dutch Airlines',
  AZ: 'ITA Airways',
  IB: 'Iberia',
  SK: 'SAS Scandinavian Airlines',
  OS: 'Austrian Airlines',
  LX: 'SWISS Airlines',
  SN: 'Brussels Airlines',
  TP: 'TAP Air Portugal',
  EI: 'Aer Lingus',

  // Niemieckie linie
  DE: 'Condor',
  EW: 'Eurowings',
  X3: 'TUI fly Deutschland',

  // Hiszpańskie i południowoeuropejskie
  UX: 'Air Europa',
  NT: 'Binter Canarias',

  // Skandynawskie
  DY: 'Norwegian Air Shuttle',
  AY: 'Finnair',
  WF: 'Widerøe',

  // Włoskie
  IG: 'Air Italy',

  // Brytyjskie
  BE: 'Flybe',
  LS: 'Jet2.com',
  VS: 'Virgin Atlantic',

  // Amerykańskie główne linie
  AA: 'American Airlines',
  UA: 'United Airlines',
  DL: 'Delta Air Lines',
  AS: 'Alaska Airlines',
  B6: 'JetBlue Airways',
  WN: 'Southwest Airlines',
  NK: 'Spirit Airlines',
  F9: 'Frontier Airlines',
  G4: 'Allegiant Air',

  // Kanadyjskie
  AC: 'Air Canada',
  WS: 'WestJet',
  PD: 'Porter Airlines',

  // Bliskowschodnie przewoźniki premium
  EK: 'Emirates',
  QR: 'Qatar Airways',
  EY: 'Etihad Airways',
  SV: 'Saudia',
  MS: 'EgyptAir',
  GF: 'Gulf Air',

  // Tureckie
  TK: 'Turkish Airlines',
  PC: 'Pegasus Airlines',

  // Rosyjskie
  SU: 'Aeroflot',
  S7: 'S7 Airlines',
  UT: 'UTair Aviation',

  // Azjatyckie - Japonia
  NH: 'All Nippon Airways',
  JL: 'Japan Airlines',

  // Azjatyckie - Chiny/Hong Kong
  CA: 'Air China',
  MU: 'China Eastern Airlines',
  CZ: 'China Southern Airlines',
  HU: 'Hainan Airlines',
  CX: 'Cathay Pacific',
  KA: 'Cathay Dragon',
  HX: 'Hong Kong Airlines',

  // Azjatyckie - Korea
  KE: 'Korean Air',
  OZ: 'Asiana Airlines',
  '7C': 'Jeju Air',

  // Azjatyckie - Singapur/Malezja
  SQ: 'Singapore Airlines',
  TR: 'Scoot',
  MI: 'SilkAir',
  MH: 'Malaysia Airlines',
  AK: 'AirAsia',
  D7: 'AirAsia X',

  // Azjatyckie - Tajlandia
  TG: 'Thai Airways',
  FD: 'Thai AirAsia',
  DD: 'Nok Air',

  // Azjatyckie - Indie
  AI: 'Air India',
  UK: 'Vistara',
  SG: 'SpiceJet',
  '6E': 'IndiGo',

  // Azjatyckie - Wietnam/Filipiny
  VN: 'Vietnam Airlines',
  BL: 'Pacific Airlines',
  VJ: 'VietJet Air',
  PR: 'Philippine Airlines',
  Z2: 'AirAsia Zest',

  // Azjatyckie - Indonezja
  GA: 'Garuda Indonesia',
  JT: 'Lion Air',
  QG: 'Citilink',
  ID: 'Batik Air',

  // Oceaniczne
  QF: 'Qantas',
  JQ: 'Jetstar Airways',
  VA: 'Virgin Australia',
  TT: 'Tiger Airways Australia',
  NZ: 'Air New Zealand',

  // Południowoamerykańskie
  LA: 'LATAM Airlines',
  AV: 'Avianca',
  CM: 'Copa Airlines',
  AR: 'Aerolíneas Argentinas',
  G3: 'Gol Transportes Aéreos',

  // Afrykańskie
  SA: 'South African Airways',
  ET: 'Ethiopian Airlines',
  KQ: 'Kenya Airways',
  AT: 'Royal Air Maroc',

  // Charterowe i cargo
  TB: 'TUI Airways',
  BY: 'TUI fly Belgium',
  OR: 'TUI fly Netherlands',
  FH: 'Freebird Airlines',
  XQ: 'SunExpress',

  // Regionalne europejskie
  WK: 'Edelweiss Air',
  HG: 'Niki',
  A3: 'Aegean Airlines',
  YM: 'Montenegro Airlines',
  JU: 'Air Serbia',
  RO: 'Tarom',
  OK: 'Czech Airlines',
};

/**
 * Funkcja pomocnicza do pobierania nazwy linii lotniczej
 * @param iataCode - Kod IATA linii lotniczej (np. 'LO', 'FR')
 * @returns Pełna nazwa linii lotniczej lub kod, jeśli nie znaleziono mapowania
 */
export function getAirlineName(iataCode: string): string {
  if (!iataCode) return 'Nieznany przewoźnik';
  return AIRLINE_NAMES[iataCode] || iataCode;
}

/**
 * Funkcja pomocnicza do pobierania nazwy z kodem w nawiasie
 * @param iataCode - Kod IATA linii lotniczej
 * @returns Pełna nazwa z kodem (np. 'LOT Polish Airlines (LO)')
 */
export function getAirlineNameWithCode(iataCode: string): string {
  if (!iataCode) return 'Nieznany przewoźnik';
  const name = AIRLINE_NAMES[iataCode];
  return name ? `${name} (${iataCode})` : iataCode;
}

/**
 * Sprawdza czy linia lotnicza istnieje w bazie
 * @param iataCode - Kod IATA linii lotniczej
 * @returns true jeśli linia istnieje w bazie
 */
export function hasAirline(iataCode: string): boolean {
  return iataCode in AIRLINE_NAMES;
}

/**
 * Pobiera wszystkie dostępne linie lotnicze jako tablicę
 * @returns Tablica obiektów z kodami i nazwami linii
 */
export function getAllAirlines(): Airline[] {
  return Object.entries(AIRLINE_NAMES)
    .map(([code, name]) => ({ code, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Wyszukuje linie lotnicze według nazwy (case-insensitive, bez polskich znaków)
 * @param query - Szukane słowo lub fraza
 * @returns Tablica pasujących linii lotniczych
 */
export function searchAirlines(query: string): Airline[] {
  if (!query) return [];

  const q = normalizeText(query);
  return getAllAirlines().filter(
    airline => normalizeText(airline.name).includes(q) || normalizeText(airline.code).includes(q)
  );
}

/**
 * Pobiera ścieżkę do logo linii lotniczej
 * @param iataCode - Kod IATA linii lotniczej
 * @returns Ścieżka do logo lub null jeśli logo nie istnieje
 */
export function getAirlineLogo(iataCode: string): string | null {
  if (!iataCode) return null;

  // Lista kodów, dla których mamy loga (zsynchronizowane z useAirlineLogo composable)
  const availableLogos = [
    'A3', // Aegean Airlines
    'EI', // Aer Lingus
    'AF', // Air France
    'OS', // Austrian Airlines
    'BA', // British Airways
    'DL', // Delta Air Lines
    'U2', // easyJet
    'EK', // Emirates
    'IB', // Iberia
    'KL', // KLM
    'LO', // LOT Polish Airlines
    'LH', // Lufthansa
    'QR', // Qatar Airways
    'FR', // Ryanair
    'SK', // SAS Scandinavian Airlines
    'LX', // SWISS Airlines
    'TK', // Turkish Airlines
    'UA', // United Airlines
    'VS', // Virgin Atlantic
  ];

  if (availableLogos.includes(iataCode)) {
    try {
      return new URL(`../assets/AirlineLogos/${iataCode}.png`, import.meta.url).href;
    } catch {
      return null;
    }
  }

  return null;
}

/**
 * Sprawdza czy logo linii lotniczej jest dostępne
 * @param iataCode - Kod IATA linii lotniczej
 * @returns true jeśli logo istnieje
 */
export function hasAirlineLogo(iataCode: string): boolean {
  const availableLogos = [
    'A3', // Aegean Airlines
    'EI', // Aer Lingus
    'AF', // Air France
    'OS', // Austrian Airlines
    'BA', // British Airways
    'DL', // Delta Air Lines
    'U2', // easyJet
    'EK', // Emirates
    'IB', // Iberia
    'KL', // KLM
    'LO', // LOT Polish Airlines
    'LH', // Lufthansa
    'QR', // Qatar Airways
    'FR', // Ryanair
    'SK', // SAS Scandinavian Airlines
    'LX', // SWISS Airlines
    'TK', // Turkish Airlines
    'UA', // United Airlines
    'VS', // Virgin Atlantic
  ];
  return availableLogos.includes(iataCode);
}
