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
          v-if="restaurant.photos && restaurant.photos.length > 0"
          class="h-full w-full object-cover"
        >
          <img
            :src="restaurant.photos[0]"
            :alt="restaurant.name"
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
              restaurant.isOpen
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white',
            ]"
          >
            <span class="h-2 w-2 rounded-full bg-white"></span>
            {{ restaurant.isOpen ? 'Otwarte' : 'Zamknięte' }}
          </span>
        </div>
      </div>

      <!-- Zawartość -->
      <div class="p-8">
        <!-- Nazwa i podstawowe info -->
        <div class="mb-6">
          <div class="mb-3 flex items-start justify-between">
            <div>
              <h2 class="mb-2 text-3xl font-bold text-gray-900">{{ restaurant.name }}</h2>
              <p class="text-lg text-gray-600">{{ restaurant.cuisine }}</p>
            </div>
            <div class="flex flex-col items-end gap-2">
              <div class="flex items-center gap-2 rounded-lg bg-yellow-50 px-3 py-2">
                <StarIcon class="h-6 w-6 text-yellow-500" />
                <span class="text-xl font-bold text-gray-900">{{ restaurant.rating }}</span>
              </div>
              <span class="text-sm text-gray-500"
                >({{ restaurant.reviews.toLocaleString() }} opinii)</span
              >
            </div>
          </div>

          <!-- Opis -->
          <p v-if="restaurant.description" class="mb-4 text-gray-700 leading-relaxed">
            {{ restaurant.description }}
          </p>

          <!-- Tagi -->
          <div class="flex flex-wrap gap-2">
            <span
              class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700"
            >
              {{ restaurant.priceRange }}
            </span>
            <span
              class="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700"
            >
              {{ restaurant.cuisine }}
            </span>
            <span
              v-if="restaurant.reservationRequired"
              class="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700"
            >
              Wymagana rezerwacja
            </span>
          </div>
        </div>

        <!-- Szczegóły kontaktowe -->
        <div class="mb-8 grid gap-4 rounded-xl bg-gray-50 p-6 md:grid-cols-2">
          <div v-if="restaurant.address" class="flex items-start gap-3">
            <MapPinIcon class="h-5 w-5 flex-shrink-0 text-gray-600" />
            <div>
              <p class="text-sm font-medium text-gray-900">Adres</p>
              <p class="text-sm text-gray-600">{{ restaurant.address }}</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <ClockIcon class="h-5 w-5 flex-shrink-0 text-gray-600" />
            <div>
              <p class="text-sm font-medium text-gray-900">Godziny otwarcia</p>
              <p class="text-sm text-gray-600">{{ restaurant.openingHours }}</p>
            </div>
          </div>

          <div v-if="restaurant.phone" class="flex items-start gap-3">
            <PhoneIcon class="h-5 w-5 flex-shrink-0 text-gray-600" />
            <div>
              <p class="text-sm font-medium text-gray-900">Telefon</p>
              <a :href="`tel:${restaurant.phone}`" class="text-sm text-blue-600 hover:underline">
                {{ restaurant.phone }}
              </a>
            </div>
          </div>

          <div v-if="restaurant.website" class="flex items-start gap-3">
            <GlobeAltIcon class="h-5 w-5 flex-shrink-0 text-gray-600" />
            <div>
              <p class="text-sm font-medium text-gray-900">Strona www</p>
              <a
                :href="restaurant.website"
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
              <p class="text-sm text-gray-600">{{ restaurant.distance }}</p>
            </div>
          </div>
        </div>

        <!-- Sekcja opinii -->
        <div v-if="restaurant.detailedReviews && restaurant.detailedReviews.length > 0" class="mb-8">
          <h3 class="mb-4 text-xl font-bold text-gray-900">Opinie gości</h3>
          <div class="space-y-4">
            <div
              v-for="review in restaurant.detailedReviews.slice(0, 5)"
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
            v-if="restaurant.reservationRequired"
            class="flex-1 rounded-lg border-2 border-primary-600 px-6 py-3 font-semibold text-primary-600 transition-colors hover:bg-primary-50"
          >
            Zarezerwuj stolik
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
} from '@heroicons/vue/24/outline';
import type { Restaurant } from '@/types/activitie';

interface Props {
  show: boolean;
  restaurant: Restaurant;
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