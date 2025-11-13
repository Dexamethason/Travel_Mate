<template>
  <div class="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
    <div class="mb-4 flex items-center gap-3">
      <component :is="icons.PaperAirplaneIcon" class="h-6 w-6 text-blue-600" />
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Planer podróży z AI</h2>
    </div>

    <!-- Progress -->
    <div class="mb-6">
      <div class="mb-1 flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
        <div class="flex items-center gap-2">
          <component :is="icons.CalendarDaysIcon" class="h-4 w-4 text-gray-500" />
          <div>Krok {{ currentStep }} z {{ totalSteps }} — {{ stepTitles[currentStep - 1] }}</div>
        </div>
        <div class="font-semibold">{{ progressPercent }}%</div>
      </div>
      <div class="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          class="h-full"
          :style="{ width: progressPercent + '%', background: progressGradient }"
        ></div>
      </div>
    </div>

    <form @submit.prevent="onGenerate" class="space-y-6">
      <!-- Step 1: Podstawowe informacje -->
      <div v-show="currentStep === 1" class="space-y-4">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label class="mb-2 flex items-center gap-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              <component :is="icons.MapPinIcon" class="h-4 w-4 text-gray-500" />
              Cel podróży *</label>
            <input v-model="formData.destination" type="text" placeholder="np. Paryż, Tokio" class="w-full rounded-lg border px-4 py-2" />
            <p v-if="errors.destination" class="mt-1 text-xs text-red-600">{{ errors.destination }}</p>
          </div>

          <div>
            <label class="mb-2 flex items-center gap-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              <component :is="icons.UserGroupIcon" class="h-4 w-4 text-gray-500" />
              Liczba uczestników *</label>
            <input v-model.number="formData.participants" type="number" min="1" class="w-full rounded-lg border px-4 py-2" />
            <p v-if="errors.participants" class="mt-1 text-xs text-red-600">{{ errors.participants }}</p>
          </div>

          <div>
            <label class="mb-2 flex items-center gap-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              <component :is="icons.CalendarDaysIcon" class="h-4 w-4 text-gray-500" />
              Data wyjazdu *</label>
            <input v-model="formData.start_date" type="date" :min="today" class="w-full rounded-lg border px-4 py-2" />
            <p v-if="errors.start_date" class="mt-1 text-xs text-red-600">{{ errors.start_date }}</p>
          </div>

          <div>
            <label class="mb-2 flex items-center gap-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              <component :is="icons.CalendarDaysIcon" class="h-4 w-4 text-gray-500" />
              Data powrotu *</label>
            <input v-model="formData.end_date" type="date" :min="formData.start_date || today" class="w-full rounded-lg border px-4 py-2" />
            <p v-if="errors.end_date" class="mt-1 text-xs text-red-600">{{ errors.end_date }}</p>
          </div>
        </div>
      </div>

      <!-- Step 2: Budżet -->
      <div v-show="currentStep === 2" class="space-y-4">
        <label class="mb-2 flex items-center gap-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          <component :is="icons.CurrencyDollarIcon" class="h-4 w-4 text-gray-500" />
          Budżet całkowity (PLN) *</label>
        <div class="flex items-center gap-4">
          <input type="range" min="0" max="50000" step="100" v-model.number="formData.budget" class="w-full" />
          <div class="w-24 text-right font-semibold">{{ formData.budget }} PLN</div>
        </div>
        <div class="flex gap-2">
          <button type="button" class="rounded px-3 py-1 text-sm border" @click="setBudget(2000)">2 000</button>
          <button type="button" class="rounded px-3 py-1 text-sm border" @click="setBudget(5000)">5 000</button>
          <button type="button" class="rounded px-3 py-1 text-sm border" @click="setBudget(10000)">10 000</button>
          <button type="button" class="rounded px-3 py-1 text-sm border" @click="setBudget(20000)">20 000</button>
        </div>
        <p v-if="errors.budget" class="mt-1 text-xs text-red-600">{{ errors.budget }}</p>
      </div>

      <!-- Step 3: Transport i Nocleg -->
      <div v-show="currentStep === 3" class="space-y-4">
        <label class="mb-2 flex items-center gap-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          <component :is="icons.PaperAirplaneIcon" class="h-4 w-4 text-gray-500" />
          Środek transportu *</label>
        <div class="flex flex-wrap gap-2">
          <button v-for="t in transportOptions" :key="t.value" type="button"
            @click="formData.transport = t.value"
            :class="['rounded-lg px-4 py-2 border', formData.transport === t.value ? 'bg-blue-600 text-white' : 'text-gray-700']">
            {{ t.label }}
          </button>
        </div>
        <p v-if="errors.transport" class="mt-1 text-xs text-red-600">{{ errors.transport }}</p>

        <label class="mb-2 mt-4 flex items-center gap-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          <component :is="icons.BuildingOffice2Icon" class="h-4 w-4 text-gray-500" />
          Typ noclegu *</label>
        <div class="flex flex-wrap gap-2">
          <button v-for="a in accommodationOptions" :key="a.value" type="button"
            @click="formData.accommodation = a.value"
            :class="['rounded-lg px-4 py-2 border', formData.accommodation === a.value ? 'bg-blue-600 text-white' : 'text-gray-700']">
            {{ a.label }}
          </button>
        </div>
        <p v-if="errors.accommodation" class="mt-1 text-xs text-red-600">{{ errors.accommodation }}</p>
      </div>

      <!-- Step 4: Intensywność -->
      <div v-show="currentStep === 4" class="space-y-4">
        <label class="mb-2 flex items-center gap-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          <component :is="icons.SparklesIcon" class="h-4 w-4 text-gray-500" />
          Intensywność *</label>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div v-for="opt in intensityOptions" :key="opt.value" class="cursor-pointer">
            <div @click="formData.intensity = opt.value"
              :class="['rounded-lg border p-4', formData.intensity === opt.value ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300']">
              <div class="mb-2 font-semibold">{{ opt.label }}</div>
              <div class="text-sm text-gray-600">{{ opt.description }}</div>
            </div>
          </div>
        </div>
        <p v-if="errors.intensity" class="mt-1 text-xs text-red-600">{{ errors.intensity }}</p>
      </div>

      <!-- Step 5: Zainteresowania -->
      <div v-show="currentStep === 5" class="space-y-4">
  <label class="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">Zainteresowania (wybierz przynajmniej jedno) *</label>
        <div class="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
            <label v-for="interest in interestOptions" :key="interest.value" class="flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition-all hover:border-blue-500"
            :class="{ 'border-blue-500 bg-blue-50': formData.interests.includes(interest.value) }">
            <input type="checkbox" :value="interest.value" v-model="formData.interests" class="h-4 w-4" />
            <span class="text-sm">{{ interest.label }}</span>
          </label>
        </div>
        <p v-if="errors.interests" class="mt-1 text-xs text-red-600">{{ errors.interests }}</p>
      </div>

      <!-- Step 6: Dodatkowe preferencje (tagi) -->
      <div v-show="currentStep === 6" class="space-y-4">
  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Miejsca, które chcesz odwiedzić (tagi)</label>
        <div class="flex flex-wrap gap-2">
          <template v-for="(tag, idx) in mustVisitTags" :key="tag">
            <div class="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm">
              <span>{{ tag }}</span>
              <button type="button" @click="removeMustVisit(idx)" class="text-red-500">
                <component :is="icons.XMarkIcon" class="h-3 w-3" />
              </button>
            </div>
          </template>
        </div>
        <input v-model="mustVisitInput" @keydown.enter.prevent="addMustVisitTag" placeholder="Wpisz i naciśnij Enter" class="w-full rounded-lg border px-4 py-2" />

  <label class="mb-2 mt-4 block text-sm font-medium text-gray-700 dark:text-gray-300">Unikaj (tagi)</label>
        <div class="flex flex-wrap gap-2">
          <template v-for="(tag, idx) in avoidTags" :key="tag">
            <div class="flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-sm">
              <span>{{ tag }}</span>
              <button type="button" @click="removeAvoid(idx)" class="text-red-500">
                <component :is="icons.XMarkIcon" class="h-3 w-3" />
              </button>
            </div>
          </template>
        </div>
        <input v-model="avoidInput" @keydown.enter.prevent="addAvoidTag" placeholder="Wpisz i naciśnij Enter" class="w-full rounded-lg border px-4 py-2" />
      </div>

      <!-- Navigation -->
      <div class="flex items-center justify-between">
        <div>
          <button v-if="currentStep > 1" type="button" @click="prevStep" class="rounded-lg border px-4 py-2">◀ Wstecz</button>
        </div>
        <div class="flex items-center gap-3">
          <button type="button" @click="resetForm" class="rounded-lg border px-4 py-2">Wyczyść</button>
          <button v-if="currentStep < totalSteps" type="button" @click="nextStep" :disabled="!isStepValid" class="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50">
            <span class="flex items-center gap-2">
              <span>Dalej</span>
              <component :is="icons.ChevronRightIcon" class="h-4 w-4" />
            </span>
          </button>
          <button v-else type="submit" :disabled="!isStepValid || generating" class="rounded-lg bg-green-600 px-4 py-2 text-white disabled:opacity-50">
            <span v-if="generating" class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></span>
            Wygeneruj plan
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { INTERESTS_OPTIONS, INTENSITY_OPTIONS } from '../types/plan';
import {
  PaperAirplaneIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  BuildingOffice2Icon,
  SparklesIcon,
  XMarkIcon,
  MapPinIcon,
  ChevronRightIcon,
} from '@heroicons/vue/24/outline';
import type { PlannerInput } from '../types/plan';

