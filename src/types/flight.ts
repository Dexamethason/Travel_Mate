export interface SearchForm {
  from: string;
  to: string;
  departure: string;
  return: string;
  adults: number;
  children: number;
  tripType: 'roundTrip' | 'oneWay';
}

export interface Flight {
  id: number;
  airline: string;
  stops: string;
  departureTime: string;
  departureAirport: string;
  arrivalTime: string;
  arrivalAirport: string;
  duration: string;
  type: string;
  price: number;
}

export interface FlightFiltersType {
  // Cena
  priceMin?: number;
  priceMax?: number;
  currency?: string;

  // Przesiadki
  directOnly?: boolean;
  maxStops?: number | null;

  // Czas lotu
  maxDuration?: number; // w godzinach

  // Godziny wylotu/przylotu
  departureTime?: string[]; // ['morning', 'afternoon', 'evening', 'night']
  arrivalTime?: string[]; // ['morning', 'afternoon', 'evening', 'night']

  // Linie lotnicze
  airlines?: string[]; // kody IATA linii lotniczych

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
