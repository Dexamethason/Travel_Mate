<template>
  <div
    class="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-gray-300 transition-all duration-200 cursor-pointer group"
    @click="$emit('click')"
    @mouseenter="$emit('hover', attraction.id)"
    @mouseleave="$emit('leave')"
  >
    <div class="flex gap-5">
      <div
        class="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-200"
      >
        <img
          :src="attraction.photos?.[0] || attraction.photo || '/img-notfound.png'"
          :alt="attraction.name"
          class="w-full h-full object-cover"
          @error="handleImageError"
        />
      </div>

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
              statusText === 'Otwarte'
                ? 'bg-green-100 text-green-700 border border-green-300'
                : statusText === 'Zamknięte'
                  ? 'bg-red-100 text-red-700 border border-red-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-300',
            ]"
          >
            {{ statusText }}
          </span>
        </div>

        <div class="flex items-center gap-3 mb-3 flex-wrap">
          <div v-if="attraction.rating" class="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
            <StarIcon class="w-4 h-4 text-yellow-500" />
            <span class="ml-1.5 text-sm font-bold text-gray-900">{{
              attraction.rating.toFixed(1)
            }}</span>
          </div>
          <span v-if="attraction.reviews" class="text-sm text-gray-500">
            ({{ attraction.reviews.toLocaleString() }} opinii)
          </span>
          <template v-if="attraction.category">
            <span v-if="attraction.rating || attraction.reviews" class="text-gray-300">•</span>
            <span class="text-sm font-medium text-gray-700">{{ attraction.category }}</span>
          </template>
        </div>

        <div class="flex items-center gap-3 text-sm text-gray-600 flex-wrap">
          <template v-if="attraction.openingHours">
            <span>{{ attraction.openingHours }}</span>
          </template>
          <template v-if="attraction.address">
            <span v-if="attraction.openingHours" class="text-gray-300">•</span>
            <span class="text-xs text-gray-500 truncate">{{ attraction.address }}</span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { StarIcon } from '@heroicons/vue/24/solid';
import type { Attraction } from '@/types/activitie';

const props = defineProps<{
  attraction: Attraction;
}>();

defineEmits<{
  click: [];
  hover: [id: string | number];
  leave: [];
}>();

const statusText = computed(() => {
  const hours = props.attraction.openingHours;
  if (!hours) return props.attraction.status || 'Brak danych';

  if (/Czynne całą dobę/i.test(hours)) {
    return 'Otwarte';
  }

  if (/Otwarte/i.test(hours)) {
    return 'Otwarte';
  }

  if (/Zamknięte/i.test(hours)) {
    return 'Zamknięte';
  }

  return props.attraction.status || 'Brak danych';
});

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = '/img-notfound.png';
  target.onerror = null;
};
</script>
