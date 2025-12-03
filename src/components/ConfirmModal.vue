<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        @click.self="$emit('close')"
      >
        <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
          <div class="mb-4 flex items-start gap-4">
            <div
              class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full"
              :class="iconBgClass"
            >
              <component :is="icon" class="h-6 w-6" :class="iconColorClass" />
            </div>
            <div class="flex-1">
              <h3 class="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                {{ title }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ message }}
              </p>
            </div>
            <button
              v-if="showCloseButton"
              class="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              @click="$emit('close')"
            >
              <XMarkIcon class="h-5 w-5" />
            </button>
          </div>

          <div class="flex gap-3">
            <button
              type="button"
              class="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              @click="$emit('close')"
            >
              {{ cancelText }}
            </button>
            <button
              type="button"
              :class="[
                'flex-1 rounded-lg px-4 py-2 font-medium text-white transition-colors',
                confirmButtonClass,
              ]"
              :disabled="loading"
              @click="$emit('confirm')"
            >
              <span v-if="loading" class="inline-flex items-center gap-2">
                <span class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                {{ loadingText }}
              </span>
              <span v-else>{{ confirmText }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  ExclamationTriangleIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline';

interface Props {
  show: boolean;
  title?: string;
  message: string;
  type?: 'danger' | 'warning' | 'info';
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  loadingText?: string;
  showCloseButton?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Potwierdzenie',
  type: 'danger',
  confirmText: 'Potwierdź',
  cancelText: 'Anuluj',
  loading: false,
  loadingText: 'Przetwarzanie...',
  showCloseButton: true,
});

const emit = defineEmits<{
  close: [];
  confirm: [];
}>();

const icon = computed(() => {
  if (props.type === 'danger') return TrashIcon;
  if (props.type === 'warning') return ExclamationTriangleIcon;
  return ExclamationTriangleIcon;
});

const iconBgClass = computed(() => {
  if (props.type === 'danger') return 'bg-red-100 dark:bg-red-900/20';
  if (props.type === 'warning') return 'bg-yellow-100 dark:bg-yellow-900/20';
  return 'bg-blue-100 dark:bg-blue-900/20';
});

const iconColorClass = computed(() => {
  if (props.type === 'danger') return 'text-red-600 dark:text-red-400';
  if (props.type === 'warning') return 'text-yellow-600 dark:text-yellow-400';
  return 'text-blue-600 dark:text-blue-400';
});

const confirmButtonClass = computed(() => {
  if (props.type === 'danger') return 'bg-red-600 hover:bg-red-700 disabled:opacity-50';
  if (props.type === 'warning') return 'bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50';
  return 'bg-blue-600 hover:bg-blue-700 disabled:opacity-50';
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.95);
  opacity: 0;
}
</style>


