import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    redirect: '/'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/RegisterView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('../views/ForgotPasswordView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
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
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Navigation guard
router.beforeEach((to, _from, next) => {
  const isAuthenticated = !!localStorage.getItem('token') // You might want to adjust this based on your auth logic
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (!to.meta.requiresAuth && isAuthenticated && to.name !== 'Login') {
    next('/')
  } else {
    next()
  }
})

export default router

