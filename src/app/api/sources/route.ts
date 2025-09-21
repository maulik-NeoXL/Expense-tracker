import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const userId = 'default-user';

export async function GET() {
  try {
    // Check if database is available
    if (!process.env.DATABASE_URL) {
      return NextResponse.json([]);
    }
    
    const sources = await prisma.source.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(sources);
  } catch (error) {
    console.error('Error fetching sources:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    // Check if database is available
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 });
    }
    
    const { name, color } = await request.json();
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const newSource = await prisma.source.create({
      data: {
        name,
        color,
        userId,
      },
    });
    return NextResponse.json(newSource, { status: 201 });
  } catch (error) {
    console.error('Error creating source:', error);
    return NextResponse.json({ error: 'Failed to create source' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, name, color } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Source ID is required' }, { status: 400 });
    }
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const updatedSource = await prisma.source.update({
      where: { id, userId },
      data: {
        name,
        color,
      },
    });
    return NextResponse.json(updatedSource);
  } catch (error) {
    console.error('Error updating source:', error);
    return NextResponse.json({ error: 'Failed to update source' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Source ID is required' }, { status: 400 });
    }

    await prisma.source.delete({
      where: { id, userId },
    });
    return NextResponse.json({ message: 'Source deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting source:', error);
    return NextResponse.json({ error: 'Failed to delete source' }, { status: 500 });
  }
}
