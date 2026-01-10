<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50 p-6">
    <div class="w-full max-w-2xl">
      <!-- Nagłówek -->
      <div class="text-center mb-8">
        <h1 class="text-5xl font-extrabold text-gray-900 mb-4">
          {{
            activeTab === 'restaurants'
              ? 'Znajdź najlepsze restauracje'
              : 'Odkryj wspaniałe atrakcje'
          }}
        </h1>
        <p class="text-xl text-gray-600">
          {{
            activeTab === 'restaurants'
              ? 'Wyszukaj najlepsze miejsca do jedzenia w wymarzonej lokalizacji'
              : 'Wyszukaj najciekawsze miejsca do odwiedzenia'
          }}
        </p>
      </div>

      <!-- Przełącznik -->
      <div class="flex justify-center mb-8">
        <div class="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <button
            :class="[
              'px-8 py-3 rounded-md text-base font-semibold transition-colors',
              activeTab === 'restaurants'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900',
            ]"
            @click="$emit('update:active-tab', 'restaurants')"
          >
            Restauracje
          </button>
          <button
            :class="[
              'px-8 py-3 rounded-md text-base font-semibold transition-colors',
              activeTab === 'attractions'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900',
            ]"
            @click="$emit('update:active-tab', 'attractions')"
          >
            Atrakcje
          </button>
        </div>
      </div>

      <!-- Formularz wyszukiwania -->
      <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div class="mb-6">
          <label class="block text-sm font-bold text-gray-700 mb-2">Lokalizacja</label>
          <input
            v-model="searchLocation"
            type="text"
            placeholder="np. Paryż, Kraków, Warszawa..."
            class="w-full px-4 py-4 border-2 border-gray-300 rounded-xl text-base font-medium focus:border-gray-500 outline-none transition-colors"
            @keyup.enter="handleSearch"
          />
        </div>

        <!-- Komunikat błędu -->
        <div v-if="searchError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600">{{ searchError }}</p>
        </div>

        <!-- Przycisk wyszukiwania -->
        <button
          :disabled="!searchLocation || isSearching"
          class="w-full py-4 text-white rounded-xl font-bold text-lg transition-all shadow-md flex items-center justify-center gap-3"
          :class="
            searchLocation && !isSearching
              ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
              : 'bg-blue-300 cursor-not-allowed'
          "
          @click="handleSearch"
        >
          <MagnifyingGlassIcon v-if="!isSearching" class="w-6 h-6" />
          <span>{{ isSearching ? 'Wyszukuję...' : 'Szukaj' }}</span>
        </button>
      </div>

      <!-- Przykładowe lokalizacje -->
      <div class="mt-8 text-center">
        <p class="text-sm text-gray-600 mb-3">Popularne lokalizacje:</p>
        <div class="flex flex-wrap justify-center gap-2">
          <button
            v-for="city in popularCities"
            :key="city"
            class="px-4 py-2 bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary-600 transition-colors shadow-sm border border-gray-200"
            @click="selectCity(city)"
          >
            {{ city }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';

defineProps<{
  activeTab: 'restaurants' | 'attractions';
}>();

const emit = defineEmits<{
  'update:active-tab': [value: 'restaurants' | 'attractions'];
  search: [location: string];
}>();

const searchLocation = ref('');
const searchError = ref('');
const isSearching = ref(false);

const popularCities = ['Paryż', 'Kraków', 'Warszawa', 'Barcelona', 'Rzym', 'Praga'];

const handleSearch = () => {
  if (!searchLocation.value.trim()) {
    searchError.value = 'Proszę podać lokalizację';
    return;
  }

  isSearching.value = true;
  searchError.value = '';

  emit('search', searchLocation.value.trim());
  // isSearching będzie zresetowane przez parent po zakończeniu wyszukiwania
};

const selectCity = (city: string) => {
  searchLocation.value = city;
  handleSearch();
};

// Expose metody do kontroli stanu z parenta
defineExpose({
  resetSearching: () => {
    isSearching.value = false;
  },
  setError: (error: string) => {
    searchError.value = error;
    isSearching.value = false;
  },
});
</script>
