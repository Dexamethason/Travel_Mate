<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  ArrowRightStartOnRectangleIcon,
} from '@heroicons/vue/24/outline';
import { useAuth } from '../../composables/useAuth';

const router = useRouter();
const isScrolled = ref(false);
const isMobileMenuOpen = ref(false);
const isProfileMenuOpen = ref(false);
const { currentUser, logout, isAuthenticated } = useAuth();

const userDisplayName = computed(() => {
  if (!currentUser.value) return '';
  return `${currentUser.value.firstName} ${currentUser.value.lastName}`;
});

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
  router.push('/login');
};

const handleLogout = () => {
  logout();
  isProfileMenuOpen.value = false;
  isMobileMenuOpen.value = false;
  router.push('/');
};

const goToDashboard = () => {
  router.push('/dashboard');
  isMobileMenuOpen.value = false;
  isProfileMenuOpen.value = false;
};

const toggleProfileMenu = () => {
  isProfileMenuOpen.value = !isProfileMenuOpen.value;
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
          <template v-if="!isAuthenticated">
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

            <!-- Profil użytkownika z menu -->
            <div class="relative">
              <button
                class="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 transition-all duration-300 hover:bg-gray-200"
                @click="toggleProfileMenu"
              >
                <div
                  class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-400 text-white"
                >
                  <UserCircleIcon class="h-5 w-5" />
                </div>
                <span class="text-sm font-semibold text-gray-700">{{ userDisplayName }}</span>
                <ChevronDownIcon
                  class="h-4 w-4 text-gray-500 transition-transform"
                  :class="{ 'rotate-180': isProfileMenuOpen }"
                />
              </button>

              <!-- Dropdown menu -->
              <transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition duration-150 ease-in"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95"
              >
                <div
                  v-if="isProfileMenuOpen"
                  class="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5"
                >
                  <div class="py-1">
                    <button
                      class="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      @click="handleLogout"
                    >
                      <ArrowRightStartOnRectangleIcon class="h-5 w-5" />
                      Wyloguj się
                    </button>
                  </div>
                </div>
              </transition>
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
          <template v-if="!isAuthenticated">
            <button
              class="w-full rounded-full bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:bg-blue-700"
              @click="handleLogin"
            >
              Zaloguj się
            </button>
          </template>

          <!-- Zalogowany użytkownik -->
          <template v-else>
            <!-- Informacja o użytkowniku -->
            <div class="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3">
              <div
                class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-400 text-white"
              >
                <UserCircleIcon class="h-6 w-6" />
              </div>
              <div>
                <p class="text-sm font-semibold text-gray-900">{{ userDisplayName }}</p>
                <p class="text-xs text-gray-500">{{ currentUser?.email }}</p>
              </div>
            </div>

            <button
              class="w-full rounded-full bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:bg-blue-700"
              @click="goToDashboard"
            >
              Przejdź do aplikacji
            </button>

            <button
              class="flex w-full items-center justify-center gap-2 rounded-full border-2 border-red-600 bg-transparent px-6 py-3 font-semibold text-red-600 transition-all duration-300 hover:bg-red-50"
              @click="handleLogout"
            >
              <ArrowRightStartOnRectangleIcon class="h-5 w-5" />
              Wyloguj się
            </button>
          </template>
        </div>
      </div>
    </transition>
  </nav>
</template>
