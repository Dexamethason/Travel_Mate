import Amadeus from 'amadeus';
import { amadeusEnv } from '../config/env';
import { Flight, FlightSearchParams, Location } from '../types/flight';

// Init Amadeusa
// @ts-ignore - a daj spokój
let amadeus: any;

if (amadeusEnv.clientId && amadeusEnv.clientSecret) {
  amadeus = new Amadeus({
    clientId: amadeusEnv.clientId,
    clientSecret: amadeusEnv.clientSecret,
  });
}

export class FlightService {
  /**
   * Serwisik, wyszukiwanie lotów przez Amadeus API
   */
  async searchFlights(params: FlightSearchParams): Promise<Flight[]> {
    if (!amadeus) {
        console.warn('Amadeus client not initialized - missing credentials');
        return [];
    }
    try {
      const searchParams: any = {
        originLocationCode: params.from,
        destinationLocationCode: params.to,
        departureDate: params.date,
        adults: params.passengers || 1,
        max: 20, // Limit wyników, więcej nie potrzeba
        currencyCode: 'PLN', // aktualnie walę w pln, można potem gdzieś w parametry wrzucić inną walutę albo na froncie wyświetlać po kursie walut
      };

      // Sprawdza powrotny
      if (params.returnDate) {
        searchParams.returnDate = params.returnDate;
      }

      const response = await amadeus.shopping.flightOffersSearch.get(searchParams);

      if (!response.data) {
        return [];
      }

      return this.transformFlightData(response.data, response.dictionaries);
    } catch (error: any) {
      console.error('Amadeus API Error:', error.response?.result || error);
      throw new Error('Failed to fetch flights');
    }
  }


  /**
   * Dostosowanie danych 
   */
  private transformFlightData(flightOffers: any[], dictionaries: any): Flight[] {
    return flightOffers.map((offer: any) => {
      // Itineraries[0] = lot glowny
      // Itineraries[1] = lot powrotny (jeśli istnieje)
      const itinerary = offer.itineraries[0];
      const returnItinerary = offer.itineraries[1];

      // Przetwarzanie lotu "głównego"
      const segments = itinerary.segments;
      const firstSegment = segments[0];
      const lastSegment = segments[segments.length - 1];

      // Helper - przesiadki
      const getStopsLabel = (seg: any[]) => {
        const stops = seg.length - 1;
        if (stops === 0) return 'Bezpośredni';
        if (stops === 1) return '1 przesiadka';
        return `${stops} przesiadki`;
      };

      const stopsLabel = getStopsLabel(segments);

      // Formatowanie czasu trwania (PT2H30M -> 2h 30m)
      const duration = this.formatDuration(itinerary.duration);

      // Pobieranie nazwy linii lotniczej - do zmapowanie potem na pełną nazwę
      const carrierCode = firstSegment.carrierCode;
      const airlineName = dictionaries?.carriers?.[carrierCode] || carrierCode;

      // Pobieranie ceny - na froncie można dodać jeszcze przeliczenie na inną walutę
      const price = parseFloat(offer.price.grandTotal);

      // Formatowanie godzin
      const departureTime = this.formatTime(firstSegment.departure.at);
      const arrivalTime = this.formatTime(lastSegment.arrival.at);

      // Typ klasy podróży w sumie zawsze ekonomiczna zwraca, może demo nie ma innych - można wyrzucić pozniej
      const cabin = offer.travelerPricings[0]?.fareDetailsBySegment[0]?.cabin || 'ECONOMY';
      // mapowanie
      const cabinMap: Record<string, string> = {
        'ECONOMY': 'Ekonomiczna',
        'PREMIUM_ECONOMY': 'Premium Ekonomiczna',
        'BUSINESS': 'Biznes',
        'FIRST': 'Pierwsza Klasa'
      };

      const flightData: Flight = {
        id: offer.id,
        airline: airlineName,
        stops: stopsLabel,
        departureTime,
        departureAirport: firstSegment.departure.iataCode,
        arrivalTime,
        arrivalAirport: lastSegment.arrival.iataCode,
        duration,
        type: cabinMap[cabin] || cabin,
        price
      };

      // Przetwarzanie powrotu
      if (returnItinerary) {
        const returnSegments = returnItinerary.segments;
        const returnFirstSegment = returnSegments[0];
        const returnLastSegment = returnSegments[returnSegments.length - 1];
        const returnCarrierCode = returnFirstSegment.carrierCode;

        flightData.returnAirline = dictionaries?.carriers?.[returnCarrierCode] || returnCarrierCode;
        flightData.returnStops = getStopsLabel(returnSegments);
        flightData.returnDuration = this.formatDuration(returnItinerary.duration);
        flightData.returnDepartureTime = this.formatTime(returnFirstSegment.departure.at);
        flightData.returnDepartureAirport = returnFirstSegment.departure.iataCode;
        flightData.returnArrivalTime = this.formatTime(returnLastSegment.arrival.at);
        flightData.returnArrivalAirport = returnLastSegment.arrival.iataCode;
      }

      return flightData;
    });
  }

  private formatDuration(isoDuration: string): string {
    // Format PT2H30M
    const match = isoDuration.match(/PT(\d+H)?(\d+M)?/);
    if (!match) return isoDuration;

    const hours = match[1] ? match[1].replace('H', '') : '0';
    const minutes = match[2] ? match[2].replace('M', '') : '0';

    if (hours === '0') return `${minutes}m`;
    return `${hours}h ${minutes}m`;
  }

  private formatTime(isoDate: string): string {
    // Format 2023-11-29T10:30:00 -> 10:30
    const date = new Date(isoDate);
    return date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
  }
}

export const flightService = new FlightService();
