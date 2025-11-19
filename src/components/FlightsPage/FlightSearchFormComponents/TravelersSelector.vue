<template>
  <div class="w-full space-y-6" @click.stop>
    <!-- Dorośli -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div
          class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900"
        >
          <UserIcon class="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <p class="text-base font-semibold text-gray-900 dark:text-white">Dorośli</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">w wieku powyżej 18 lat</p>
        </div>
      </div>
      <div class="flex items-center gap-1">
        <button
          type="button"
          :disabled="tempAdults <= 1"
          class="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-gray-100 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
          @click="tempAdults--"
        >
          <MinusIcon class="h-4 w-4" />
        </button>
        <span class="w-8 text-center text-base font-semibold text-gray-900 dark:text-white">
          {{ tempAdults }}
        </span>
        <button
          type="button"
          :disabled="tempAdults >= 9"
          class="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
          @click="tempAdults++"
        >
          <PlusIcon class="h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- Dzieci -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div
          class="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900"
        >
          <FaceSmileIcon class="h-5 w-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <p class="text-base font-semibold text-gray-900 dark:text-white">Dzieci</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">w wieku od 0 do 17 lat</p>
        </div>
      </div>
      <div class="flex items-center gap-1">
        <button
          type="button"
          :disabled="tempChildren <= 0"
          class="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-gray-100 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
          @click="tempChildren--"
        >
          <MinusIcon class="h-4 w-4" />
        </button>
        <span class="w-8 text-center text-base font-semibold text-gray-900 dark:text-white">
          {{ tempChildren }}
        </span>
        <button
          type="button"
          :disabled="tempChildren >= 9"
          class="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
          @click="tempChildren++"
        >
          <PlusIcon class="h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- Przyciski -->
    <div class="flex gap-2">
      <button
        v-if="tempAdults + tempChildren > 1"
        type="button"
        class="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        @click="reset"
      >
        <ArrowPathIcon class="h-4 w-4" />
        Resetuj
      </button>
      <button
        type="button"
        class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-500 py-2 font-semibold text-white transition-colors hover:bg-blue-600"
        @click="apply"
      >
        <CheckIcon class="h-4 w-4" />
        Zastosuj
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  UserIcon,
  MinusIcon,
  PlusIcon,
  FaceSmileIcon,
  ArrowPathIcon,
  CheckIcon,
} from '@heroicons/vue/24/outline';

interface Props {
  adults: number;
  children: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update', value: { adults: number; children: number }): void;
}>();

const tempAdults = ref(props.adults || 1);
const tempChildren = ref(props.children || 0);

// Synchronizuj temp wartości z props
watch(
  () => [props.adults, props.children] as const,
  ([newAdults, newChildren]) => {
    tempAdults.value = newAdults as number;
    tempChildren.value = newChildren as number;
  }
);

const apply = () => {
  emit('update', {
    adults: tempAdults.value,
    children: tempChildren.value,
  });
};

const reset = () => {
  tempAdults.value = 1;
  tempChildren.value = 0;
  emit('update', {
    adults: 1,
    children: 0,
  });
};
</script>