const emit = defineEmits<{
  generate: [input: PlannerInput];
}>();

const props = defineProps<{
  generating?: boolean;
}>();

// constants / options
const interestOptions = INTERESTS_OPTIONS;
const intensityOptions = INTENSITY_OPTIONS;
const icons = {
  PaperAirplaneIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  BuildingOffice2Icon,
  SparklesIcon,
  XMarkIcon,
  MapPinIcon,
  ChevronRightIcon,
};
const transportOptions = [
  { value: 'samolot', label: '✈️ Samolot' },
  { value: 'samochód', label: '🚗 Samochód' },
  { value: 'pociąg', label: '🚂 Pociąg' },
  { value: 'autobus', label: '🚌 Autobus' },
  { value: 'inne', label: '🚶 Inne' },
];
const accommodationOptions = [
  { value: 'hotel', label: '🏨 Hotel' },
  { value: 'hostel', label: '🏠 Hostel' },
  { value: 'apartament', label: '🏢 Apartament' },
  { value: 'camping', label: '⛺ Camping' },
  { value: 'inne', label: '🛏️ Inne' },
];

// steps
const currentStep = ref(1);
const totalSteps = 6;
const stepTitles = [
  'Podstawowe informacje',
  'Budżet',
  'Transport i Nocleg',
  'Intensywność',
  'Zainteresowania',
  'Dodatkowe preferencje',
];

