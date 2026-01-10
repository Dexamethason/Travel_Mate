<template>
  <div class="relative">
    <div class="relative">
      <PaperAirplaneIcon
        class="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500"
      />
      <input
        :value="inputValue"
        type="text"
        :placeholder="placeholder"
        class="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        @input="onInput"
        @focus="showDropdown = true"
        @blur="onBlur"
      />
    </div>

    <ul
      v-if="showDropdown && results.length > 0"
      class="airport-dropdown absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800"
      @mousedown.prevent
    >
      <li
        v-for="airport in results"
        :key="airport.code"
        class="cursor-pointer px-4 py-3 hover:bg-blue-50 dark:hover:bg-gray-700"
        @click="selectAirport(airport)"
      >
        <div class="font-medium text-gray-900 dark:text-white">
          {{ airport.city_pl }} ({{ airport.code }})
        </div>
        <div class="text-sm text-gray-500 dark:text-gray-400">
          {{ airport.name }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useAirportSearch, type Airport } from '@/composables/useAirportSearch';
import { PaperAirplaneIcon } from '@heroicons/vue/24/outline';

const props = defineProps<{
  modelValue: string;
  placeholder?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [code: string];
}>();

const { results, search, getAirportByCode, formatAirport } = useAirportSearch();

const inputValue = ref('');
const showDropdown = ref(false);

watch(
  () => props.modelValue,
  code => {
    if (code && code.length === 3) {
      const airport = getAirportByCode(code);
      if (airport) {
        inputValue.value = formatAirport(airport);
      }
    }
  },
  { immediate: true }
);

function onInput(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  inputValue.value = value;
  search(value);
  showDropdown.value = true;
}

function selectAirport(airport: Airport) {
  inputValue.value = formatAirport(airport);
  emit('update:modelValue', airport.code);
  showDropdown.value = false;
}

function onBlur(event: FocusEvent) {
  // Sprawdź czy focus przeszedł na element wewnątrz dropdownu
  const relatedTarget = event.relatedTarget as HTMLElement;
  if (relatedTarget?.closest('.airport-dropdown')) {
    return; // Nie zamykaj jeśli focus jest wciąż w dropdownie
  }
  showDropdown.value = false;
}
</script>
