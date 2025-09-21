import { PrismaClient, CategoryType } from '@prisma/client';

const prisma = new PrismaClient()

async function main() {
  const userId = 'default-user'

  // Create user if not exists
  await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      email: 'john.doe@example.com',
      name: 'John Doe',
      avatar: 'https://avatars.githubusercontent.com/u/1486366',
    },
  })

  // Create dummy categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { id: 'cat-food' },
      update: {},
      create: {
        id: 'cat-food',
        name: 'Food & Dining',
        color: '#EF4444',
        userId,
      },
    }),
    prisma.category.upsert({
      where: { id: 'cat-transport' },
      update: {},
      create: {
        id: 'cat-transport',
        name: 'Transportation',
        color: '#3B82F6',
        userId,
      },
    }),
    prisma.category.upsert({
      where: { id: 'cat-entertainment' },
      update: {},
      create: {
        id: 'cat-entertainment',
        name: 'Entertainment',
        color: '#8B5CF6',
        userId,
      },
    }),
    prisma.category.upsert({
      where: { id: 'cat-shopping' },
      update: {},
      create: {
        id: 'cat-shopping',
        name: 'Shopping',
        color: '#10B981',
        userId,
      },
    }),
    prisma.category.upsert({
      where: { id: 'cat-health' },
      update: {},
      create: {
        id: 'cat-health',
        name: 'Healthcare',
        color: '#F59E0B',
        userId,
      },
    }),
  ])

  // Create dummy sources
  const sources = await Promise.all([
    prisma.source.upsert({
      where: { id: 'src-salary' },
      update: {},
      create: {
        id: 'src-salary',
        name: 'Salary',
        color: '#10B981',
        userId,
      },
    }),
    prisma.source.upsert({
      where: { id: 'src-freelance' },
      update: {},
      create: {
        id: 'src-freelance',
        name: 'Freelance',
        color: '#3B82F6',
        userId,
      },
    }),
    prisma.source.upsert({
      where: { id: 'src-investment' },
      update: {},
      create: {
        id: 'src-investment',
        name: 'Investment',
        color: '#8B5CF6',
        userId,
      },
    }),
  ])

  // Create dummy expenses (last 30 days)
  const expenseData = [
    { amount: 45.50, description: 'Lunch at restaurant', categoryId: 'cat-food', daysAgo: 1 },
    { amount: 12.30, description: 'Coffee', categoryId: 'cat-food', daysAgo: 2 },
    { amount: 25.00, description: 'Uber ride', categoryId: 'cat-transport', daysAgo: 3 },
    { amount: 89.99, description: 'Movie tickets', categoryId: 'cat-entertainment', daysAgo: 5 },
    { amount: 120.00, description: 'Grocery shopping', categoryId: 'cat-food', daysAgo: 7 },
    { amount: 15.50, description: 'Bus pass', categoryId: 'cat-transport', daysAgo: 10 },
    { amount: 75.00, description: 'New shirt', categoryId: 'cat-shopping', daysAgo: 12 },
    { amount: 200.00, description: 'Doctor visit', categoryId: 'cat-health', daysAgo: 15 },
    { amount: 35.00, description: 'Dinner with friends', categoryId: 'cat-food', daysAgo: 18 },
    { amount: 50.00, description: 'Gas', categoryId: 'cat-transport', daysAgo: 20 },
    { amount: 29.99, description: 'Netflix subscription', categoryId: 'cat-entertainment', daysAgo: 22 },
    { amount: 85.00, description: 'Pharmacy', categoryId: 'cat-health', daysAgo: 25 },
    { amount: 60.00, description: 'Weekend groceries', categoryId: 'cat-food', daysAgo: 28 },
    { amount: 18.00, description: 'Parking', categoryId: 'cat-transport', daysAgo: 30 },
  ]

  for (const expense of expenseData) {
    const date = new Date()
    date.setDate(date.getDate() - expense.daysAgo)
    
    await prisma.expense.upsert({
      where: { id: `exp-${expense.daysAgo}` },
      update: {},
      create: {
        id: `exp-${expense.daysAgo}`,
        amount: expense.amount,
        description: expense.description,
        categoryId: expense.categoryId,
        userId,
        date,
      },
    })
  }

  // Create dummy income (last 30 days)
  const incomeData = [
    { amount: 3000.00, description: 'Monthly salary', sourceId: 'src-salary', daysAgo: 5 },
    { amount: 500.00, description: 'Freelance project', sourceId: 'src-freelance', daysAgo: 12 },
    { amount: 150.00, description: 'Stock dividends', sourceId: 'src-investment', daysAgo: 15 },
    { amount: 800.00, description: 'Consulting work', sourceId: 'src-freelance', daysAgo: 20 },
    { amount: 200.00, description: 'Bonus', sourceId: 'src-salary', daysAgo: 25 },
  ]

  for (const income of incomeData) {
    const date = new Date()
    date.setDate(date.getDate() - income.daysAgo)
    
    await prisma.income.upsert({
      where: { id: `inc-${income.daysAgo}` },
      update: {},
      create: {
        id: `inc-${income.daysAgo}`,
        amount: income.amount,
        description: income.description,
        sourceId: income.sourceId,
        userId,
        date,
      },
    })
  }

  // Create dummy budgets
  await Promise.all([
    prisma.budget.upsert({
      where: { id: 'budget-food' },
      update: {},
      create: {
        id: 'budget-food',
        amount: 500.00,
        period: 'MONTHLY',
        categoryId: 'cat-food',
        userId,
      },
    }),
    prisma.budget.upsert({
      where: { id: 'budget-transport' },
      update: {},
      create: {
        id: 'budget-transport',
        amount: 200.00,
        period: 'MONTHLY',
        categoryId: 'cat-transport',
        userId,
      },
    }),
    prisma.budget.upsert({
      where: { id: 'budget-entertainment' },
      update: {},
      create: {
        id: 'budget-entertainment',
        amount: 150.00,
        period: 'MONTHLY',
        categoryId: 'cat-entertainment',
        userId,
      },
    }),
  ])

  console.log('✅ User created/verified successfully!');
  console.log('✅ Dummy data created successfully!');
  console.log(`📊 Created ${categories.length} categories, ${sources.length} sources, ${expenseData.length} expenses, ${incomeData.length} incomes, and 3 budgets`);
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
