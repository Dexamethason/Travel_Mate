import { ref, computed, type Ref } from 'vue';
import type { FlightFiltersType, Flight } from '@/types/flight';

export function useFlightFilters(flights: Ref<Flight[]>) {
  const filters = ref<FlightFiltersType>({
    priceMin: 0,
    priceMax: 10000,
    currency: 'PLN',
    directOnly: false,
    maxStops: null,
    maxDuration: 24,
    departureTime: [],
    arrivalTime: [],
    airlines: [],
    cabin: [],
    includedBaggage: false,
    refundable: false,
    noPenalty: false,
    ecoFriendly: false,
    minSeats: 1,
  });

  const availableAirlines = computed(() => {
    const airlinesSet = new Set<string>();
    flights.value.forEach(flight => {
      airlinesSet.add(flight.airline);
    });
    return Array.from(airlinesSet).map(airline => ({
      code: airline,
      name: airline,
    }));
  });

  const parseTime = (timeString: string): number => {
    const parts = timeString.split(':');
    const hours = parseInt(parts[0] || '0', 10);
    const minutes = parseInt(parts[1] || '0', 10);
    return hours + minutes / 60;
  };

  const getTimeCategory = (timeString: string): string => {
    const hour = parseTime(timeString);
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 24) return 'evening';
    return 'night';
  };

  const parseDuration = (durationString: string): number => {
    // Format: "2h 30min" lub "2h"
    const hoursMatch = durationString.match(/(\d+)h/);
    const minutesMatch = durationString.match(/(\d+)min/);
    const hours = hoursMatch && hoursMatch[1] ? parseInt(hoursMatch[1], 10) : 0;
    const minutes = minutesMatch && minutesMatch[1] ? parseInt(minutesMatch[1], 10) / 60 : 0;
    return hours + minutes;
  };

  const getStopsCount = (stopsString: string): number => {
    if (stopsString.toLowerCase().includes('bezpośredni')) return 0;
    const match = stopsString.match(/(\d+)/);
    return match && match[1] ? parseInt(match[1], 10) : 0;
  };

  const filteredFlights = computed(() => {
    return flights.value.filter(flight => {
      // Filtr ceny
      if (filters.value.priceMin !== undefined && flight.price < filters.value.priceMin) {
        return false;
      }
      if (filters.value.priceMax !== undefined && flight.price > filters.value.priceMax) {
        return false;
      }

      // Filtr przesiadek
      const stopsCount = getStopsCount(flight.stops);
      if (filters.value.directOnly && stopsCount !== 0) {
        return false;
      }
      if (
        filters.value.maxStops !== null &&
        filters.value.maxStops !== undefined &&
        stopsCount > filters.value.maxStops
      ) {
        return false;
      }

      // Filtr czasu lotu
      const flightDuration = parseDuration(flight.duration);
      if (filters.value.maxDuration && flightDuration > filters.value.maxDuration) {
        return false;
      }

      // Filtr godziny wylotu
      if (filters.value.departureTime && filters.value.departureTime.length > 0) {
        const departureCategory = getTimeCategory(flight.departureTime);
        if (!filters.value.departureTime.includes(departureCategory)) {
          return false;
        }
      }

      // Filtr godziny przylotu
      if (filters.value.arrivalTime && filters.value.arrivalTime.length > 0) {
        const arrivalCategory = getTimeCategory(flight.arrivalTime);
        if (!filters.value.arrivalTime.includes(arrivalCategory)) {
          return false;
        }
      }

      // Filtr linii lotniczych
      if (filters.value.airlines && filters.value.airlines.length > 0) {
        if (!filters.value.airlines.includes(flight.airline)) {
          return false;
        }
      }

      return true;
    });
  });

  const resetFilters = () => {
    filters.value = {
      priceMin: 0,
      priceMax: 10000,
      currency: 'PLN',
      directOnly: false,
      maxStops: null,
      maxDuration: 24,
      departureTime: [],
      arrivalTime: [],
      airlines: [],
      cabin: [],
      includedBaggage: false,
      refundable: false,
      noPenalty: false,
      ecoFriendly: false,
      minSeats: 1,
    };
  };

  return {
    filters,
    filteredFlights,
    availableAirlines,
    resetFilters,
  };
}
