<template>
  <div class="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <div class="mx-auto max-w-4xl">
      <!-- Header -->
      <div class="mb-8">
        <h2 class="text-4xl font-bold text-gray-900 dark:text-white">Podróż do Paryża</h2>
        <p class="text-gray-500 dark:text-gray-400">15 lipca - 22 lipca, 2024</p>
      </div>

      <div class="space-y-12">
        <!-- podsumowanie podróży -->
        <div>
          <h3 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Podsumowanie podróży</h3>
          <div class="space-y-6">
            <!-- Loty -->
            <div class="flex items-center gap-6 rounded-xl bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div class="h-32 w-1/3 flex-shrink-0 rounded-lg bg-cover bg-center" 
                style='background-image: url("https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800");'></div>
              <div class="flex-1">
                <p class="font-bold text-gray-900 dark:text-white">Loty</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">W dwie strony z Warszawy do Paryża</p>
              </div>
            </div>

            <!-- Noclegi -->
            <div class="flex items-center gap-6 rounded-xl bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div class="h-32 w-1/3 flex-shrink-0 rounded-lg bg-cover bg-center" 
                style='background-image: url("https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800");'></div>
              <div class="flex-1">
                <p class="font-bold text-gray-900 dark:text-white">Noclegi</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Hotel w pobliżu Wieży Eiffla</p>
              </div>
            </div>

            <!-- Atrakcje -->
            <div class="flex items-center gap-6 rounded-xl bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div class="h-32 w-1/3 flex-shrink-0 rounded-lg bg-cover bg-center" 
                style='background-image: url("https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800");'></div>
              <div class="flex-1">
                <p class="font-bold text-gray-900 dark:text-white">Atrakcje</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Zwiedzanie, restauracje i doświadczenia kulturalne</p>
              </div>
            </div>
          </div>
        </div>

        <!-- budżet -->
        <div>
          <h3 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Budżet</h3>
          <div class="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div class="mb-2 flex items-baseline justify-between">
              <span class="font-semibold text-gray-900 dark:text-white">Całkowity budżet</span>
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">60%</span>
            </div>
            <div class="mb-2 h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div class="h-2.5 rounded-full bg-blue-500" style="width: 60%"></div>
            </div>
            <p class="text-right text-sm text-gray-500 dark:text-gray-400">3 000 zł / 5 000 zł</p>
          </div>
        </div>

        <!-- członkowie grupy -->
        <div>
          <h3 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Uczestnicy</h3>
          <div class="flex -space-x-4">
            <div 
              v-for="(member, index) in groupMembers" 
              :key="index"
              class="h-12 w-12 rounded-full border-2 border-white dark:border-gray-800 bg-cover bg-center" 
              :style="`background-image: url('${member}');`"
            ></div>
          </div>
        </div>

        <!-- plan podróży -->
        <div>
          <h3 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Plan podróży</h3>
          <div class="flow-root">
            <ul class="-mb-8">
              <li v-for="(day, index) in itinerary" :key="index">
                <div class="relative" :class="{ 'pb-8': index !== itinerary.length - 1 }">
                  <span 
                    v-if="index !== itinerary.length - 1"
                    aria-hidden="true" 
                    class="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                  ></span>
                  <div class="relative flex items-start space-x-3">
                    <div>
                      <div class="relative px-1">
                        <div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 ring-8 ring-gray-50 dark:ring-gray-900">
                          <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
                            <path :d="day.icon"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div class="min-w-0 flex-1 py-1.5">
                      <div class="text-md font-semibold text-gray-900 dark:text-white">{{ day.title }}</div>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{{ day.date }}</p>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const groupMembers = ref([
  'https://i.pravatar.cc/150?img=1',
  'https://i.pravatar.cc/150?img=2',
  'https://i.pravatar.cc/150?img=3',
  'https://i.pravatar.cc/150?img=4',
])

const itinerary = ref([
  {
    title: 'Dzień 1: Przylot i Wieża Eiffla',
    date: '15 lipca',
    icon: 'M235.58,128.84,160,91.06V48a32,32,0,0,0-64,0V91.06L20.42,128.84A8,8,0,0,0,16,136v32a8,8,0,0,0,9.57,7.84L96,161.76v18.93L82.34,194.34A8,8,0,0,0,80,200v32a8,8,0,0,0,11,7.43l37-14.81,37,14.81A8,8,0,0,0,176,232V200a8,8,0,0,0-2.34-5.66L160,180.69V161.76l70.43,14.08A8,8,0,0,0,240,168V136A8,8,0,0,0,235.58,128.84ZM224,158.24l-70.43-14.08A8,8,0,0,0,144,152v32a8,8,0,0,0,2.34,5.66L160,203.31v16.87l-29-11.61a8,8,0,0,0-5.94,0L96,220.18V203.31l13.66-13.65A8,8,0,0,0,112,184V152a8,8,0,0,0-9.57-7.84L32,158.24v-17.3l75.58-37.78A8,8,0,0,0,112,96V48a16,16,0,0,1,32,0V96a8,8,0,0,0,4.42,7.16L224,140.94Z'
  },
  {
    title: 'Dzień 2: Luwr i rejs po Sekwanie',
    date: '16 lipca',
    icon: 'M224,48H32A16,16,0,0,0,16,64V88a16,16,0,0,0,16,16v88a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V104a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48ZM208,192H48V104H208ZM224,88H32V64H224V88ZM96,136a8,8,0,0,1,8-8h48a8,8,0,0,1,0,16H104A8,8,0,0,1,96,136Z'
  },
  {
    title: 'Dzień 3: Wylot',
    date: '17 lipca',
    icon: 'M235.58,128.84,160,91.06V48a32,32,0,0,0-64,0V91.06L20.42,128.84A8,8,0,0,0,16,136v32a8,8,0,0,0,9.57,7.84L96,161.76v18.93L82.34,194.34A8,8,0,0,0,80,200v32a8,8,0,0,0,11,7.43l37-14.81,37,14.81A8,8,0,0,0,176,232V200a8,8,0,0,0-2.34-5.66L160,180.69V161.76l70.43,14.08A8,8,0,0,0,240,168V136A8,8,0,0,0,235.58,128.84ZM224,158.24l-70.43-14.08A8,8,0,0,0,144,152v32a8,8,0,0,0,2.34,5.66L160,203.31v16.87l-29-11.61a8,8,0,0,0-5.94,0L96,220.18V203.31l13.66-13.65A8,8,0,0,0,112,184V152a8,8,0,0,0-9.57-7.84L32,158.24v-17.3l75.58-37.78A8,8,0,0,0,112,96V48a16,16,0,0,1,32,0V96a8,8,0,0,0,4.42,7.16L224,140.94Z'
  }
])
</script>