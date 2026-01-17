<template>
  <div ref="mapContainer" class="w-full h-full relative z-0"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Restaurant } from '@/types/activitie';

// Bezpieczne usunięcie _getIconUrl
const iconPrototype = L.Icon.Default.prototype as { _getIconUrl?: () => string };
delete iconPrototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapProps {
  restaurants?: Restaurant[];
  centerLat?: number;
  centerLon?: number;
  zoom?: number;
  highlightedId?: string | number;
}

const props = withDefaults(defineProps<MapProps>(), {
  restaurants: () => [],
  centerLat: 52.2297,
  centerLon: 21.0122,
  zoom: 13,
  highlightedId: undefined,
});

const emit = defineEmits<{
  'restaurant-click': [restaurant: Restaurant];
}>();

const mapContainer = ref<HTMLElement | null>(null);
let map: L.Map | null = null;
const markers = new Map<string | number, L.Marker>();

const defaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const highlightedIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [35, 57],
  iconAnchor: [17, 57],
  popupAnchor: [1, -48],
  shadowSize: [57, 57],
  className: 'highlighted-marker',
});

const isOpenNow = (restaurant: Restaurant) => {
  const hours = restaurant.openingHours;
  if (!hours) return false;

  if (/Czynne całą dobę/i.test(hours)) return true;
  if (/Otwarte/i.test(hours)) return true;
  if (/Zamknięte/i.test(hours)) return false;

  return restaurant.isOpen ?? false;
};

onMounted(() => {
  if (!mapContainer.value) return;

  map = L.map(mapContainer.value, {
    zoomControl: true,
    minZoom: 3,
    maxZoom: 18,
    worldCopyJump: true,
    maxBounds: [
      [-85, -180],
      [85, 180],
    ],
    maxBoundsViscosity: 1.0,
  }).setView([props.centerLat, props.centerLon], props.zoom);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
    minZoom: 3,
    noWrap: true,
  }).addTo(map);

  updateMarkers();
});

const updateMarkers = () => {
  if (!map) return;

  markers.forEach(marker => marker.remove());
  markers.clear();

  const validRestaurants = props.restaurants.filter(
    r => r.geometry?.latitude !== undefined && r.geometry?.longitude !== undefined
  );

  validRestaurants.forEach(restaurant => {
    const lat = restaurant.geometry!.latitude;
    const lng = restaurant.geometry!.longitude;
    const isOpen = isOpenNow(restaurant);

    const marker = L.marker([lat, lng], {
      icon: defaultIcon,
    }).addTo(map!);

    const popupContent = `
      <div class="min-w-[280px]">
        <div class="flex gap-3 p-2">
          <div class="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex-shrink-0 overflow-hidden">
            <img
              src="${restaurant.photo || restaurant.photos?.[0] || '/img-notfound.png'}"
              alt="${restaurant.name}"
              class="w-full h-full object-cover"
              onerror="this.src='/img-notfound.png'"
            />
          </div>
          
          <div class="flex-1 min-w-0">
            <h3 class="text-base font-bold text-gray-900 mb-1 cursor-pointer hover:text-blue-600 transition-colors restaurant-name-link leading-tight" data-restaurant-id="${restaurant.id}">
              ${restaurant.name}
            </h3>
            
            <div class="flex items-center gap-2 mb-2">
              <span class="px-2 py-0.5 text-xs font-semibold rounded ${
                isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }">
                ${isOpen ? 'Otwarte' : 'Zamknięte'}
              </span>
              ${restaurant.openingHours ? `<span class="text-xs text-gray-600">${restaurant.openingHours}</span>` : ''}
            </div>
            
            <div class="flex items-center gap-2 flex-wrap text-xs">
              ${
                restaurant.rating
                  ? `
                <div class="flex items-center bg-yellow-50 px-1.5 py-0.5 rounded">
                  <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" />
                  </svg>
                  <span class="ml-1 font-bold text-gray-900">${restaurant.rating.toFixed(1)}</span>
                </div>
              `
                  : ''
              }
              ${
                restaurant.reviews
                  ? `
                <span class="text-gray-500">(${restaurant.reviews.toLocaleString()} opinii)</span>
              `
                  : ''
              }
              ${
                restaurant.priceRange
                  ? `
                ${restaurant.rating || restaurant.reviews ? '<span class="text-gray-300">•</span>' : ''}
                <span class="font-semibold text-gray-900">${restaurant.priceRange}</span>
              `
                  : ''
              }
              ${
                restaurant.cuisine
                  ? `
                ${restaurant.priceRange || restaurant.rating || restaurant.reviews ? '<span class="text-gray-300">•</span>' : ''}
                <span class="font-medium text-gray-700">${restaurant.cuisine}</span>
              `
                  : ''
              }
            </div>
          </div>
        </div>
      </div>
    `;

    marker.bindPopup(popupContent, {
      maxWidth: 320,
      className: 'custom-popup',
    });

    marker.on('popupopen', e => {
      setTimeout(() => {
        const popup = e.popup.getElement();
        if (popup) {
          const nameLink = popup.querySelector(
            `.restaurant-name-link[data-restaurant-id="${restaurant.id}"]`
          );
          if (nameLink) {
            nameLink.addEventListener('click', event => {
              event.preventDefault();
              event.stopPropagation();
              emit('restaurant-click', restaurant);
            });
          }
        }
      }, 0);
    });

    markers.set(restaurant.id, marker);
  });

  if (validRestaurants.length > 0) {
    const bounds = L.latLngBounds(
      validRestaurants.map(r => [r.geometry!.latitude, r.geometry!.longitude] as [number, number])
    );

    map.fitBounds(bounds, { padding: [50, 50] });
  }
};

watch(
  () => props.highlightedId,
  (newId, oldId) => {
    if (oldId !== undefined && markers.has(oldId)) {
      const oldMarker = markers.get(oldId)!;
      oldMarker.setIcon(defaultIcon);
      oldMarker.setZIndexOffset(0);
      oldMarker.closePopup();
    }

    if (newId !== undefined && markers.has(newId)) {
      const marker = markers.get(newId)!;
      marker.setIcon(highlightedIcon);
      marker.setZIndexOffset(1000);

      if (!marker.isPopupOpen()) {
        marker.openPopup();
      }
    }
  }
);

watch(
  () => props.restaurants,
  () => {
    updateMarkers();
  },
  { deep: true }
);

watch(
  () => [props.centerLat, props.centerLon, props.zoom],
  ([lat, lon, zoom]) => {
    if (map) {
      map.setView([lat as number, lon as number], zoom as number);
    }
  }
);
</script>

<style scoped>
:deep(.leaflet-container) {
  height: 100%;
  width: 100%;
  z-index: 0;
}

:deep(.leaflet-pane) {
  z-index: 400;
}

:deep(.leaflet-top),
:deep(.leaflet-bottom) {
  z-index: 500;
}

:deep(.highlighted-marker) {
  filter: hue-rotate(100deg) brightness(1.2);
  transition: all 0.3s ease;
}

:deep(.custom-popup .leaflet-popup-content-wrapper) {
  padding: 0;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

:deep(.custom-popup .leaflet-popup-content) {
  margin: 0;
  width: auto !important;
}

:deep(.custom-popup .leaflet-popup-tip) {
  box-shadow: 0 3px 14px rgba(0, 0, 0, 0.15);
}
</style>
