import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import MainLayout from '../layouts/MainLayout.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Landing',
    component: () => import('../views/LandingPage.vue'),
  },
  {
    path: '/app',
    component: MainLayout,
    children: [
      {
        path: '',
        redirect: '/app/dashboard',
      },
      {
        path: 'dashboard',
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
        path: 'budget/:tripId',
        name: 'BudgetTrip',
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
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      };
    }
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0 };
  },
});

export default router;
