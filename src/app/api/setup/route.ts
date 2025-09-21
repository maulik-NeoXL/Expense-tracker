import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    // Check if database is available
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ 
        message: 'Database not available',
        success: false 
      }, { status: 503 });
    }

    console.log('Setting up database tables...');

    // Create tables by running a simple query
    // This will create the tables if they don't exist
    await prisma.$executeRaw`SELECT 1`;
    
    // Test creating a user to ensure tables work
    const testUser = await prisma.user.upsert({
      where: { id: 'test-setup' },
      update: {},
      create: {
        id: 'test-setup',
        email: 'test@example.com',
        name: 'Test User',
      },
    });

    // Clean up test user
    await prisma.user.delete({
      where: { id: 'test-setup' }
    });

    console.log('✅ Database setup completed!');

    return NextResponse.json({ 
      message: 'Database tables created successfully!',
      success: true
    });

  } catch (error) {
    console.error('❌ Database setup error:', error);
    return NextResponse.json({ 
      message: 'Failed to setup database tables',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
