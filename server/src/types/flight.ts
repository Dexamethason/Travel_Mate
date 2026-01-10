export interface Flight {
  id: number | string;
  airline: string; // Pełna nazwa, nie kod, najwyżej przemapujecie to
  stops: string;
  departureTime: string; // HH:MM
  departureAirport: string; // IATA
  arrivalTime: string; // HH:MM
  arrivalAirport: string; // IATA
  duration: string; // "2h 45m"
  type: string; // np. "Ekonomiczna" ale nie wiem czy chcemy to
  price: number;
  // Powrotny (opcjonalne dlatego ?)
  returnAirline?: string;
  returnStops?: string;
  returnDepartureTime?: string;
  returnDepartureAirport?: string;
  returnArrivalTime?: string;
  returnArrivalAirport?: string;
  returnDuration?: string;
}

export interface FlightSearchParams {
  from: string; // IATA
  to: string; // IATA
  date: string; // YYYY-MM-DD
  returnDate?: string; // YYYY-MM-DD
  passengers?: number;
}

export interface Location {
  name: string;
  iataCode: string;
  cityName: string;
  countryName: string;
}
