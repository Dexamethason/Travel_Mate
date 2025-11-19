<template>
  <div class="relative flex-1">
    <p class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
      {{ label }}
      <span v-if="hasError" class="text-red-600 dark:text-red-400">*</span>
    </p>
    <div class="relative">
      <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <MapPinIcon :class="['h-5 w-5', hasError ? 'text-red-400' : 'text-gray-400']" />
      </div>
      <input
        :value="modelValue"
        :placeholder="placeholder"
        :class="[
          'h-12 w-full rounded-lg border py-3 pl-10 pr-4 text-gray-900 transition-colors focus:outline-none dark:bg-gray-700 dark:text-white',
          hasError
            ? 'border-red-500 bg-red-50 focus:border-red-500 dark:border-red-700 dark:bg-red-900/20'
            : 'border-gray-300 bg-white focus:border-blue-500 dark:border-gray-600 dark:focus:border-blue-500',
        ]"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { MapPinIcon } from '@heroicons/vue/24/outline';

interface Props {
  modelValue: string;
  label: string;
  placeholder: string;
  hasError?: boolean;
}

withDefaults(defineProps<Props>(), {
  hasError: false,
});

defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>
