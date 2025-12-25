<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    @click.self="$emit('close')"
  >
    <div
      class="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
    >
      <!-- Header z galerią zdjęć -->
      <div class="relative h-80 bg-gradient-to-br from-gray-200 to-gray-300">
        <div
          v-if="attraction.photos && attraction.photos.length > 0"
          class="h-full w-full object-cover"
        >
          <img
            :src="attraction.photos[0]"
            :alt="attraction.name"
            class="h-full w-full object-cover"
          />
        </div>
        <div
          v-else
          class="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300"
        >
          <PhotoIcon class="h-24 w-24 text-gray-400" />
        </div>

        <!-- Przycisk zamknij -->
        <button
          class="absolute right-4 top-4 rounded-full bg-white p-2 shadow-lg transition-colors hover:bg-gray-100"
          @click="$emit('close')"
        >
          <XMarkIcon class="h-6 w-6 text-gray-600" />
        </button>

        <!-- Status badge -->
        <div class="absolute bottom-4 left-4">
          <span
            :class="[
              'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold shadow-lg',
              attraction.status === 'Otwarte'
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white',
            ]"
          >
            <span class="h-2 w-2 rounded-full bg-white"></span>
            {{ attraction.status }}
          </span>
        </div>
      </div>

      <!-- Zawartość -->
      <div class="p-8">
        <!-- Nazwa i podstawowe info -->
        <div class="mb-6">
          <div class="mb-3 flex items-start justify-between">
            <div>
              <h2 class="mb-2 text-3xl font-bold text-gray-900">{{ attraction.name }}</h2>
              <p class="text-lg text-gray-600">{{ attraction.category }}</p>
            </div>
            <div class="flex flex-col items-end gap-2">
              <div class="flex items-center gap-2 rounded-lg bg-yellow-50 px-3 py-2">
                <StarIcon class="h-6 w-6 text-yellow-500" />
                <span class="text-xl font-bold text-gray-900">{{ attraction.rating }}</span>
              </div>
              <span class="text-sm text-gray-500"
                >({{ attraction.reviews.toLocaleString() }} opinii)</span
              >
            </div>
          </div>

          <!-- Opis -->
          <p v-if="attraction.description" class="mb-4 text-gray-700 leading-relaxed">
            {{ attraction.description }}
          </p>

          <!-- Tagi -->
          <div class="flex flex-wrap gap-2">
            <span
              class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700"
            >
              {{ attraction.priceRange }}
            </span>
            <span
              class="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700"
            >
              {{ attraction.category }}
            </span>
            <span
              v-if="attraction.wheelchairAccessible"
              class="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700"
            >
              ♿ Dostępne dla niepełnosprawnych
            </span>
            <span
              v-if="attraction.duration"
              class="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700"
            >
              ⏱️ {{ attraction.duration }}
            </span>
          </div>
        </div>

        <!-- Szczegóły kontaktowe -->
        <div class="mb-8 grid gap-4 rounded-xl bg-gray-50 p-6 md:grid-cols-2">
          <div v-if="attraction.address" class="flex items-start gap-3">
            <MapPinIcon class="h-5 w-5 flex-shrink-0 text-gray-600" />
            <div>
              <p class="text-sm font-medium text-gray-900">Adres</p>
              <p class="text-sm text-gray-600">{{ attraction.address }}</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <ClockIcon class="h-5 w-5 flex-shrink-0 text-gray-600" />
            <div>
              <p class="text-sm font-medium text-gray-900">Godziny otwarcia</p>
              <p class="text-sm text-gray-600">{{ attraction.openingHours }}</p>
            </div>
          </div>

          <div v-if="attraction.phone" class="flex items-start gap-3">
            <PhoneIcon class="h-5 w-5 flex-shrink-0 text-gray-600" />
            <div>
              <p class="text-sm font-medium text-gray-900">Telefon</p>
              <a :href="`tel:${attraction.phone}`" class="text-sm text-blue-600 hover:underline">
                {{ attraction.phone }}
              </a>
            </div>
          </div>

          <div v-if="attraction.website" class="flex items-start gap-3">
            <GlobeAltIcon class="h-5 w-5 flex-shrink-0 text-gray-600" />
            <div>
              <p class="text-sm font-medium text-gray-900">Strona www</p>
              <a
                :href="attraction.website"
                target="_blank"
                class="text-sm text-blue-600 hover:underline"
              >
                Odwiedź stronę
              </a>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <MapIcon class="h-5 w-5 flex-shrink-0 text-gray-600" />
            <div>
              <p class="text-sm font-medium text-gray-900">Odległość</p>
              <p class="text-sm text-gray-600">{{ attraction.distance }}</p>
            </div>
          </div>

          <div v-if="attraction.price" class="flex items-start gap-3">
            <TicketIcon class="h-5 w-5 flex-shrink-0 text-gray-600" />
            <div>
              <p class="text-sm font-medium text-gray-900">Cena</p>
              <p class="text-sm text-gray-600">{{ attraction.price }}</p>
            </div>
          </div>
        </div>

        <!-- Udogodnienia -->
        <div v-if="attraction.amenities && attraction.amenities.length > 0" class="mb-8">
          <h3 class="mb-3 text-xl font-bold text-gray-900">Udogodnienia</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="amenity in attraction.amenities"
              :key="amenity"
              class="inline-flex items-center rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700"
            >
              {{ amenity }}
            </span>
          </div>
        </div>

        <!-- Sekcja opinii -->
        <div v-if="attraction.detailedReviews && attraction.detailedReviews.length > 0" class="mb-8">
          <h3 class="mb-4 text-xl font-bold text-gray-900">Opinie odwiedzających</h3>
          <div class="space-y-4">
            <div
              v-for="review in attraction.detailedReviews.slice(0, 5)"
              :key="review.id"
              class="rounded-lg border border-gray-200 p-4"
            >
              <div class="mb-3 flex items-center justify-between">
                <div>
                  <p class="font-semibold text-gray-900">{{ review.author }}</p>
                  <p class="text-sm text-gray-500">{{ formatDate(review.date) }}</p>
                </div>
                <div class="flex items-center gap-1 rounded-lg bg-yellow-50 px-2 py-1">
                  <StarIcon class="h-4 w-4 text-yellow-500" />
                  <span class="text-sm font-bold text-gray-900">{{ review.rating }}</span>
                </div>
              </div>
              <p class="mb-2 text-gray-700">{{ review.comment }}</p>
              <button
                v-if="review.helpful !== undefined"
                class="text-sm text-gray-500 hover:text-gray-700"
              >
                👍 Pomocne ({{ review.helpful }})
              </button>
            </div>
          </div>
        </div>

        <!-- Przyciski akcji -->
        <div class="flex gap-3">
          <button
            class="flex-1 rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
          >
            Dodaj do planu
          </button>
          <button
            v-if="attraction.status === 'Otwarte'"
            class="flex-1 rounded-lg border-2 border-primary-600 px-6 py-3 font-semibold text-primary-600 transition-colors hover:bg-primary-50"
          >
            {{ attraction.buttonText }}
          </button>
          <button
            class="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 transition-colors hover:bg-gray-50"
          >
            <ShareIcon class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  XMarkIcon,
  StarIcon,
  MapPinIcon,
  ClockIcon,
  PhoneIcon,
  GlobeAltIcon,
  MapIcon,
  ShareIcon,
  PhotoIcon,
  TicketIcon,
} from '@heroicons/vue/24/outline';
import type { Attraction } from '@/types/activitie';

interface Props {
  show: boolean;
  attraction: Attraction;
}

defineProps<Props>();

defineEmits<{
  close: [];
}>();

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
</script>