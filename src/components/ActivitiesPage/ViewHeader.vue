<template>
  <div>
    <!-- Górny pasek wyrównany z logo -->
    <header class="h-[73px] bg-white border-b flex items-center px-6 gap-6">
      <!-- Pasek wyszukiwania miasta -->
      <div class="flex-1 max-w-md">
        <div class="relative">
          <input
            v-model="citySearch"
            type="text"
            placeholder="Szukaj miasta..."
            class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
          <!-- Ikona lupy (MagnifyingGlass) -->
          <MagnifyingGlassIcon
            class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          />
        </div>
      </div>

      <!-- Spacer -->
      <div class="flex-1"></div>

      <!-- Przełącznik między restauracjami a atrakcjami - po prawej stronie -->
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
import { ref } from 'vue';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';

defineProps<{
  activeTab: 'restaurants' | 'attractions';
}>();

defineEmits<{
  'update:active-tab': [value: 'restaurants' | 'attractions'];
}>();

// Domyślne miasto do wyszukiwania
const citySearch = ref('Paryż');
</script>
