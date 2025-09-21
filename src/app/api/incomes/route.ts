import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/incomes - Get all incomes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'default-user'
    
    const incomes = await prisma.income.findMany({
      where: { userId },
      include: {
        category: true,
        source: true,
      },
      orderBy: { date: 'desc' },
    })

    return NextResponse.json(incomes)
  } catch (error) {
    console.error('Error fetching incomes:', error)
    return NextResponse.json({ error: 'Failed to fetch incomes' }, { status: 500 })
  }
}

// POST /api/incomes - Create new income
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, description, categoryId, sourceId, userId = 'default-user' } = body

    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 })
    }

    const income = await prisma.income.create({
      data: {
        amount: parseFloat(amount),
        description,
        categoryId: categoryId || null,
        sourceId: sourceId || null,
        userId,
      },
      include: {
        category: true,
        source: true,
      },
    })

    return NextResponse.json(income, { status: 201 })
  } catch (error) {
    console.error('Error creating income:', error)
    return NextResponse.json({ error: 'Failed to create income' }, { status: 500 })
  }
}

// PUT /api/incomes - Update income
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, amount, description, categoryId } = body

    if (!id) {
      return NextResponse.json({ error: 'Income ID is required' }, { status: 400 })
    }

    const income = await prisma.income.update({
      where: { id },
      data: {
        ...(amount && { amount: parseFloat(amount) }),
        ...(description && { description }),
        ...(categoryId && { categoryId }),
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json(income)
  } catch (error) {
    console.error('Error updating income:', error)
    return NextResponse.json({ error: 'Failed to update income' }, { status: 500 })
  }
}

// DELETE /api/incomes - Delete income
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Income ID is required' }, { status: 400 })
    }

    await prisma.income.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Income deleted successfully' })
  } catch (error) {
    console.error('Error deleting income:', error)
    return NextResponse.json({ error: 'Failed to delete income' }, { status: 500 })
  }
}
