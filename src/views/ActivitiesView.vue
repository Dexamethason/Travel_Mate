<template>
  <div class="flex flex-col h-screen">
    <!-- Ekran powitalny z wyszukiwaniem -->
    <SearchHero
      v-if="!hasSearched"
      ref="searchHeroRef"
      v-model:active-tab="activeTab"
      @search="handleSearch"
    />

    <!-- Widok z wynikami -->
    <template v-else>
      <!-- Header -->
      <ViewHeader
        ref="headerRef"
        v-model:active-tab="activeTab"
        :initial-location="
          activeTab === 'restaurants' ? lastRestaurantLocation : lastAttractionLocation
        "
        @search="handleSearch"
      />

      <!-- Główna zawartość - split view bez odstępów -->
      <div class="flex flex-1 overflow-hidden">
        <!-- Widok gdy są wyniki -->
        <template v-if="hasCurrentTabResults">
          <!-- Lewa strona - Lista restauracji/atrakcji ze scrollem -->
          <div class="w-[600px] bg-white overflow-y-auto">
            <RestaurantsView v-if="activeTab === 'restaurants'" :restaurants="restaurants" />
            <AttractionsView v-else :attractions="attractions" />
          </div>

          <div class="flex-1 overflow-hidden">
            <RestaurantsMap v-if="activeTab === 'restaurants'" />
            <AttractionsMap v-else />
          </div>
        </template>

        <!-- Komunikat gdy brak wyników dla aktywnej zakładki -->
        <div v-else class="flex-1 flex items-center justify-center bg-gray-50">
          <div class="text-center max-w-md px-6">
            <div class="mb-6">
              <MagnifyingGlassIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 class="text-2xl font-bold text-gray-900 mb-2">
                {{ activeTab === 'restaurants' ? 'Brak restauracji' : 'Brak atrakcji' }}
              </h3>
              <p class="text-gray-600">
                {{
                  activeTab === 'restaurants'
                    ? 'Wyszukaj restauracje w wybranej lokalizacji'
                    : 'Wyszukaj atrakcje w wybranej lokalizacji'
                }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import SearchHero from '@/components/ActivitiesPage/SearchHero.vue';
import ViewHeader from '@/components/ActivitiesPage/ViewHeader.vue';
import RestaurantsView from '@/components/ActivitiesPage/Restaurants/RestaurantsView.vue';
import RestaurantsMap from '@/components/ActivitiesPage/Restaurants/RestaurantsMap.vue';
import AttractionsView from '@/components/ActivitiesPage/Attractions/AttractionsView.vue';
import AttractionsMap from '@/components/ActivitiesPage/Attractions/AttractionsMap.vue';
import { useActivities } from '@/composables/useActivities';
import type { Restaurant, Attraction } from '@/types/activitie';

const activeTab = ref<'restaurants' | 'attractions'>('restaurants');
const headerRef = ref<InstanceType<typeof ViewHeader> | null>(null);
const searchHeroRef = ref<InstanceType<typeof SearchHero> | null>(null);
const { searchRestaurants, searchAttractions } = useActivities();

const restaurants = ref<Restaurant[]>([]);
const attractions = ref<Attraction[]>([]);
const hasSearched = ref(false);
const lastRestaurantLocation = ref('');
const lastAttractionLocation = ref('');

// Sprawdź czy aktualna zakładka ma wyniki
const hasCurrentTabResults = computed(() => {
  if (activeTab.value === 'restaurants') {
    return restaurants.value.length > 0;
  } else {
    return attractions.value.length > 0;
  }
});

const handleSearch = async (location: string, query?: string) => {
  try {
    headerRef.value?.clearMessages();

    if (activeTab.value === 'restaurants') {
      lastRestaurantLocation.value = location;
      const results = await searchRestaurants(location, query || undefined);
      restaurants.value = results;

      if (results.length > 0) {
        hasSearched.value = true;
        setTimeout(() => {
          headerRef.value?.setSearchResults();
          searchHeroRef.value?.resetSearching();
        }, 0);
      } else {
        const errorMsg = 'Nie znaleziono żadnych restauracji. Spróbuj innej lokalizacji.';
        searchHeroRef.value?.setError(errorMsg);
        throw new Error(errorMsg);
      }
    } else {
      lastAttractionLocation.value = location;
      const results = await searchAttractions(location, query || undefined);
      attractions.value = results;

      if (results.length > 0) {
        hasSearched.value = true;
        setTimeout(() => {
          headerRef.value?.setSearchResults();
          searchHeroRef.value?.resetSearching();
        }, 0);
      } else {
        const errorMsg = 'Nie znaleziono żadnych atrakcji. Spróbuj innej lokalizacji.';
        searchHeroRef.value?.setError(errorMsg);
        throw new Error(errorMsg);
      }
    }
  } catch (error) {
    hasSearched.value = false;
    const errorMsg = error instanceof Error ? error.message : 'Wystąpił błąd podczas wyszukiwania';
    searchHeroRef.value?.setError(errorMsg);
  }
};
</script>
