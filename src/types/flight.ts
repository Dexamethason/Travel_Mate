export interface SearchForm {
  from: string;
  to: string;
  departure: string;
  return: string;
  adults: number;
  children: number;
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
  priceMin: number;
  priceMax: number;
  maxStops: string;
  durationMax: number;
}

export interface DayObject {
  day: string;
  date: string;
  disabled: boolean;
  isOtherMonth: boolean;
}

export type PanelType = 'calendar' | 'travelers' | null;
