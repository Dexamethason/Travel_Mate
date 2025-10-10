import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('../views/DashboardView.vue'),
      },
      {
        path: 'flights',
        name: 'Flights',
        component: () => import('../views/FlightsView.vue'),
      },
      {
        path: 'budget',
        name: 'Budget',
        component: () => import('../views/BudgetView.vue'),
      },
      {
        path: 'accommodations',
        name: 'Accommodations',
        component: () => import('../views/AccommodationsView.vue'),
      },
      {
        path: 'itinerary',
        name: 'Itinerary',
        component: () => import('../views/ItineraryView.vue'),
      },
      {
        path: 'activities',
        name: 'Activities',
        component: () => import('../views/ActivitiesView.vue'),
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('../views/ProfileView.vue'),
      },
    ]
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router

