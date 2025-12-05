<template>
  <div
    class="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-gray-300 transition-all duration-200 cursor-pointer group"
  >
    <div class="flex gap-5">
      <!-- Zdjęcie -->
      <div
        class="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-200"
      >
        <PhotoIcon class="w-12 h-12 text-gray-400" />
      </div>

      <!-- Informacje -->
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-3 mb-2">
          <h3
            class="text-lg font-bold text-gray-900 truncate group-hover:text-primary-600 transition-colors"
          >
            {{ attraction.name }}
          </h3>
          <span
            :class="[
              'px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap flex-shrink-0',
              attraction.status === 'Otwarte'
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-red-100 text-red-700 border border-red-300',
            ]"
          >
            {{ attraction.status }}
          </span>
        </div>

        <div class="flex items-center gap-3 mb-3">
          <div class="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
            <StarIcon class="w-4 h-4 text-yellow-500" />
            <span class="ml-1.5 text-sm font-bold text-gray-900">{{ attraction.rating }}</span>
          </div>
          <span class="text-sm text-gray-500"
            >({{ attraction.reviews.toLocaleString() }} opinii)</span
          >
          <span class="text-gray-300">•</span>
          <span class="text-sm font-medium text-gray-700">{{ attraction.category }}</span>
        </div>

        <div class="flex items-center gap-3 text-sm text-gray-600">
          <span class="font-semibold text-gray-900">{{ attraction.priceRange }}</span>
          <span class="text-gray-300">•</span>
          <span>{{ attraction.openingHours }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PhotoIcon } from '@heroicons/vue/24/outline';
import { StarIcon } from '@heroicons/vue/24/solid';
import type { Attraction } from '@/types/activitie';

defineProps<{
  attraction: Attraction;
}>();
</script>
