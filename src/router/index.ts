import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import { useAuth } from '../composables/useAuth'

const routes: RouteRecordRaw[] = [
  // Auth routes (public)
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/RegisterView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('../views/ForgotPasswordView.vue'),
    meta: { requiresGuest: true }
  },
  // Protected routes
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
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// guardy routingu - sprawdzają czy user może wejść na daną stronę
router.beforeEach((to, from, next) => {
  try {
    const { isAuthenticated, loading } = useAuth()
    
    // jak jeszcze się ładuje auth, to czekamy chwilę ale nie blokujemy
    if (loading.value) {
      setTimeout(() => {
        // sprawdzenie czy strona wymaga logowania
        if (to.meta.requiresAuth && !isAuthenticated.value) {
          next('/login')
          return
        }
        
        // sprawdzenie czy strona jest tylko dla niezalogowanych (login/register)
        if (to.meta.requiresGuest && isAuthenticated.value) {
          next('/')
          return
        }
        
        next()
      }, 100)
      return
    }
    
    // sprawdzenie czy strona wymaga logowania
    if (to.meta.requiresAuth && !isAuthenticated.value) {
      next('/login')
      return
    }
    
    // sprawdzenie czy strona jest tylko dla niezalogowanych (login/register)
    if (to.meta.requiresGuest && isAuthenticated.value) {
      next('/')
      return
    }
    
    next()
  } catch (error) {
    console.error('Router guard error:', error)
    // jak jest błąd to pozwalamy iść dalej - lepiej niż zablokować usera
    next()
  }
})

export default router

