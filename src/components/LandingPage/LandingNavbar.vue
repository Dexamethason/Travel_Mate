<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { UserCircleIcon, Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline';

const router = useRouter();
const isScrolled = ref(false);
const isMobileMenuOpen = ref(false);
const isLoggedIn = ref(false);

// Obsługa scrollowania dla zmiany stylu navbara
const handleScroll = () => {
  isScrolled.value = window.scrollY > 10;
};

// Dodaj listener przy montowaniu i usuń przy odmontowaniu
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const handleLogin = () => {
  // Symulacja logowania (tymczasowo)
  isLoggedIn.value = true;
  isMobileMenuOpen.value = false;
};

const handleLogout = () => {
  isLoggedIn.value = false;
  isMobileMenuOpen.value = false;
};

const goToDashboard = () => {
  router.push('/app/dashboard');
  isMobileMenuOpen.value = false;
};
</script>

<template>
  <nav
    :class="[
      'fixed top-0 z-50 w-full transition-all duration-300',
      isScrolled ? 'bg-white shadow-md' : 'bg-white/90 backdrop-blur-md',
    ]"
  >
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <!-- Logo i nazwa -->
        <router-link to="/" class="group flex cursor-pointer items-center gap-2">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-400 transition-transform duration-300 group-hover:scale-110"
          >
            <span class="text-xl text-white">✈️</span>
          </div>
          <span class="text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600">
            Travel Mate
          </span>
        </router-link>

        <!-- Nawigacja desktop -->
        <div class="hidden items-center gap-4 md:flex">
          <!-- Niezalogowany użytkownik -->
          <template v-if="!isLoggedIn">
            <button
              class="transform rounded-full bg-blue-600 px-6 py-2 font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-lg"
              @click="handleLogin"
            >
              Zaloguj się
            </button>
          </template>

          <!-- Zalogowany użytkownik -->
          <template v-else>
            <button
              class="transform rounded-full bg-blue-600 px-6 py-2 font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-lg"
              @click="goToDashboard"
            >
              Przejdź do aplikacji
            </button>

            <!-- Ikona profilu -->
            <div class="relative">
              <button
                class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-400 text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
                title="Wyloguj się"
                @click="handleLogout"
              >
                <UserCircleIcon class="h-6 w-6" />
              </button>
            </div>
          </template>
        </div>

        <!-- Menu mobilne - hamburger -->
        <button
          class="rounded-lg p-2 transition-colors hover:bg-gray-100 md:hidden"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <Bars3Icon v-if="!isMobileMenuOpen" class="h-6 w-6 text-gray-600" />
          <XMarkIcon v-else class="h-6 w-6 text-gray-600" />
        </button>
      </div>
    </div>

    <!-- Menu mobilne -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div v-if="isMobileMenuOpen" class="border-t border-gray-200 bg-white md:hidden">
        <div class="space-y-4 px-4 py-6">
          <!-- Niezalogowany użytkownik -->
          <template v-if="!isLoggedIn">
            <button
              class="w-full rounded-full bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:bg-blue-700"
              @click="handleLogin"
            >
              Zaloguj się
            </button>
          </template>

          <!-- Zalogowany użytkownik -->
          <template v-else>
            <button
              class="w-full rounded-full bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:bg-blue-700"
              @click="goToDashboard"
            >
              Przejdź do aplikacji
            </button>

            <button
              class="flex w-full items-center justify-center gap-2 rounded-full border-2 border-blue-600 bg-transparent px-6 py-3 font-semibold text-blue-600 transition-all duration-300 hover:bg-blue-50"
              @click="handleLogout"
            >
              <UserCircleIcon class="h-5 w-5" />
              Wyloguj się
            </button>
          </template>
        </div>
      </div>
    </transition>
  </nav>
</template>
