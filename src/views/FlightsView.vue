<template>
  <div class="px-10 flex flex-1 justify-center py-5 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <div class="flex flex-col max-w-6xl flex-1">
      <!-- Header -->
      <div class="flex flex-wrap justify-between gap-3 p-4">
        <h1 class="text-gray-900 dark:text-white text-3xl font-bold leading-tight">
          Znajdź idealny lot
        </h1>
      </div>

      <!-- formularz wyszukiwania lotów -->
      <div class="flex flex-wrap items-end gap-4 px-4 py-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-8">
        <label class="flex flex-col min-w-40 flex-1">
          <p class="text-gray-900 dark:text-white text-base font-medium leading-normal pb-2">Skąd</p>
          <input 
            v-model="searchForm.from"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-12 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            placeholder="Miasto lub lotnisko" 
          />
        </label>
        
        <label class="flex flex-col min-w-40 flex-1">
          <p class="text-gray-900 dark:text-white text-base font-medium leading-normal pb-2">Dokąd</p>
          <input 
            v-model="searchForm.to"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-12 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            placeholder="Miasto lub lotnisko" 
          />
        </label>
        
        <label class="flex flex-col min-w-40 flex-1">
          <p class="text-gray-900 dark:text-white text-base font-medium leading-normal pb-2">Wylot</p>
          <input 
            v-model="searchForm.departure"
            type="date"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-12 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          />
        </label>
        
        <label class="flex flex-col min-w-40 flex-1">
          <p class="text-gray-900 dark:text-white text-base font-medium leading-normal pb-2">Powrót</p>
          <input 
            v-model="searchForm.return"
            type="date"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-12 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          />
        </label>
        
        <label class="flex flex-col min-w-40 flex-1">
          <p class="text-gray-900 dark:text-white text-base font-medium leading-normal pb-2">Pasażerowie</p>
          <input 
            v-model="searchForm.travelers"
            type="number"
            min="1"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-12 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            placeholder="1 dorosły" 
          />
        </label>
        
        <button 
          @click="searchFlights"
          class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg h-12 transition-colors"
        >
          Szukaj
        </button>
      </div>

      <div class="flex gap-8">
        <!-- sidebar z filtrami -->
        <div class="w-1/4">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 class="text-gray-900 dark:text-white text-xl font-bold mb-6">Filtry</h2>
            
            <!-- filtr ceny -->
            <div class="mb-6">
              <p class="text-gray-900 dark:text-white text-base font-medium mb-4">Przedział cenowy</p>
              <div class="flex items-center gap-4 mb-2">
                <input 
                  v-model="filters.priceMin"
                  type="number" 
                  class="w-24 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Min"
                />
                <span class="text-gray-500">-</span>
                <input 
                  v-model="filters.priceMax"
                  type="number" 
                  class="w-24 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Max"
                />
              </div>
            </div>

            <!-- filtr przesiadek -->
            <div class="mb-6">
              <p class="text-gray-900 dark:text-white text-base font-medium mb-4">Maksymalna liczba przesiadek</p>
              <select 
                v-model="filters.maxStops"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="0">Bez przesiadek</option>
                <option value="1">1 przesiadka</option>
                <option value="2">2 przesiadki</option>
                <option value="3">3+ przesiadki</option>
              </select>
            </div>
          </div>
        </div>

        <!-- wyniki wyszukiwania -->
        <div class="flex-1">
          <h2 class="text-gray-900 dark:text-white text-xl font-bold mb-6">Wyniki</h2>
          
          <div v-if="flights.length === 0" class="text-center py-16 text-gray-500 dark:text-gray-400">
            Użyj formularza powyżej, aby wyszukać loty
          </div>

          <div v-for="flight in filteredFlights" :key="flight.id" class="mb-4">
            <div class="flex items-center gap-4 rounded-lg border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
              <div class="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold">
                {{ flight.airline.charAt(0) }}
              </div>
              
              <div class="flex flex-col flex-1">
                <p class="text-gray-900 dark:text-white text-base font-bold">{{ flight.airline }}</p>
                <p class="text-gray-500 dark:text-gray-400 text-sm">{{ flight.stops }}</p>
              </div>
              
              <div class="flex flex-col items-center">
                <p class="text-gray-900 dark:text-white text-base font-bold">{{ flight.departureTime }}</p>
                <p class="text-gray-500 dark:text-gray-400 text-sm">{{ flight.departureAirport }}</p>
              </div>
              
              <svg class="text-gray-400 mx-4" fill="currentColor" height="24" viewBox="0 0 24 24" width="24">
                <path d="M16.01 11H4v2h12.01v3L20 12l-3.99-4z"/>
              </svg>
              
              <div class="flex flex-col items-center">
                <p class="text-gray-900 dark:text-white text-base font-bold">{{ flight.arrivalTime }}</p>
                <p class="text-gray-500 dark:text-gray-400 text-sm">{{ flight.arrivalAirport }}</p>
              </div>
              
              <div class="flex flex-col items-center">
                <p class="text-gray-900 dark:text-white text-base font-bold">{{ flight.duration }}</p>
                <p class="text-gray-500 dark:text-gray-400 text-sm">{{ flight.type }}</p>
              </div>
              
              <p class="text-gray-900 dark:text-white text-lg font-bold">{{ flight.price }} zł</p>
              
              <button class="bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900 text-gray-900 dark:text-white px-4 py-2 rounded-lg transition-colors">
                Zobacz ofertę
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Flight {
  id: number
  airline: string
  stops: string
  departureTime: string
  departureAirport: string
  arrivalTime: string
  arrivalAirport: string
  duration: string
  type: string
  price: number
}

const searchForm = ref({
  from: '',
  to: '',
  departure: '',
  return: '',
  travelers: 1
})

const filters = ref({
  priceMin: 0,
  priceMax: 5000,
  maxStops: '3',
  durationMax: 24
})

const flights = ref<Flight[]>([
  {
    id: 1,
    airline: 'LOT Polish Airlines',
    stops: 'Bezpośredni',
    departureTime: '10:00',
    departureAirport: 'WAW',
    arrivalTime: '12:30',
    arrivalAirport: 'CDG',
    duration: '2h 30m',
    type: 'Bezpośredni',
    price: 650
  },
  {
    id: 2,
    airline: 'Ryanair',
    stops: '1 przesiadka',
    departureTime: '08:00',
    departureAirport: 'WAW',
    arrivalTime: '14:00',
    arrivalAirport: 'CDG',
    duration: '6h 0m',
    type: '1 przesiadka',
    price: 450
  },
  {
    id: 3,
    airline: 'Air France',
    stops: 'Bezpośredni',
    departureTime: '14:00',
    departureAirport: 'WAW',
    arrivalTime: '16:30',
    arrivalAirport: 'CDG',
    duration: '2h 30m',
    type: 'Bezpośredni',
    price: 720
  }
])

const filteredFlights = computed(() => {
  return flights.value.filter(flight => {
    const priceInRange = flight.price >= filters.value.priceMin && flight.price <= filters.value.priceMax
    
    const stopsCount = flight.stops === 'Bezpośredni' ? 0 : parseInt(flight.stops.charAt(0))
    const stopsMatch = stopsCount <= parseInt(filters.value.maxStops)
    
    return priceInRange && stopsMatch
  })
})

const searchFlights = () => {
  console.log('Wyszukiwanie lotów...', searchForm.value)
  // TODO: podpiąć prawdziwe API jak będzie gotowe
}
</script>