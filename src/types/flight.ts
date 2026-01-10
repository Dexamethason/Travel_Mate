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

  // Pola dla lotu powrotnego
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
  directOnly?: boolean;
  maxStops?: number | null;
  excludedStops?: number[]; // [0, 1, 2] - wykluczaj loty z tą liczbą przesiadek

  // Czas lotu
  maxDuration?: number;

  // Godziny wylotu/przylotu
  departureTime?: string[];
  arrivalTime?: string[];
  departureTimeRange?: [number, number];
  arrivalTimeRange?: [number, number];

  // Linie lotnicze
  airlines?: string[];
  excludedAirlines?: string[]; // kody IATA wykluczonych linii lotniczych

  // Klasa podróży
  cabin?: string[]; // ['ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST']
}

export interface DayObject {
  day: string;
  date: string;
  disabled: boolean;
  isOtherMonth: boolean;
}

export type PanelType = 'calendar' | 'travelers' | null;
