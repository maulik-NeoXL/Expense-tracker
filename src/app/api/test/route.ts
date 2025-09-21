import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'Personal Expense Tracker API is working!',
    status: 'success'
  })
}
