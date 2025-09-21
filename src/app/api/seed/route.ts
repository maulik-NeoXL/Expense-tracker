import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CategoryType } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const userId = 'default-user'

    console.log('Starting seed process...')

    // Create user if not exists
    const user = await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: 'john.doe@example.com',
        name: 'John Doe',
      },
    })

    console.log('✅ User created/found:', user.id)

    // Create just one category to test
    try {
      const category = await prisma.category.upsert({
        where: { id: 'cat-food-test' },
        update: {},
        create: {
          id: 'cat-food-test',
          name: 'Food & Dining',
          type: CategoryType.EXPENSE,
          color: '#EF4444',
          userId,
        },
      })
      console.log('✅ Created/found category:', category.name)
    } catch (error) {
      console.log('❌ Error creating category:', error)
    }

    // Create just one source to test
    try {
      const source = await prisma.source.upsert({
        where: { 
          userId_name: {
            userId: userId,
            name: 'Salary'
          }
        },
        update: {},
        create: {
          id: 'src-salary-test',
          name: 'Salary',
          color: '#10B981',
          userId,
        },
      })
      console.log('✅ Created/found source:', source.name)
    } catch (error) {
      console.log('❌ Error creating source:', error)
    }

    // Create sample expenses
    const expenseCategories = ['cat-food-test', 'cat-transport-test', 'cat-entertainment-test'];
    const expenseNames = ['Food & Dining', 'Transportation', 'Entertainment'];
    const expenseColors = ['#EF4444', '#3B82F6', '#8B5CF6'];
    
    for (let i = 0; i < expenseCategories.length; i++) {
      try {
        await prisma.category.upsert({
          where: { id: expenseCategories[i] },
          update: {},
          create: {
            id: expenseCategories[i],
            name: expenseNames[i],
            type: CategoryType.EXPENSE,
            color: expenseColors[i],
            userId,
          },
        })
        console.log(`✅ Created/found expense category: ${expenseNames[i]}`)
      } catch (error) {
        console.log(`❌ Error creating expense category ${expenseNames[i]}:`, error)
      }
    }

    // Create sample sources
    const sourceIds = ['src-salary-test', 'src-freelance-test', 'src-investment-test'];
    const sourceNames = ['Salary', 'Freelance', 'Investment'];
    const sourceColors = ['#10B981', '#F59E0B', '#EF4444'];
    
    for (let i = 0; i < sourceIds.length; i++) {
      try {
        await prisma.source.upsert({
          where: { 
            userId_name: {
              userId: userId,
              name: sourceNames[i]
            }
          },
          update: {},
          create: {
            id: sourceIds[i],
            name: sourceNames[i],
            color: sourceColors[i],
            userId,
          },
        })
        console.log(`✅ Created/found source: ${sourceNames[i]}`)
      } catch (error) {
        console.log(`❌ Error creating source ${sourceNames[i]}:`, error)
      }
    }

    // Create 10 sample expenses
    const expenseData = [
      { amount: 45.50, description: 'Lunch at restaurant', categoryId: 'cat-food-test' },
      { amount: 12.99, description: 'Coffee and pastry', categoryId: 'cat-food-test' },
      { amount: 8.75, description: 'Bus fare', categoryId: 'cat-transport-test' },
      { amount: 25.00, description: 'Movie tickets', categoryId: 'cat-entertainment-test' },
      { amount: 67.80, description: 'Grocery shopping', categoryId: 'cat-food-test' },
      { amount: 15.50, description: 'Uber ride', categoryId: 'cat-transport-test' },
      { amount: 89.99, description: 'Netflix subscription', categoryId: 'cat-entertainment-test' },
      { amount: 23.45, description: 'Dinner with friends', categoryId: 'cat-food-test' },
      { amount: 5.25, description: 'Parking fee', categoryId: 'cat-transport-test' },
      { amount: 34.99, description: 'Concert tickets', categoryId: 'cat-entertainment-test' },
    ];

    for (let i = 0; i < expenseData.length; i++) {
      try {
        const expense = await prisma.expense.create({
          data: {
            ...expenseData[i],
            userId,
            date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
          },
        })
        console.log(`✅ Created expense: ${expense.description} - $${expense.amount}`)
      } catch (error) {
        console.log(`❌ Error creating expense ${expenseData[i].description}:`, error)
      }
    }

    // Create 10 sample incomes
    const incomeData = [
      { amount: 3500.00, description: 'Monthly salary', sourceId: 'src-salary-test' },
      { amount: 450.00, description: 'Freelance project', sourceId: 'src-freelance-test' },
      { amount: 120.50, description: 'Stock dividends', sourceId: 'src-investment-test' },
      { amount: 200.00, description: 'Side gig', sourceId: 'src-freelance-test' },
      { amount: 75.25, description: 'Interest from savings', sourceId: 'src-investment-test' },
      { amount: 300.00, description: 'Consulting work', sourceId: 'src-freelance-test' },
      { amount: 89.99, description: 'Cashback rewards', sourceId: 'src-investment-test' },
      { amount: 150.00, description: 'Part-time job', sourceId: 'src-freelance-test' },
      { amount: 45.00, description: 'Referral bonus', sourceId: 'src-salary-test' },
      { amount: 250.00, description: 'Online course sales', sourceId: 'src-freelance-test' },
    ];

    for (let i = 0; i < incomeData.length; i++) {
      try {
        const income = await prisma.income.create({
          data: {
            amount: incomeData[i].amount,
            description: incomeData[i].description,
            user: {
              connect: { id: userId }
            },
            category: {
              connect: { id: 'cat-food-test' } // Connect to existing category
            },
            date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
          },
        })
        console.log(`✅ Created income: ${income.description} - $${income.amount}`)
      } catch (error) {
        console.log(`❌ Error creating income ${incomeData[i].description}:`, error)
        console.log(`❌ Error details:`, error.message)
      }
    }

    console.log('✅ Seed process completed!')

    return NextResponse.json({ 
      message: 'Sample data created successfully! Added 3 categories, 3 sources, 10 expenses, and 10 incomes.',
      success: true
    });
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    return NextResponse.json({ 
      error: 'Failed to seed data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
