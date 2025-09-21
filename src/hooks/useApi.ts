import { useState, useEffect } from 'react'

const API_BASE = '/api'

export interface Expense {
  id: string
  amount: number
  description?: string
  date: string
  userId: string
  categoryId: string
  category: {
    id: string
    name: string
    type: 'EXPENSE' | 'INCOME'
    color?: string
  }
  createdAt: string
  updatedAt: string
}

export interface Income {
  id: string
  amount: number
  description?: string
  date: string
  userId: string
  categoryId?: string
  sourceId?: string
  category?: {
    id: string
    name: string
    type: 'EXPENSE' | 'INCOME'
    color?: string
  }
  source?: {
    id: string
    name: string
    color?: string
  }
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  type: 'EXPENSE' | 'INCOME'
  color?: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface Source {
  id: string
  name: string
  color?: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface Budget {
  id: string
  amount: number
  period: 'MONTHLY' | 'WEEKLY' | 'YEARLY'
  userId: string
  categoryId: string
  category: {
    id: string
    name: string
    type: 'EXPENSE' | 'INCOME'
    color?: string
  }
  createdAt: string
  updatedAt: string
}

// Expenses API
export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchExpenses = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE}/expenses`)
      if (!response.ok) throw new Error('Failed to fetch expenses')
      const data = await response.json()
      setExpenses(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const createExpense = async (expenseData: {
    amount: number
    description?: string
    categoryId: string
  }) => {
    try {
      const response = await fetch(`${API_BASE}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData),
      })
      if (!response.ok) throw new Error('Failed to create expense')
      const newExpense = await response.json()
      setExpenses(prev => [newExpense, ...prev])
      return newExpense
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  const updateExpense = async (id: string, expenseData: {
    amount?: number
    description?: string
    categoryId?: string
  }) => {
    try {
      const response = await fetch(`${API_BASE}/expenses`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...expenseData }),
      })
      if (!response.ok) throw new Error('Failed to update expense')
      const updatedExpense = await response.json()
      setExpenses(prev => prev.map(expense => 
        expense.id === id ? updatedExpense : expense
      ))
      return updatedExpense
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  const deleteExpense = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/expenses?id=${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete expense')
      setExpenses(prev => prev.filter(expense => expense.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [])

  return { expenses, loading, error, createExpense, updateExpense, deleteExpense, refetch: fetchExpenses }
}

// Incomes API
export const useIncomes = () => {
  const [incomes, setIncomes] = useState<Income[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchIncomes = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE}/incomes`)
      if (!response.ok) throw new Error('Failed to fetch incomes')
      const data = await response.json()
      setIncomes(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const createIncome = async (incomeData: {
    amount: number
    description?: string
    categoryId?: string
    sourceId?: string
  }) => {
    try {
      const response = await fetch(`${API_BASE}/incomes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(incomeData),
      })
      if (!response.ok) throw new Error('Failed to create income')
      const newIncome = await response.json()
      setIncomes(prev => [newIncome, ...prev])
      return newIncome
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  const updateIncome = async (id: string, incomeData: {
    amount?: number
    description?: string
    categoryId?: string
    sourceId?: string
  }) => {
    try {
      const response = await fetch(`${API_BASE}/incomes`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...incomeData }),
      })
      if (!response.ok) throw new Error('Failed to update income')
      const updatedIncome = await response.json()
      setIncomes(prev => prev.map(income => 
        income.id === id ? updatedIncome : income
      ))
      return updatedIncome
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  const deleteIncome = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/incomes?id=${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete income')
      setIncomes(prev => prev.filter(income => income.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  useEffect(() => {
    fetchIncomes()
  }, [])

  return { incomes, loading, error, createIncome, updateIncome, deleteIncome, refetch: fetchIncomes }
}

// Categories API
export const useCategories = (type?: 'EXPENSE' | 'INCOME') => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const url = type ? `${API_BASE}/categories?type=${type}` : `${API_BASE}/categories`
      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch categories')
      const data = await response.json()
      setCategories(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const createCategory = async (categoryData: {
    name: string
    type: 'EXPENSE' | 'INCOME'
    color?: string
  }) => {
    try {
      const response = await fetch(`${API_BASE}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
      })
      if (!response.ok) throw new Error('Failed to create category')
      const newCategory = await response.json()
      setCategories(prev => [...prev, newCategory])
      return newCategory
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  const updateCategory = async (id: string, categoryData: {
    name?: string
    type?: 'EXPENSE' | 'INCOME'
    color?: string
  }) => {
    try {
      const response = await fetch(`${API_BASE}/categories`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...categoryData }),
      })
      if (!response.ok) throw new Error('Failed to update category')
      const updatedCategory = await response.json()
      setCategories(prev => prev.map(category => 
        category.id === id ? updatedCategory : category
      ))
      return updatedCategory
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  const deleteCategory = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/categories?id=${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete category')
      setCategories(prev => prev.filter(category => category.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [type, fetchCategories])

  return { categories, loading, error, createCategory, updateCategory, deleteCategory, refetch: fetchCategories }
}

// Budgets API
export const useBudgets = () => {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBudgets = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE}/budgets`)
      if (!response.ok) throw new Error('Failed to fetch budgets')
      const data = await response.json()
      setBudgets(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const createBudget = async (budgetData: {
    amount: number
    period: 'MONTHLY' | 'WEEKLY' | 'YEARLY'
    categoryId: string
  }) => {
    try {
      const response = await fetch(`${API_BASE}/budgets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(budgetData),
      })
      if (!response.ok) throw new Error('Failed to create budget')
      const newBudget = await response.json()
      setBudgets(prev => [...prev, newBudget])
      return newBudget
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  const deleteBudget = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/budgets?id=${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete budget')
      setBudgets(prev => prev.filter(budget => budget.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  useEffect(() => {
    fetchBudgets()
  }, [])

  return { budgets, loading, error, createBudget, deleteBudget, refetch: fetchBudgets }
}

// Dashboard API
export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState<{
    totalExpenses: number;
    totalIncome: number;
    totalSavings: number;
    expenses: any[];
    incomes: any[];
    recentTransactions: any[];
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE}/dashboard`)
      if (!response.ok) throw new Error('Failed to fetch dashboard data')
      const data = await response.json()
      setDashboardData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  return { dashboardData, loading, error, refetch: fetchDashboard }
}

// Sources API
export const useSources = () => {
  const [sources, setSources] = useState<Source[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSources = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE}/sources`)
      if (!response.ok) throw new Error('Failed to fetch sources')
      const data = await response.json()
      setSources(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const createSource = async (sourceData: {
    name: string
    color?: string
  }) => {
    try {
      const response = await fetch(`${API_BASE}/sources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sourceData),
      })
      if (!response.ok) throw new Error('Failed to create source')
      const newSource = await response.json()
      setSources(prev => [...prev, newSource])
      return newSource
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  const updateSource = async (id: string, sourceData: {
    name: string
    color?: string
  }) => {
    try {
      const response = await fetch(`${API_BASE}/sources`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...sourceData }),
      })
      if (!response.ok) throw new Error('Failed to update source')
      const updatedSource = await response.json()
      setSources(prev => prev.map(source => 
        source.id === id ? updatedSource : source
      ))
      return updatedSource
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  const deleteSource = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/sources?id=${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete source')
      setSources(prev => prev.filter(source => source.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  useEffect(() => {
    fetchSources()
  }, [])

  return { sources, loading, error, createSource, updateSource, deleteSource, refetch: fetchSources }
}

export interface ProfileData {
  id: string
  name: string
  email: string
  joinDate: string
  avatar: string
  statistics: {
    totalExpenses: number
    totalIncomes: number
    monthlyExpenses: number
    monthlyIncomes: number
    activeCategories: number
    activeSources: number
    totalSavings: number
    monthlySavings: number
  }
}

// Profile API with caching to prevent multiple calls
let profileCache: ProfileData | null = null;
let profilePromise: Promise<ProfileData> | null = null;

export const useProfile = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(profileCache)
  const [loading, setLoading] = useState(!profileCache)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = async () => {
    // If we already have a promise in flight, wait for it
    if (profilePromise) {
      try {
        const data = await profilePromise;
        setProfileData(data);
        setLoading(false);
        return;
      } catch (err) {
        console.error('Profile promise failed:', err);
        // If the promise failed, we'll try again below
      }
    }

    // If we have cached data, use it
    if (profileCache) {
      setProfileData(profileCache);
      setLoading(false);
      return;
    }

    try {
      setLoading(true)
      profilePromise = fetch(`${API_BASE}/profile`).then(async (response) => {
        if (!response.ok) throw new Error('Failed to fetch profile')
        const data = await response.json()
        profileCache = data; // Cache the result
        return data;
      });
      
      const data = await profilePromise;
      setProfileData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
      profilePromise = null; // Clear the promise
    }
  }

  const updateProfile = async (profileData: {
    name?: string
    email?: string
    avatar?: string
  }) => {
    try {
      const response = await fetch(`${API_BASE}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      })
      if (!response.ok) throw new Error('Failed to update profile')
      const updatedProfile = await response.json()
      const newProfileData = profileCache ? { ...profileCache, ...updatedProfile } : updatedProfile;
      profileCache = newProfileData; // Update cache
      setProfileData(newProfileData)
      return updatedProfile
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const refetch = async () => {
    profileCache = null; // Clear cache to force fresh fetch
    profilePromise = null; // Clear any pending promise
    await fetchProfile();
  }

  return {
    profileData,
    loading,
    error,
    updateProfile,
    refetch
  }
}
