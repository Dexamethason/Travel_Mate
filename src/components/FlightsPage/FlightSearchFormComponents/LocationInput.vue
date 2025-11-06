<template>
  <label class="flex min-w-40 flex-1 flex-col">
    <p class="pb-2 text-base font-medium leading-normal text-gray-900 dark:text-white">
      {{ label }}
    </p>
    <div class="relative">
      <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <MapPinIcon class="h-5 w-5 text-gray-400" />
      </div>
      <input
        :value="modelValue"
        :placeholder="placeholder"
        class="h-12 w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-900 transition-colors focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
    </div>
  </label>
</template>

<script setup lang="ts">
import { MapPinIcon } from '@heroicons/vue/24/outline';

interface Props {
  modelValue: string;
  label: string;
  placeholder: string;
}

defineProps<Props>();
defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>
