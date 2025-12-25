<template>
  <div class="flex h-screen bg-gray-100 dark:bg-gray-900">
    <!-- Hamburger button (mobile) -->
    <button
      v-if="isMobile"
      @click="sidebarOpen = !sidebarOpen"
      class="fixed left-4 top-4 z-50 rounded-lg bg-white p-2 shadow-lg dark:bg-gray-800"
    >
      <Bars3Icon v-if="!sidebarOpen" class="h-6 w-6 text-gray-700 dark:text-gray-300" />
      <XMarkIcon v-else class="h-6 w-6 text-gray-700 dark:text-gray-300" />
    </button>

    <!-- Sidebar -->
    <aside
      :class="[
        'w-64 bg-white shadow-lg dark:bg-gray-800',
        isMobile ? 'fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out' : 'relative',
        isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'
      ]"
    >
      <!-- Logo/Nazwa aplikacji - klikalna -->
      <router-link
        to="/"
        class="flex items-center gap-3 border-b border-gray-200 p-6 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
      >
        <div
          class="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-400"
        >
          <span class="text-xl font-bold text-white">✈️</span>
        </div>
        <span class="text-xl font-bold text-gray-800 dark:text-white">Travel Mate</span>
      </router-link>

      <!-- Nawigacja -->
      <nav class="flex flex-col gap-2 p-4">
        <router-link
          v-for="item in navigationItems"
          :key="item.name"
          :to="item.path"
          class="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors"
          :class="
            isActive(item.path)
              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
          "
          @click="isMobile && (sidebarOpen = false)"
        >
          <component :is="item.iconComponent" class="h-5 w-5" />
          <span class="text-sm font-semibold">{{ item.label }}</span>
        </router-link>
      </nav>

      <!-- Profil i wylogowanie -->
      <div class="mt-auto border-t border-gray-200 p-4 space-y-2 dark:border-gray-700">
        <router-link
          to="/profile"
          class="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors"
          :class="
            isActive('/profile')
              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
          "
          @click="isMobile && (sidebarOpen = false)"
        >
          <UserCircleIcon class="h-5 w-5" />
          <span class="text-sm font-semibold">Profil</span>
        </router-link>

        <!-- Przycisk wylogowania -->
        <button
          @click="() => { logout(); router.push('/login'); }"
          class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
        >
          <ArrowRightOnRectangleIcon class="h-5 w-5" />
          <span class="text-sm font-semibold">Wyloguj</span>
        </button>
      </div>
    </aside>

    <!-- Overlay dla mobile -->
    <div
      v-if="isMobile && sidebarOpen"
      class="fixed inset-0 z-30 bg-black/50"
      @click="sidebarOpen = false"
    ></div>

    <!-- główna treść -->
    <main class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import {
  HomeIcon,
  PaperAirplaneIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/vue/24/outline';

const route = useRoute();
const router = useRouter();
const { logout } = useAuth();

const sidebarOpen = ref(false);
const isMobile = ref(false);

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
  if (!isMobile.value) {
    sidebarOpen.value = true;
  }
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});

const navigationItems = [
  {
    name: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    iconComponent: HomeIcon,
  },
  {
    name: 'flights',
    label: 'Loty',
    path: '/flights',
    iconComponent: PaperAirplaneIcon,
  },
  {
    name: 'accommodations',
    label: 'Noclegi',
    path: '/accommodations',
    iconComponent: BuildingOfficeIcon,
  },
  {
    name: 'itinerary',
    label: 'Plan podróży',
    path: '/itinerary',
    iconComponent: CalendarDaysIcon,
  },
  {
    name: 'budget',
    label: 'Budżet',
    path: '/budget',
    iconComponent: CurrencyDollarIcon,
  },
  {
    name: 'activities',
    label: 'Atrakcje',
    path: '/activities',
    iconComponent: MapPinIcon,
  },
];

const isActive = (path: string) => {
  return route.path.startsWith(path);
};
</script>
