<template>
  <!-- Układ siatki: lista restauracji po lewej, mapa po prawej -->
  <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
    <div class="lg:col-span-2">
      <RestaurantsList />
    </div>
    <div class="lg:col-span-3">
      <RestaurantsMap />
    </div>
  </div>
</template>

<script setup lang="ts">
import RestaurantsList from './RestaurantsList.vue';
import RestaurantsMap from './RestaurantsMap.vue';
</script>
