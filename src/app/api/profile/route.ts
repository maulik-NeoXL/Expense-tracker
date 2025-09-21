import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('Profile API called');
    const userId = 'default-user'; // In a real app, this would come from authentication

    // Get user profile data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        expenses: true,
        incomes: true,
        categories: true,
        sources: true,
      }
    });

    console.log('User found:', !!user);

    if (!user) {
      console.log('User not found, creating default user...');
      // Create default user if it doesn't exist
      const newUser = await prisma.user.create({
        data: {
          id: userId,
          email: 'john.doe@example.com',
          name: 'John Doe',
        },
        include: {
          expenses: true,
          incomes: true,
          categories: true,
          sources: true,
        }
      });
      
      // Return profile data for the new user
      const profileData = {
        id: newUser.id,
        name: newUser.name || 'John Doe',
        email: newUser.email || 'john.doe@example.com',
        joinDate: new Date(newUser.createdAt).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }),
        avatar: newUser.avatar || 'https://avatars.githubusercontent.com/u/1486366',
        statistics: {
          totalExpenses: 0,
          totalIncomes: 0,
          monthlyExpenses: 0,
          monthlyIncomes: 0,
          activeCategories: 0,
          activeSources: 0,
          totalSavings: 0,
          monthlySavings: 0,
        }
      };
      
      return NextResponse.json(profileData);
    }

    // Calculate statistics
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const totalExpenses = user.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalIncomes = user.incomes.reduce((sum, income) => sum + income.amount, 0);
    
    const monthlyExpenses = user.expenses
      .filter(expense => new Date(expense.date) >= currentMonth)
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    const monthlyIncomes = user.incomes
      .filter(income => new Date(income.date) >= currentMonth)
      .reduce((sum, income) => sum + income.amount, 0);

    const activeCategories = user.categories.length;
    const activeSources = user.sources.length;

    // Format join date
    const joinDate = new Date(user.createdAt).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const profileData = {
      id: user.id,
      name: user.name || 'John Doe',
      email: user.email || 'john.doe@example.com',
      joinDate,
      avatar: user.avatar || 'https://avatars.githubusercontent.com/u/1486366',
      statistics: {
        totalExpenses,
        totalIncomes,
        monthlyExpenses,
        monthlyIncomes,
        activeCategories,
        activeSources,
        totalSavings: totalIncomes - totalExpenses,
        monthlySavings: monthlyIncomes - monthlyExpenses,
      }
    };

    return NextResponse.json(profileData);
  } catch (error) {
    console.error('Error fetching profile data:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = 'default-user'; // In a real app, this would come from authentication
    const body = await request.json();
    const { name, email, avatar } = body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name || undefined,
        email: email || undefined,
        avatar: avatar || undefined,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
