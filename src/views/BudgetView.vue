<template>
  <div class="flex-1 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Budżet</h1>
      <p class="text-sm text-gray-600 dark:text-gray-400">Zarządzaj wydatkami podróży i śledź swoje koszty.</p>
    </div>

    <!-- Summary Cards -->
    <div class="mb-6">
      <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Podsumowanie</h2>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Całkowity budżet</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(budget.total) }}</p>
        </div>
        <div class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Wydane</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(budget.spent) }}</p>
        </div>
        <div class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Pozostało</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(budget.remaining) }}</p>
        </div>
      </div>
    </div>

    <!-- Expenses Table -->
    <div class="mb-6">
      <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Wydatki</h2>
      <div class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">Data</th>
                <th class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">Kategoria</th>
                <th class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">Opis</th>
                <th class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">Kwota</th>
                <th class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">Podzielone z</th>
                <th class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">Akcje</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="expense in expenses" 
                :key="expense.id" 
                class="border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{{ expense.date }}</td>
                <td class="px-4 py-3 text-sm">
                  <span 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getCategoryClass(expense.category)"
                  >
                    {{ expense.category }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{{ expense.description }}</td>
                <td class="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">{{ formatCurrency(expense.amount) }}</td>
                <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{{ expense.splitWith }}</td>
                <td class="px-4 py-3 text-sm">
                  <button 
                    @click="deleteExpense(expense.id)"
                    class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add Expense Button -->
    <div class="flex justify-end">
      <button 
        @click="showAddExpenseModal = true"
        class="flex h-10 items-center justify-center rounded-lg bg-blue-500 hover:bg-blue-600 px-4 text-sm font-bold text-white transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        <span>Dodaj wydatek</span>
      </button>
    </div>

    <!-- Add Expense Modal -->
    <div 
      v-if="showAddExpenseModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="showAddExpenseModal = false"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Dodaj wydatek</h3>
        
        <form @submit.prevent="addExpense" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-900 dark:text-white mb-1">Data</label>
            <input 
              v-model="newExpense.date"
              type="date"
              required
              class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-900 dark:text-white mb-1">Kategoria</label>
            <select 
              v-model="newExpense.category"
              required
              class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Wybierz kategorię</option>
              <option value="Loty">Loty</option>
              <option value="Noclegi">Noclegi</option>
              <option value="Jedzenie">Jedzenie</option>
              <option value="Atrakcje">Atrakcje</option>
              <option value="Transport">Transport</option>
              <option value="Inne">Inne</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-900 dark:text-white mb-1">Opis</label>
            <input 
              v-model="newExpense.description"
              type="text"
              required
              class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Np. Bilet lotniczy do Paryża"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-900 dark:text-white mb-1">Kwota (zł)</label>
            <input 
              v-model.number="newExpense.amount"
              type="number"
              required
              min="0"
              step="0.01"
              class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="0.00"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-900 dark:text-white mb-1">Podzielone z</label>
            <input 
              v-model="newExpense.splitWith"
              type="text"
              class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Wszyscy"
            />
          </div>

          <div class="flex gap-3 pt-4">
            <button 
              type="button"
              @click="showAddExpenseModal = false"
              class="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Anuluj
            </button>
            <button 
              type="submit"
              class="flex-1 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
            >
              Dodaj
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Expense {
  id: number
  date: string
  category: string
  description: string
  amount: number
  splitWith: string
}

const budget = ref({
  total: 5000,
  spent: 3700,
  remaining: 1300
})

const expenses = ref<Expense[]>([
  {
    id: 1,
    date: '15.07.2024',
    category: 'Loty',
    description: 'Bilety lotnicze w dwie strony do Paryża',
    amount: 1600,
    splitWith: 'Wszyscy'
  },
  {
    id: 2,
    date: '16.07.2024',
    category: 'Noclegi',
    description: 'Hotel w Paryżu',
    amount: 1000,
    splitWith: 'Wszyscy'
  },
  {
    id: 3,
    date: '17.07.2024',
    category: 'Jedzenie',
    description: 'Kolacja w restauracji',
    amount: 300,
    splitWith: 'Wszyscy'
  },
  {
    id: 4,
    date: '18.07.2024',
    category: 'Atrakcje',
    description: 'Bilety do muzeum',
    amount: 200,
    splitWith: 'Wszyscy'
  },
  {
    id: 5,
    date: '19.07.2024',
    category: 'Transport',
    description: 'Bilety kolejowe',
    amount: 600,
    splitWith: 'Wszyscy'
  }
])

const showAddExpenseModal = ref(false)

const newExpense = ref({
  date: '',
  category: '',
  description: '',
  amount: 0,
  splitWith: 'Wszyscy'
})

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN'
  }).format(amount)
}

const getCategoryClass = (category: string) => {
  const classes: Record<string, string> = {
    'Loty': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'Noclegi': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    'Jedzenie': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'Atrakcje': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'Transport': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    'Inne': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }
  return classes[category] || classes['Inne']
}

const addExpense = () => {
  const expense: Expense = {
    id: expenses.value.length + 1,
    date: new Date(newExpense.value.date).toLocaleDateString('pl-PL'),
    category: newExpense.value.category,
    description: newExpense.value.description,
    amount: newExpense.value.amount,
    splitWith: newExpense.value.splitWith || 'Wszyscy'
  }
  
  expenses.value.push(expense)
  budget.value.spent += expense.amount
  budget.value.remaining = budget.value.total - budget.value.spent
  
  // Reset form
  newExpense.value = {
    date: '',
    category: '',
    description: '',
    amount: 0,
    splitWith: 'Wszyscy'
  }
  
  showAddExpenseModal.value = false
}

const deleteExpense = (id: number) => {
  const expense = expenses.value.find(e => e.id === id)
  if (expense) {
    budget.value.spent -= expense.amount
    budget.value.remaining = budget.value.total - budget.value.spent
    expenses.value = expenses.value.filter(e => e.id !== id)
  }
}
</script>