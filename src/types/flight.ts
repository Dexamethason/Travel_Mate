export interface SearchForm {
  from: string;
  to: string;
  departure: string;
  return: string;
  adults: number;
  children: number;
  tripType: 'roundTrip' | 'oneWay';
}

export interface FlightSearchParams {
  from: string;
  to: string;
  date: string;
  returnDate?: string;
  passengers?: number;
}

export interface Flight {
  id: string;
  airline: string;
  stops: string;
  departureTime: string;
  departureAirport: string;
  arrivalTime: string;
  arrivalAirport: string;
  duration: string;
  type: string;
  price: number;

  // Pola dla lotu powrotnego (opcjonalne)
  returnAirline?: string;
  returnStops?: string;
  returnDepartureTime?: string;
  returnDepartureAirport?: string;
  returnArrivalTime?: string;
  returnArrivalAirport?: string;
  returnDuration?: string;
}

export interface Location {
  code: string;
  name: string;
  city: string;
}

export interface FlightFiltersType {
  // Cena
  priceMin?: number;
  priceMax?: number;
  currency?: string;

  // Przesiadki
  directOnly?: boolean; // NIE UŻYWANE
  maxStops?: number | null; // NIE UŻYWANE
  excludedStops?: number[]; // [0, 1, 2] - wykluczaj loty z tą liczbą przesiadek

  // Czas lotu
  maxDuration?: number; // w godzinach

  // Godziny wylotu/przylotu - ZMIENIONA LOGIKA (zakresy zamiast kategorii)
  departureTime?: string[]; // NIE UŻYWANE - zostaw dla kompatybilności
  arrivalTime?: string[]; // NIE UŻYWANE - zostaw dla kompatybilności
  departureTimeRange?: [number, number]; // [min, max] w godzinach (0-24)
  arrivalTimeRange?: [number, number]; // [min, max] w godzinach (0-24)

  // Linie lotnicze
  airlines?: string[]; // NIE UŻYWANE - zostaw dla kompatybilności wstecznej
  excludedAirlines?: string[]; // kody IATA wykluczonych linii lotniczych (odznaczone)

  // Klasa podróży
  cabin?: string[]; // ['ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST']

  // Dodatkowe opcje
  includedBaggage?: boolean; // bagaż rejestrowany w cenie
  refundable?: boolean; // zwrotny bilet
  noPenalty?: boolean; // bez kar za zmianę
  ecoFriendly?: boolean; // sortowanie po emisji CO₂

  // Liczba miejsc
  minSeats?: number; // minimalna liczba dostępnych miejsc
}

export interface DayObject {
  day: string;
  date: string;
  disabled: boolean;
  isOtherMonth: boolean;
}

export type PanelType = 'calendar' | 'travelers' | null;
