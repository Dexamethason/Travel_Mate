<template>
  <div>
    <!-- Górny pasek -->
    <header class="h-[73px] bg-white border-b flex items-center justify-between px-6 gap-6">
      <!-- Pole wyszukiwania -->
      <div class="flex gap-2 max-w-2xl">
        <input
          v-model="searchLocation"
          type="text"
          placeholder="np. Paryż, Kraków, Warszawa..."
          class="w-96 px-4 py-2.5 border-2 border-gray-300 rounded-xl text-sm font-medium focus:border-gray-500 outline-none transition-colors"
          @keyup.enter="handleSearch"
        />
        <button
          :disabled="!searchLocation || isSearching"
          class="px-8 py-2.5 text-white rounded-xl font-bold transition-all shadow-sm flex items-center gap-2"
          :class="
            searchLocation && !isSearching
              ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
              : 'bg-blue-300 cursor-not-allowed'
          "
          @click="handleSearch"
        >
          <MagnifyingGlassIcon v-if="!isSearching" class="w-5 h-5" />
          <span>{{ isSearching ? 'Szukam...' : 'Szukaj' }}</span>
        </button>
      </div>

      <!-- Przełącznik między restauracjami a atrakcjami -->
      <div class="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
        <button
          :class="[
            'px-6 py-2 rounded-md text-sm font-medium transition-colors',
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
            'px-6 py-2 rounded-md text-sm font-medium transition-colors',
            activeTab === 'attractions'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900',
          ]"
          @click="$emit('update:active-tab', 'attractions')"
        >
          Atrakcje
        </button>
      </div>
    </header>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';

const props = defineProps<{
  activeTab: 'restaurants' | 'attractions';
  initialLocation?: string;
}>();

const emit = defineEmits<{
  'update:active-tab': [value: 'restaurants' | 'attractions'];
  search: [location: string, query: string];
}>();

const searchLocation = ref(props.initialLocation || '');
const isSearching = ref(false);

// Aktualizuj wartość inputa gdy zmieni się initialLocation z parenta
watch(
  () => props.initialLocation,
  newLocation => {
    searchLocation.value = newLocation || '';
  }
);

const handleSearch = () => {
  if (!searchLocation.value.trim()) {
    return;
  }

  isSearching.value = true;

  emit('search', searchLocation.value.trim(), '');

  // Reset stanu po krótkiej chwili (zostanie zaktualizowany przez parent)
  setTimeout(() => {
    isSearching.value = false;
  }, 500);
};

// Funkcje do aktualizacji komunikatów z poziomu parenta (puste, ale zachowane dla kompatybilności)
defineExpose({
  setSearchResults: () => {},
  setSearchError: () => {},
  clearMessages: () => {},
});
</script>
