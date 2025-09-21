import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/dashboard - Get dashboard summary data
export async function GET(request: NextRequest) {
  try {
    // Check if database is available
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        totalExpenses: 0,
        totalIncome: 0,
        totalSavings: 0,
        expenses: [],
        incomes: [],
        recentTransactions: []
      });
    }
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'default-user'
    
    // Get all-time expenses
    const expenses = await prisma.expense.findMany({
      where: {
        userId,
      },
      include: {
        category: true,
      },
      orderBy: { date: 'desc' },
    })

    // Get all-time incomes
    const incomes = await prisma.income.findMany({
      where: {
        userId,
      },
      include: {
        category: true,
        source: true,
      },
      orderBy: { date: 'desc' },
    })

    // Get budgets
    const budgets = await prisma.budget.findMany({
      where: { userId },
      include: {
        category: true,
      },
    })

    // Calculate totals
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
    const totalIncomes = incomes.reduce((sum, income) => sum + income.amount, 0)
    const totalBudgets = budgets.reduce((sum, budget) => sum + budget.amount, 0)

    // Calculate expenses by category
    const expensesByCategory = expenses.reduce((acc, expense) => {
      const categoryName = expense.category.name
      acc[categoryName] = (acc[categoryName] || 0) + expense.amount
      return acc
    }, {} as Record<string, number>)

    // Calculate incomes by category
    const incomesByCategory = incomes.reduce((acc, income) => {
      const categoryName = income.category.name
      acc[categoryName] = (acc[categoryName] || 0) + income.amount
      return acc
    }, {} as Record<string, number>)

    // Recent transactions (last 5)
    const recentExpenses = expenses.slice(0, 5)
    const recentIncomes = incomes.slice(0, 5)
    const recentTransactions = [...recentExpenses, ...recentIncomes]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)

    return NextResponse.json({
      summary: {
        totalExpenses,
        totalIncomes,
        totalBudgets,
        netIncome: totalIncomes - totalExpenses,
        remainingBudget: totalBudgets - totalExpenses,
      },
      expensesByCategory,
      incomesByCategory,
      recentTransactions,
      expenses: expenses.slice(0, 10), // Last 10 expenses
      incomes: incomes.slice(0, 10), // Last 10 incomes
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 })
  }
}
