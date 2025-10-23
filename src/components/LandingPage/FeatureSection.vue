<script setup lang="ts">
import {
  PaperAirplaneIcon,
  BuildingOffice2Icon,
  TicketIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  UserGroupIcon,
} from '@heroicons/vue/24/outline';

const features = [
  {
    icon: PaperAirplaneIcon,
    title: 'Rezerwacja lotów',
    description: 'Porównuj i rezerwuj loty z najlepszych linii lotniczych w najniższych cenach',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: BuildingOffice2Icon,
    title: 'Hotele i noclegi',
    description: 'Znajdź idealne miejsce na nocleg - od hosteli po luksusowe hotele',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: TicketIcon,
    title: 'Atrakcje turystyczne',
    description: 'Odkryj najciekawsze miejsca i zarezerwuj bilety z wyprzedzeniem',
    color: 'from-pink-500 to-pink-600',
  },
  {
    icon: CurrencyDollarIcon,
    title: 'Zarządzanie budżetem',
    description: 'Kontroluj wydatki i nie przekrocz zaplanowanego budżetu',
    color: 'from-green-500 to-green-600',
  },
  {
    icon: CalendarDaysIcon,
    title: 'Plan podróży',
    description: 'Stwórz szczegółowy harmonogram swojej wyprawy dzień po dniu',
    color: 'from-yellow-500 to-yellow-600',
  },
  {
    icon: UserGroupIcon,
    title: 'Współdzielenie',
    description: 'Planuj podróże razem z przyjaciółmi i rodziną',
    color: 'from-red-500 to-red-600',
  },
];
</script>

<template>
  <section id="features" class="bg-gray-50 py-20">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Nagłówek sekcji -->
      <div class="mb-16 text-center">
        <h2 class="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
          Wszystko czego potrzebujesz <span class="text-blue-600">w jednym miejscu</span>
        </h2>
        <p class="mx-auto max-w-2xl text-xl text-gray-600">
          Travel Mate to kompleksowe narzędzie do planowania podróży, które ułatwi Ci organizację
          każdego aspektu wyprawy
        </p>
      </div>

      <!-- Grid funkcji -->
      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(feature, index) in features"
          :key="index"
          class="group transform rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
        >
          <div
            :class="`h-16 w-16 rounded-xl bg-gradient-to-br ${feature.color} mb-6 flex items-center justify-center transition-transform duration-300 group-hover:scale-110`"
          >
            <component :is="feature.icon" class="h-8 w-8 text-white" />
          </div>

          <h3 class="mb-3 text-2xl font-bold text-gray-900">
            {{ feature.title }}
          </h3>

          <p class="leading-relaxed text-gray-600">
            {{ feature.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
