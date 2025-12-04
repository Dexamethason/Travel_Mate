<template>
  <!-- Układ siatki: lista atrakcji po lewej, mapa po prawej -->
  <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
    <div class="lg:col-span-2">
      <AttractionsList />
    </div>
    <div class="lg:col-span-3">
      <AttractionsMap />
    </div>
  </div>
</template>

<script setup lang="ts">
import AttractionsList from './AttractionsList.vue';
import AttractionsMap from './AttractionsMap.vue';
</script>
