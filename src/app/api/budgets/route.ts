import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/budgets - Get all budgets
export async function GET(request: NextRequest) {
  try {
    // Check if database is available
    if (!process.env.DATABASE_URL) {
      return NextResponse.json([]);
    }
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'default-user'
    
    const budgets = await prisma.budget.findMany({
      where: { userId },
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(budgets)
  } catch (error) {
    console.error('Error fetching budgets:', error)
    return NextResponse.json([])
  }
}

// POST /api/budgets - Create new budget
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, period, categoryId, userId = 'default-user' } = body

    if (!amount || !period || !categoryId) {
      return NextResponse.json({ error: 'Amount, period, and category are required' }, { status: 400 })
    }

    const budget = await prisma.budget.create({
      data: {
        amount: parseFloat(amount),
        period,
        categoryId,
        userId,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json(budget, { status: 201 })
  } catch (error) {
    console.error('Error creating budget:', error)
    return NextResponse.json({ error: 'Failed to create budget' }, { status: 500 })
  }
}

// PUT /api/budgets - Update budget
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, amount, period, categoryId } = body

    if (!id) {
      return NextResponse.json({ error: 'Budget ID is required' }, { status: 400 })
    }

    const budget = await prisma.budget.update({
      where: { id },
      data: {
        ...(amount && { amount: parseFloat(amount) }),
        ...(period && { period }),
        ...(categoryId && { categoryId }),
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json(budget)
  } catch (error) {
    console.error('Error updating budget:', error)
    return NextResponse.json({ error: 'Failed to update budget' }, { status: 500 })
  }
}

// DELETE /api/budgets - Delete budget
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Budget ID is required' }, { status: 400 })
    }

    await prisma.budget.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Budget deleted successfully' })
  } catch (error) {
    console.error('Error deleting budget:', error)
    return NextResponse.json({ error: 'Failed to delete budget' }, { status: 500 })
  }
}
