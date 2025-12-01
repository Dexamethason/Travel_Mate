<template>
  <div class="relative">
    <input
      :value="inputValue"
      type="text"
      :placeholder="placeholder"
      class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
      @input="onInput"
      @focus="showDropdown = true"
      @blur="onBlur"
    />

    <ul
      v-if="showDropdown && results.length > 0"
      class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800"
    >
      <li
        v-for="airport in results"
        :key="airport.code"
        class="cursor-pointer px-4 py-3 hover:bg-blue-50 dark:hover:bg-gray-700"
        @mousedown.prevent="selectAirport(airport)"
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

function onBlur() {
  setTimeout(() => {
    showDropdown.value = false;
  }, 200);
}
</script>
