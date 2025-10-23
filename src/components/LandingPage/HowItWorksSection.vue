<script setup lang="ts">
import {
  GlobeAltIcon,
  TicketIcon,
  MapIcon,
  CreditCardIcon,
  SparklesIcon,
} from '@heroicons/vue/24/outline';

const steps = [
  {
    number: '01',
    title: 'Wybierz destynację',
    description: 'Wprowadź miejsce docelowe i daty swojej podróży',
    icon: GlobeAltIcon,
  },
  {
    number: '02',
    title: 'Zarezerwuj transport i nocleg',
    description: 'Porównaj opcje i wybierz najlepsze oferty lotów i hoteli',
    icon: TicketIcon,
  },
  {
    number: '03',
    title: 'Dodaj atrakcje',
    description: 'Zaplanuj zwiedzanie i dodaj ciekawe miejsca do odwiedzenia',
    icon: MapIcon,
  },
  {
    number: '04',
    title: 'Zarządzaj budżetem',
    description: 'Śledź wydatki i kontroluj koszty w czasie rzeczywistym',
    icon: CreditCardIcon,
  },
  {
    number: '05',
    title: 'Ciesz się podróżą!',
    description: 'Wszystko gotowe - ruszaj w drogę z kompletnym planem',
    icon: SparklesIcon,
  },
];
</script>

<template>
  <section id="how-it-works" class="bg-white py-20">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Nagłówek -->
      <div class="mb-16 text-center">
        <h2 class="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
          Jak to <span class="text-blue-600">działa?</span>
        </h2>
        <p class="mx-auto max-w-2xl text-xl text-gray-600">
          Zaplanuj swoją podróż w 5 prostych krokach
        </p>
      </div>

      <!-- Timeline -->
      <div class="mx-auto max-w-5xl">
        <div class="relative">
          <!-- Linia łącząca -->
          <div
            class="absolute left-1/2 hidden h-full w-1 -translate-x-1/2 transform bg-gradient-to-b from-blue-500 to-blue-600 md:block"
          ></div>

          <!-- Kroki -->
          <div class="space-y-12">
            <div
              v-for="(step, index) in steps"
              :key="index"
              :class="[
                'relative flex items-center',
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse',
              ]"
            >
              <!-- Kontent -->
              <div
                :class="[
                  'w-full md:w-5/12',
                  index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left',
                ]"
              >
                <div
                  class="rounded-2xl bg-gray-50 p-6 transition-all duration-300 hover:bg-gray-100 hover:shadow-xl"
                >
                  <div class="mb-4 flex justify-center">
                    <component :is="step.icon" class="h-16 w-16 text-blue-600" />
                  </div>
                  <div class="mb-2 text-sm font-bold text-blue-600">KROK {{ step.number }}</div>
                  <h3 class="mb-3 text-2xl font-bold text-gray-900">{{ step.title }}</h3>
                  <p class="text-gray-600">{{ step.description }}</p>
                </div>
              </div>

              <!-- Punkt na timeline -->
              <div
                class="absolute left-1/2 z-10 hidden h-16 w-16 -translate-x-1/2 transform items-center justify-center rounded-full border-4 border-white bg-blue-600 shadow-lg md:flex"
              >
                <span class="font-bold text-white">{{ index + 1 }}</span>
              </div>

              <!-- Placeholder dla drugiej połowy -->
              <div class="hidden w-5/12 md:block"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
