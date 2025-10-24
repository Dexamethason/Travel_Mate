<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-lg">
      <!-- Logo/Nazwa aplikacji - klikalna -->
      <router-link
        to="/"
        class="flex items-center gap-3 border-b p-6 transition-colors hover:bg-gray-50"
      >
        <div
          class="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-400"
        >
          <span class="text-xl font-bold text-white">✈️</span>
        </div>
        <span class="text-xl font-bold text-gray-800">Travel Mate</span>
      </router-link>

      <!-- Nawigacja -->
      <nav class="flex flex-col gap-2 p-4">
        <router-link
          v-for="item in navigationItems"
          :key="item.name"
          :to="item.path"
          class="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors"
          :class="
            isActive(item.path)
              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
          "
        >
          <svg
            fill="currentColor"
            height="24"
            viewBox="0 0 256 256"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path :d="item.icon"></path>
          </svg>
          <span class="text-sm font-semibold">{{ item.label }}</span>
        </router-link>
      </nav>

      <!-- Profil i wylogowanie -->
      <div class="mt-auto border-t p-4 space-y-2">
        <router-link
          to="/profile"
          class="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors"
          :class="
            isActive('/app/profile')
              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
          "
        >
          <svg
            fill="currentColor"
            height="24"
            viewBox="0 0 256 256"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"
            ></path>
          </svg>
          <span class="text-sm font-semibold">Profil</span>
        </router-link>

        <!-- Przycisk wylogowania -->
        <button
          @click="() => { logout(); router.push('/login'); }"
          class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <svg
            fill="currentColor"
            height="24"
            viewBox="0 0 256 256"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M120,216a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V40a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H56V208h56A8,8,0,0,1,120,216Zm109.66-93.66-40-40a8,8,0,0,0-11.32,11.32L204.69,120H112a8,8,0,0,0,0,16h92.69l-26.35,26.34a8,8,0,0,0,11.32,11.32l40-40A8,8,0,0,0,229.66,122.34Z"
            ></path>
          </svg>
          <span class="text-sm font-semibold">Wyloguj</span>
        </button>
      </div>
    </aside>

    <!-- główna treść -->
    <main class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const route = useRoute();
const router = useRouter();
const { logout } = useAuth();

const navigationItems = [
  {
    name: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z',
  },
  {
    name: 'flights',
    label: 'Loty',
    path: '/flights',
    icon: 'M235.58,128.84,160,91.06V48a32,32,0,0,0-64,0V91.06L20.42,128.84A8,8,0,0,0,16,136v32a8,8,0,0,0,9.57,7.84L96,161.76v18.93L82.34,194.34A8,8,0,0,0,80,200v32a8,8,0,0,0,11,7.43l37-14.81,37,14.81A8,8,0,0,0,176,232V200a8,8,0,0,0-2.34-5.66L160,180.69V161.76l70.43,14.08A8,8,0,0,0,240,168V136A8,8,0,0,0,235.58,128.84ZM224,158.24l-70.43-14.08A8,8,0,0,0,144,152v32a8,8,0,0,0,2.34,5.66L160,203.31v16.87l-29-11.61a8,8,0,0,0-5.94,0L96,220.18V203.31l13.66-13.65A8,8,0,0,0,112,184V152a8,8,0,0,0-9.57-7.84L32,158.24v-17.3l75.58-37.78A8,8,0,0,0,112,96V48a16,16,0,0,1,32,0V96a8,8,0,0,0,4.42,7.16L224,140.94Z',
  },
  {
    name: 'accommodations',
    label: 'Noclegi',
    path: '/accommodations',
    icon: 'M208,72H24V48a8,8,0,0,0-16,0V208a8,8,0,0,0,16,0V176H232v32a8,8,0,0,0,16,0V112A40,40,0,0,0,208,72ZM24,88H96v72H24Zm88,72V88h96a24,24,0,0,1,24,24v48Z',
  },
  {
    name: 'itinerary',
    label: 'Plan podróży',
    path: '/itinerary',
    icon: 'M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Zm-96-88v64a8,8,0,0,1-16,0V132.94l-4.42,2.22a8,8,0,0,1-7.16-14.32l16-8A8,8,0,0,1,112,120Zm59.16,30.45L152,176h16a8,8,0,0,1,0,16H136a8,8,0,0,1-6.4-12.8l28.78-38.37A8,8,0,1,0,145.07,132a8,8,0,1,1-13.85-8A24,24,0,0,1,176,136,23.76,23.76,0,0,1,171.16,150.45Z',
  },
  {
    name: 'budget',
    label: 'Budżet',
    path: '/budget',
    icon: 'M152,120H136V56h8a32,32,0,0,1,32,32,8,8,0,0,0,16,0,48.05,48.05,0,0,0-48-48h-8V24a8,8,0,0,0-16,0V40h-8a48,48,0,0,0,0,96h8v64H104a32,32,0,0,1-32-32,8,8,0,0,0-16,0,48.05,48.05,0,0,0,48,48h16v16a8,8,0,0,0,16,0V216h16a48,48,0,0,0,0-96Zm-40,0a32,32,0,0,1,0-64h8v64Zm40,80H136V136h16a32,32,0,0,1,0,64Z',
  },
  {
    name: 'activities',
    label: 'Atrakcje',
    path: '/activities',
    icon: 'M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm64,24V200H96V72ZM40,72H80V200H40ZM216,200H176V72h40V200Z',
  },
];

const isActive = (path: string) => {
  return route.path.startsWith(path);
};
</script>
