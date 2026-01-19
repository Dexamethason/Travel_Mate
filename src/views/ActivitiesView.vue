<template>
  <div class="flex flex-col h-screen">
    <SearchHero
      v-if="!hasSearched"
      ref="searchHeroRef"
      v-model:active-tab="activeTab"
      @search="handleSearch"
    />

    <template v-else>
      <ViewHeader
        ref="headerRef"
        v-model:active-tab="activeTab"
        :initial-location="
          activeTab === 'restaurants' ? lastRestaurantLocation : lastAttractionLocation
        "
        @search="handleSearch"
      />

      <div class="flex flex-1 overflow-hidden">
        <template v-if="hasCurrentTabResults">
          <div class="w-[600px] bg-white overflow-y-auto relative z-10">
            <RestaurantsView
              v-if="activeTab === 'restaurants'"
              :restaurants="restaurants"
              @card-hover="handleCardHover"
              @card-leave="handleCardLeave"
              @restaurant-click="handleRestaurantClick"
            />
            <AttractionsView
              v-else
              :attractions="attractions"
              @card-hover="handleCardHover"
              @card-leave="handleCardLeave"
              @attraction-click="handleAttractionClick"
            />
          </div>

          <div class="flex-1 overflow-hidden relative z-0">
            <RestaurantsMap
              v-if="activeTab === 'restaurants'"
              :restaurants="restaurants"
              :center-lat="cityCenter.lat"
              :center-lon="cityCenter.lon"
              :highlighted-id="highlightedId"
              @restaurant-click="handleRestaurantClick"
            />
            <AttractionsMap
              v-else
              :attractions="attractions"
              :center-lat="cityCenter.lat"
              :center-lon="cityCenter.lon"
              :highlighted-id="highlightedId"
              @attraction-click="handleAttractionClick"
            />
          </div>
        </template>

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

    <RestaurantDetailsModal
      v-if="selectedRestaurant"
      :show="showRestaurantModal"
      :restaurant="selectedRestaurant"
      @close="closeRestaurantModal"
    />

    <AttractionDetailsModal
      v-if="selectedAttraction"
      :show="showAttractionModal"
      :attraction="selectedAttraction"
      @close="closeAttractionModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import SearchHero from '@/components/ActivitiesPage/SearchHero.vue';
import ViewHeader from '@/components/ActivitiesPage/ViewHeader.vue';
import RestaurantsView from '@/components/ActivitiesPage/Restaurants/RestaurantsView.vue';
import RestaurantsMap from '@/components/ActivitiesPage/Restaurants/RestaurantsMap.vue';
import RestaurantDetailsModal from '@/components/ActivitiesPage/Restaurants/RestaurantDetailsModal.vue';
import AttractionsView from '@/components/ActivitiesPage/Attractions/AttractionsView.vue';
import AttractionsMap from '@/components/ActivitiesPage/Attractions/AttractionsMap.vue';
import AttractionDetailsModal from '@/components/ActivitiesPage/Attractions/AttractionDetailsModal.vue';
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
const cityCenter = ref({ lat: 52.2297, lon: 21.0122 });

const hasCurrentTabResults = computed(() => {
  if (activeTab.value === 'restaurants') {
    return restaurants.value.length > 0;
  } else {
    return attractions.value.length > 0;
  }
});

const highlightedId = ref<string | number | undefined>(undefined);
const selectedRestaurant = ref<Restaurant | null>(null);
const selectedAttraction = ref<Attraction | null>(null);
const showRestaurantModal = ref(false);
const showAttractionModal = ref(false);

const handleCardHover = (id: string | number) => {
  highlightedId.value = id;
};

const handleCardLeave = () => {
  highlightedId.value = undefined;
};

const handleRestaurantClick = (restaurant: Restaurant) => {
  selectedRestaurant.value = restaurant;
  showRestaurantModal.value = true;
};

const handleAttractionClick = (attraction: Attraction) => {
  selectedAttraction.value = attraction;
  showAttractionModal.value = true;
};

const closeRestaurantModal = () => {
  showRestaurantModal.value = false;
  setTimeout(() => {
    selectedRestaurant.value = null;
  }, 300);
};

const closeAttractionModal = () => {
  showAttractionModal.value = false;
  setTimeout(() => {
    selectedAttraction.value = null;
  }, 300);
};

const handleSearch = async (location: string, query?: string) => {
  try {
    headerRef.value?.clearMessages();

    if (activeTab.value === 'restaurants') {
      lastRestaurantLocation.value = location;
      const results = await searchRestaurants(location, query || undefined);
      restaurants.value = results;

      if (results.length > 0) {
        const firstRestaurant = results[0];
        if (firstRestaurant?.geometry?.latitude && firstRestaurant?.geometry?.longitude) {
          cityCenter.value = {
            lat: firstRestaurant.geometry.latitude,
            lon: firstRestaurant.geometry.longitude,
          };
        }

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
        const firstAttraction = results[0];
        if (firstAttraction?.geometry?.latitude && firstAttraction?.geometry?.longitude) {
          cityCenter.value = {
            lat: firstAttraction.geometry.latitude,
            lon: firstAttraction.geometry.longitude,
          };
        }

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
