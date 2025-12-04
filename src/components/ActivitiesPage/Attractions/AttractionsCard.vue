<template>
  <div class="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
    <div class="flex gap-4">
      <!-- Photo -->
      <div class="w-24 h-24 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden relative">
        <img
          v-if="attraction.photo"
          :src="attraction.photo"
          :alt="attraction.name"
          class="w-full h-full object-cover"
        />
        <div v-else class="w-full h-full flex items-center justify-center">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <!-- Wheelchair Accessible Badge -->
        <div
          v-if="attraction.wheelchairAccessible"
          class="absolute bottom-1 left-1 px-2 py-0.5 bg-blue-500 text-white text-xs font-medium rounded"
          title="Dostępne dla wózków inwalidzkich"
        >
          ♿
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between mb-1">
          <h3 class="font-semibold text-gray-900 truncate flex-1">{{ attraction.name }}</h3>
        </div>

        <div class="flex items-center gap-1 text-sm mb-2">
          <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
          <span class="font-medium text-gray-900">{{ attraction.rating }}</span>
          <span class="text-gray-500">({{ attraction.reviews.toLocaleString() }} opinii)</span>
          <span class="text-gray-500">• {{ attraction.type }}</span>
        </div>

        <div class="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <span>{{ attraction.priceRange }}</span>
          <span>• {{ attraction.distance }}</span>
          <span v-if="attraction.duration">• {{ attraction.duration }}</span>
        </div>

        <div class="flex gap-2">
          <button
            class="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Dodaj do planu
          </button>
          <button
            class="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
              />
            </svg>
            Kup bilet
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Attraction {
  id: number;
  photo: string;
  name: string;
  rating: number;
  reviews: number;
  type: string;
  priceRange: string;
  distance: string;
  duration?: string;
  wheelchairAccessible: boolean;
}

defineProps<{
  attraction: Attraction;
}>();
</script>
