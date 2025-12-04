<template>
  <div class="min-h-screen bg-gray-50">
    <ViewHeader :active-tab="activeTab" @update:active-tab="activeTab = $event" />
    <div class="p-6 space-y-4">
      <component :is="activeTab === 'restaurants' ? RestaurantsView : AttractionsView" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ViewHeader from '@/components/ActivitiesPage/ViewHeader.vue';
import RestaurantsView from '@/components/ActivitiesPage/Restaurants/RestaurantsView.vue';
import AttractionsView from '@/components/ActivitiesPage/Attractions/AttractionsView.vue';

// Aktywna zakładka (restauracje lub atrakcje)
const activeTab = ref<'restaurants' | 'attractions'>('restaurants');
</script>
