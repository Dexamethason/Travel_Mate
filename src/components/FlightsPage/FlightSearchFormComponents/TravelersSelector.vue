<template>
  <div class="relative flex min-w-40 flex-1 flex-col" @click.stop>
    <p class="pb-2 text-base font-medium leading-normal text-gray-900 dark:text-white">
      Pasażerowie
    </p>
    <button
      ref="buttonRef"
      type="button"
      class="flex h-12 w-full items-center gap-3 rounded-lg border border-gray-300 bg-white px-4 text-left text-gray-900 transition-colors focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500"
      @click="togglePanel"
    >
      <UsersIcon class="h-5 w-5 flex-shrink-0 text-gray-400" />
      <span class="flex-1">{{ travelersLabel }}</span>
    </button>

    <!-- Panel -->
    <Teleport to="body">
      <div
        v-if="showPanel"
        ref="panelRef"
        :style="panelPosition"
        class="fixed z-50 w-80 rounded-lg border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800"
      >
        <!-- Dorośli -->
        <div class="mb-6 flex items-center justify-between">
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
        <div class="mb-6 flex items-center justify-between">
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
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import {
  UsersIcon,
  UserIcon,
  MinusIcon,
  PlusIcon,
  FaceSmileIcon,
  ArrowPathIcon,
  CheckIcon,
} from '@heroicons/vue/24/outline';
import { useActivePanel } from '../../../composables/useActivePanel';

interface Props {
  adults: number;
  children: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update', value: { adults: number; children: number }): void;
}>();

const { setActivePanel, isActive, closePanel } = useActivePanel();

const showPanel = ref(false);
const tempAdults = ref(props.adults || 1);
const tempChildren = ref(props.children || 0);
const panelRef = ref<HTMLElement | null>(null);
const buttonRef = ref<HTMLElement | null>(null);
const panelPosition = ref({
  top: '0px',
  left: '0px',
  transform: '',
  maxHeight: '',
  overflowY: 'auto' as 'auto' | 'visible',
});

const travelersLabel = computed(() => {
  const adults = props.adults;
  const children = props.children;
  const total = adults + children;

  return `${total} ${total === 1 ? 'pasażer' : total > 4 ? 'pasażerów' : 'pasażerowie'}`;
});

// Obserwuj zmiany props
watch(
  () => [props.adults, props.children] as const,
  ([newAdults, newChildren]) => {
    if (!showPanel.value) {
      tempAdults.value = newAdults as number;
      tempChildren.value = newChildren as number;
    }
  }
);

// Obserwuj zmiany aktywnego panelu
watch(
  () => isActive('travelers'),
  active => {
    if (!active && showPanel.value) {
      showPanel.value = false;
    }
  }
);

const updatePanelPosition = () => {
  if (!buttonRef.value) return;

  const rect = buttonRef.value.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;
  const panelHeight = 350;
  const panelWidth = 320;
  const padding = 16;
  const minSpaceRequired = 250;

  let top = rect.bottom + 8;
  let left = rect.left;
  let transform = '';
  let maxHeight = '';
  let overflowY: 'auto' | 'visible' = 'visible';

  const spaceBelow = viewportHeight - rect.bottom - padding;
  const spaceAbove = rect.top - padding;

  if (spaceBelow >= minSpaceRequired) {
    if (spaceBelow < panelHeight) {
      maxHeight = `${spaceBelow - padding}px`;
      overflowY = 'auto';
    }
  } else if (spaceAbove > spaceBelow && spaceAbove >= minSpaceRequired) {
    top = rect.top - padding;
    transform = 'translateY(-100%)';
    maxHeight = `${Math.min(spaceAbove - padding, panelHeight)}px`;
    overflowY = 'auto';
  } else {
    if (spaceBelow >= spaceAbove) {
      maxHeight = `${spaceBelow - padding}px`;
      overflowY = 'auto';
    } else {
      top = rect.top - padding;
      transform = 'translateY(-100%)';
      maxHeight = `${spaceAbove - padding}px`;
      overflowY = 'auto';
    }
  }

  if (left + panelWidth > viewportWidth - padding) {
    left = Math.max(padding, viewportWidth - panelWidth - padding);
  }

  if (viewportWidth < 768) {
    left = viewportWidth / 2;
    transform = transform ? `${transform} translateX(-50%)` : 'translateX(-50%)';
  }

  panelPosition.value = {
    top: `${top}px`,
    left: `${left}px`,
    transform,
    maxHeight,
    overflowY,
  };
};

const togglePanel = () => {
  if (showPanel.value) {
    showPanel.value = false;
    closePanel();
  } else {
    showPanel.value = true;
    setActivePanel('travelers');
    tempAdults.value = props.adults;
    tempChildren.value = props.children;
    nextTick(() => {
      updatePanelPosition();
    });
  }
};

const apply = () => {
  // ZMIANA: Emituj jeden event z obiektem
  emit('update', {
    adults: tempAdults.value,
    children: tempChildren.value,
  });
  showPanel.value = false;
  closePanel();
};

const reset = () => {
  tempAdults.value = 1;
  tempChildren.value = 0;
  emit('update', {
    adults: 1,
    children: 0,
  });
  showPanel.value = false;
  closePanel();
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (
    showPanel.value &&
    panelRef.value &&
    !panelRef.value.contains(target) &&
    buttonRef.value &&
    !buttonRef.value.contains(target)
  ) {
    showPanel.value = false;
    closePanel();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('resize', updatePanelPosition);
  window.addEventListener('scroll', updatePanelPosition, true);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('resize', updatePanelPosition);
  window.removeEventListener('scroll', updatePanelPosition, true);
});
</script>
