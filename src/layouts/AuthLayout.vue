<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Logo Header -->
      <div class="text-center">
        <div class="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
          <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"></path>
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Travel Mate</h1>
        <p class="text-gray-600">Zarządzaj swoimi podróżami</p>
      </div>

      <!-- Main -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <slot />
      </div>

      <!-- Footer -->
      <div class="text-center text-sm text-gray-500">
        <p>&copy; 2024 Travel Mate. Wszystkie prawa zastrzeżone.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