// progress
const progressPercent = computed(() => Math.round(((currentStep.value - 1) / (totalSteps - 1)) * 100));
const progressGradient = computed(() => `linear-gradient(90deg, #06b6d4 ${progressPercent.value}%, #3b82f6 ${progressPercent.value}%)`);

// dzisiejsza data jako min.
const today = computed(() => {
  const date = new Date();
  return date.toISOString().split('T')[0];
});

// dane formularza
const formData = ref<PlannerInput>({
  destination: '',
  start_date: '',
  end_date: '',
  budget: 5000,
  participants: 1,
  interests: [],
  transport: '',
  accommodation: '',
  intensity: 'moderate',
});

// tags inputs
const mustVisitInput = ref('');
const avoidInput = ref('');
const mustVisitTags = ref<string[]>([]);
const avoidTags = ref<string[]>([]);

// computed validation errors for current step (pure)
const errors = computed(() => {
  const e: Record<string, string> = {};
  if (currentStep.value === 1) {
    if (!formData.value.destination || !formData.value.destination.trim()) e.destination = 'Cel podróży jest wymagany';
    if (!formData.value.start_date) e.start_date = 'Data wyjazdu jest wymagana';
    if (!formData.value.end_date) e.end_date = 'Data powrotu jest wymagana';
    if (formData.value.start_date && formData.value.end_date) {
      const s = new Date(formData.value.start_date);
      const en = new Date(formData.value.end_date);
      if (en < s) e.end_date = 'Data powrotu musi być po dacie wyjazdu';
    }
    if (!formData.value.participants || formData.value.participants < 1) e.participants = 'Podaj liczbę uczestników';
  }

  if (currentStep.value === 2) {
    if (!formData.value.budget || formData.value.budget <= 0) e.budget = 'Podaj poprawny budżet';
  }

  if (currentStep.value === 3) {
    if (!formData.value.transport) e.transport = 'Wybierz środek transportu';
    if (!formData.value.accommodation) e.accommodation = 'Wybierz typ noclegu';
  }

  if (currentStep.value === 4) {
    if (!formData.value.intensity) e.intensity = 'Wybierz intensywność';
  }

  if (currentStep.value === 5) {
    if (!formData.value.interests || formData.value.interests.length === 0) e.interests = 'Wybierz przynajmniej jedno zainteresowanie';
  }

  // Step 6 is optional
  return e;
});

const isStepValid = computed(() => Object.keys(errors.value).length === 0);

// navigation
const nextStep = () => {
  if (!isStepValid.value) return;
  if (currentStep.value < totalSteps) currentStep.value += 1;
};

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value -= 1;
};

const setBudget = (val: number) => {
  formData.value.budget = val;
};

const addMustVisitTag = () => {
  const v = mustVisitInput.value.trim();
  if (!v) return;
  if (!mustVisitTags.value.includes(v)) mustVisitTags.value.push(v);
  mustVisitInput.value = '';
};

const removeMustVisit = (idx: number) => mustVisitTags.value.splice(idx, 1);

const addAvoidTag = () => {
  const v = avoidInput.value.trim();
  if (!v) return;
  if (!avoidTags.value.includes(v)) avoidTags.value.push(v);
  avoidInput.value = '';
};

const removeAvoid = (idx: number) => avoidTags.value.splice(idx, 1);

const resetForm = () => {
  formData.value = {
    destination: '',
    start_date: '',
    end_date: '',
    budget: 5000,
    participants: 1,
    interests: [],
    transport: '',
    accommodation: '',
    intensity: 'moderate',
  };
  mustVisitInput.value = '';
  avoidInput.value = '';
  mustVisitTags.value = [];
  avoidTags.value = [];
  currentStep.value = 1;
};

// generate
const onGenerate = async (e?: Event) => {
  e?.preventDefault?.();
  if (!isStepValid.value || props.generating) return;

  const input: PlannerInput = {
    ...formData.value,
    must_visit: mustVisitTags.value.length ? [...mustVisitTags.value] : undefined,
    avoid: avoidTags.value.length ? [...avoidTags.value] : undefined,
  };

  emit('generate', input);
};
</script>

