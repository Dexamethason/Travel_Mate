<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ArrowDownIcon } from '@heroicons/vue/24/outline';

const router = useRouter();

const scrollToNextSection = () => {
  const nextSection = document.querySelector('#features');
  if (nextSection) {
    nextSection.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<template>
  <section
    class="relative flex min-h-screen items-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50 pt-16"
  >
    <!-- Animowane tło -->
    <div class="absolute inset-0 opacity-30">
      <div
        class="animate-blob absolute left-10 top-20 h-72 w-72 rounded-full bg-blue-200 mix-blend-multiply blur-xl filter"
      ></div>
      <div
        class="animate-blob animation-delay-2000 absolute right-10 top-40 h-72 w-72 rounded-full bg-cyan-200 mix-blend-multiply blur-xl filter"
      ></div>
      <div
        class="animate-blob animation-delay-4000 absolute bottom-20 left-1/2 h-72 w-72 rounded-full bg-blue-300 mix-blend-multiply blur-xl filter"
      ></div>
    </div>

    <div class="container relative z-10 mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-4xl text-center">
        <!-- Nagłówek -->
        <h1
          class="animate-fade-in-down mb-6 text-4xl font-bold text-gray-900 sm:text-5xl md:text-7xl"
        >
          Zaplanuj swoją <span class="text-blue-600">wymarzoną podróż</span>
        </h1>

        <p class="animate-fade-in-up mb-8 text-lg text-gray-600 sm:mb-12 sm:text-xl md:text-2xl">
          Loty, hotele, atrakcje - wszystko w jednym miejscu. Proste, szybkie, wygodne.
        </p>

        <!-- Przycisk CTA -->
        <div class="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            class="w-full transform rounded-full bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-2xl sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
            @click="router.push('/register')"
          >
            Zacznij planować za darmo
          </button>
        </div>

        <!-- Statystyki -->
        <div class="mx-auto grid max-w-3xl grid-cols-3 gap-4 sm:gap-8">
          <div class="text-center">
            <div class="mb-1 text-2xl font-bold text-blue-600 sm:mb-2 sm:text-3xl md:text-4xl">
              500K+
            </div>
            <div class="text-xs text-gray-600 sm:text-sm md:text-base">Dostępnych lotów</div>
          </div>
          <div class="text-center">
            <div class="mb-1 text-2xl font-bold text-blue-600 sm:mb-2 sm:text-3xl md:text-4xl">
              1M+
            </div>
            <div class="text-xs text-gray-600 sm:text-sm md:text-base">Hoteli na całym świecie</div>
          </div>
          <div class="text-center">
            <div class="mb-1 text-2xl font-bold text-blue-600 sm:mb-2 sm:text-3xl md:text-4xl">
              50K+
            </div>
            <div class="text-xs text-gray-600 sm:text-sm md:text-base">Restauracji i atrakcji</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Wskaźnik przewijania -->
    <button
      class="absolute bottom-8 left-1/2 hidden -translate-x-1/2 transform animate-bounce cursor-pointer transition-all duration-300 hover:scale-110 hover:text-blue-600 sm:block"
      aria-label="Przewiń do następnej sekcji"
      @click="scrollToNextSection"
    >
      <ArrowDownIcon class="h-6 w-6 text-gray-600" />
    </button>
  </section>
</template>

<style scoped>
@keyframes blob {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>
