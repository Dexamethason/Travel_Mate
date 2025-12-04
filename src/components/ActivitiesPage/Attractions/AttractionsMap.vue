<template>
  <div
    class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-[calc(100vh-200px)]"
  >
    <div class="h-full relative">
      <!-- Placeholder mapy -->
      <div class="absolute inset-0 bg-gray-100 flex items-center justify-center">
        <div class="text-center">
          <!-- Ikona mapy (Map) -->
          <svg
            class="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
          <p class="text-gray-500 font-medium">Mapa Google</p>
          <p class="text-sm text-gray-400 mt-1">Integracja Google Maps - Atrakcje</p>
        </div>
      </div>

      <!-- Kontrolki mapy -->
      <div class="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <!-- Przycisk przybliżenia -->
        <button
          class="w-10 h-10 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center justify-center"
          title="Przybliż"
        >
          <!-- Ikona plus (Plus) -->
          <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
        <!-- Przycisk oddalenia -->
        <button
          class="w-10 h-10 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center justify-center"
          title="Oddal"
        >
          <!-- Ikona minus (Minus) -->
          <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
          </svg>
        </button>
        <!-- Przycisk warstw -->
        <button
          class="w-10 h-10 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center justify-center"
          title="Warstwa"
        >
          <!-- Ikona warstw (Squares2x2) -->
          <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            />
          </svg>
        </button>
      </div>

      <!-- Przycisk lokalizacji użytkownika -->
      <button
        class="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center z-10"
        title="Moja lokalizacja"
      >
        <!-- Ikona pinezki (MapPin) -->
        <svg class="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
            clip-rule="evenodd"
          />
        </svg>
      </button>

      <!-- Legenda mapy -->
      <div class="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3 z-10">
        <h3 class="text-xs font-semibold text-gray-700 mb-2">Legenda</h3>
        <div class="space-y-1.5">
          <div class="flex items-center gap-2 text-xs text-gray-600">
            <div class="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Zabytki</span>
          </div>
          <div class="flex items-center gap-2 text-xs text-gray-600">
            <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Muzea</span>
          </div>
          <div class="flex items-center gap-2 text-xs text-gray-600">
            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Parki</span>
          </div>
          <div class="flex items-center gap-2 text-xs text-gray-600">
            <div class="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>Rozrywka</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Integracja z Google Maps dla atrakcji
</script>
