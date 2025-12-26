<template>
  <div class="flex flex-col h-screen">
    <!-- Header -->
    <ViewHeader v-model:active-tab="activeTab" />

    <!-- Główna zawartość - split view bez odstępów -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Lewa strona - Lista restauracji/atrakcji ze scrollem -->
      <div class="w-[600px] bg-white overflow-y-auto">
        <RestaurantsView v-if="activeTab === 'restaurants'" />
        <AttractionsView v-else />
      </div>

      <div class="flex-1 overflow-hidden">
        <RestaurantsMap v-if="activeTab === 'restaurants'" />
        <AttractionsMap v-else />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ViewHeader from '@/components/ActivitiesPage/ViewHeader.vue';
import RestaurantsView from '@/components/ActivitiesPage/Restaurants/RestaurantsView.vue';
import RestaurantsMap from '@/components/ActivitiesPage/Restaurants/RestaurantsMap.vue';
import AttractionsView from '@/components/ActivitiesPage/Attractions/AttractionsView.vue';
import AttractionsMap from '@/components/ActivitiesPage/Attractions/AttractionsMap.vue';

const activeTab = ref<'restaurants' | 'attractions'>('restaurants');
</script>
