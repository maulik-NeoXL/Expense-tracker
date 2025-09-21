import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Process the natural language query
    const response = await processFinancialQuery(query);
    
    return NextResponse.json({ 
      response,
      query: query 
    });

  } catch (error) {
    console.error('AI Query Error:', error);
    return NextResponse.json({ error: 'Failed to process query' }, { status: 500 });
  }
}

async function processFinancialQuery(query: string) {
  const lowerQuery = query.toLowerCase();
  
  // Use default user for now (same as other APIs)
  const userId = 'default-user';
  
  // Get financial data filtered by user
  const [expenses, incomes, categories, sources] = await Promise.all([
    prisma.expense.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { date: 'desc' }
    }),
    prisma.income.findMany({
      where: { userId },
      include: { source: true },
      orderBy: { date: 'desc' }
    }),
    prisma.category.findMany({
      where: { userId }
    }),
    prisma.source.findMany({
      where: { userId }
    })
  ]);

  // Calculate basic stats
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);
  const netSavings = totalIncome - totalExpenses;
  
  // Current month stats
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const currentMonthExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
  });
  
  const currentMonthIncome = incomes.filter(inc => {
    const incDate = new Date(inc.date);
    return incDate.getMonth() === currentMonth && incDate.getFullYear() === currentYear;
  });

  const currentMonthTotalExpenses = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const currentMonthTotalIncome = currentMonthIncome.reduce((sum, inc) => sum + inc.amount, 0);

  // Query processing
  if (lowerQuery.includes('total') && lowerQuery.includes('expense')) {
    return `Your total expenses are $${totalExpenses.toFixed(2)} across ${expenses.length} transactions.`;
  }
  
  if (lowerQuery.includes('this month') && lowerQuery.includes('expense')) {
    return `This month you've spent $${currentMonthTotalExpenses.toFixed(2)} across ${currentMonthExpenses.length} transactions.`;
  }
  
  if (lowerQuery.includes('total') && lowerQuery.includes('income')) {
    return `Your total income is $${totalIncome.toFixed(2)}. This month you've earned $${currentMonthTotalIncome.toFixed(2)}.`;
  }
  
  if (lowerQuery.includes('saving') || lowerQuery.includes('net')) {
    return `Your net savings are $${netSavings.toFixed(2)}. This month you've saved $${(currentMonthTotalIncome - currentMonthTotalExpenses).toFixed(2)}.`;
  }
  
  if (lowerQuery.includes('category') || lowerQuery.includes('categories')) {
    const categoryStats = categories.map(cat => {
      const catExpenses = expenses.filter(exp => exp.categoryId === cat.id);
      const catTotal = catExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      return `${cat.name}: $${catTotal.toFixed(2)}`;
    }).join(', ');
    
    return `Here are your expenses by category: ${categoryStats}`;
  }
  
  if (lowerQuery.includes('biggest') || lowerQuery.includes('largest') || lowerQuery.includes('highest')) {
    if (lowerQuery.includes('expense')) {
      const biggestExpense = expenses.reduce((max, exp) => exp.amount > max.amount ? exp : max, expenses[0]);
      if (biggestExpense) {
        const formattedDate = new Date(biggestExpense.date).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
        return `Your biggest expense was $${biggestExpense.amount.toFixed(2)} for "${biggestExpense.description}" in the ${biggestExpense.category.name} category on ${formattedDate}.`;
      }
    }
  }
  
  if (lowerQuery.includes('recent') || lowerQuery.includes('latest')) {
    const recentExpenses = expenses.slice(0, 5);
    const recentList = recentExpenses.map(exp => {
      const formattedDate = new Date(exp.date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      return `$${exp.amount.toFixed(2)} - ${exp.description} (${exp.category.name}) on ${formattedDate}`;
    }).join(', ');
    
    return `Your recent expenses: ${recentList}`;
  }
  
  if (lowerQuery.includes('month') || lowerQuery.includes('this month')) {
    return `This month you've spent $${currentMonthTotalExpenses.toFixed(2)} and earned $${currentMonthTotalIncome.toFixed(2)}, giving you a net of $${(currentMonthTotalIncome - currentMonthTotalExpenses).toFixed(2)}.`;
  }
  
  if (lowerQuery.includes('budget') || lowerQuery.includes('spending')) {
    const avgMonthlyExpense = totalExpenses / Math.max(1, Math.ceil(expenses.length / 30));
    return `Your average daily spending is $${(avgMonthlyExpense / 30).toFixed(2)}. This month you're spending $${(currentMonthTotalExpenses / new Date().getDate()).toFixed(2)} per day on average.`;
  }
  
  if (lowerQuery.includes('how much') && lowerQuery.includes('spend')) {
    return `You've spent a total of $${totalExpenses.toFixed(2)} across ${expenses.length} transactions. Your average expense is $${(totalExpenses / expenses.length).toFixed(2)}.`;
  }
  
  if (lowerQuery.includes('how much') && lowerQuery.includes('earn')) {
    return `You've earned a total of $${totalIncome.toFixed(2)} across ${incomes.length} transactions. Your average income is $${(totalIncome / incomes.length).toFixed(2)}.`;
  }
  
  // RAG-powered response for general financial questions
  return generateRAGResponse(query, {
    expenses,
    incomes,
    categories,
    sources,
    totalExpenses,
    totalIncome,
    netSavings,
    currentMonthTotalExpenses,
    currentMonthTotalIncome,
    currentMonthExpenses,
    currentMonthIncomes
  });
}

// RAG-powered response generation
function generateRAGResponse(query: string, financialData: {
  expenses: any[];
  incomes: any[];
  categories: any[];
  sources: any[];
  totalExpenses: number;
  totalIncome: number;
  netSavings: number;
  currentMonthTotalExpenses: number;
  currentMonthTotalIncome: number;
  currentMonthExpenses: any[];
  currentMonthIncomes: any[];
}) {
  const {
    expenses,
    incomes,
    categories,
    totalExpenses,
    totalIncome,
    netSavings,
    currentMonthTotalExpenses,
    currentMonthTotalIncome,
    currentMonthExpenses
  } = financialData;

  const lowerQuery = query.toLowerCase();
  
  // Extract relevant financial insights based on the query
  const insights = [];
  
  // Spending analysis
  if (lowerQuery.includes('spend') || lowerQuery.includes('expense') || lowerQuery.includes('cost')) {
    insights.push(`Your total spending is $${totalExpenses.toFixed(2)} across ${expenses.length} transactions.`);
    insights.push(`This month you've spent $${currentMonthTotalExpenses.toFixed(2)}.`);
    
    if (expenses.length > 0) {
      const avgExpense = totalExpenses / expenses.length;
      insights.push(`Your average expense is $${avgExpense.toFixed(2)}.`);
      
      const biggestExpense = expenses.reduce((max, exp) => exp.amount > max.amount ? exp : max, expenses[0]);
      insights.push(`Your largest expense was $${biggestExpense.amount.toFixed(2)} for "${biggestExpense.description}".`);
    }
  }
  
  // Income analysis
  if (lowerQuery.includes('earn') || lowerQuery.includes('income') || lowerQuery.includes('salary')) {
    insights.push(`Your total income is $${totalIncome.toFixed(2)} across ${incomes.length} transactions.`);
    insights.push(`This month you've earned $${currentMonthTotalIncome.toFixed(2)}.`);
    
    if (incomes.length > 0) {
      const avgIncome = totalIncome / incomes.length;
      insights.push(`Your average income is $${avgIncome.toFixed(2)}.`);
    }
  }
  
  // Savings analysis
  if (lowerQuery.includes('save') || lowerQuery.includes('saving') || lowerQuery.includes('budget')) {
    insights.push(`Your net savings are $${netSavings.toFixed(2)}.`);
    insights.push(`This month you've saved $${(currentMonthTotalIncome - currentMonthTotalExpenses).toFixed(2)}.`);
    
    if (netSavings > 0) {
      insights.push(`Great job! You're saving money overall.`);
    } else {
      insights.push(`You're spending more than you earn. Consider reducing expenses or increasing income.`);
    }
  }
  
  // Category analysis
  if (lowerQuery.includes('category') || lowerQuery.includes('type') || lowerQuery.includes('where')) {
    const categoryStats = categories.map(cat => {
      const catExpenses = expenses.filter(exp => exp.categoryId === cat.id);
      const catTotal = catExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      return `${cat.name}: $${catTotal.toFixed(2)}`;
    }).join(', ');
    
    insights.push(`Your spending by category: ${categoryStats}`);
  }
  
  // Trend analysis
  if (lowerQuery.includes('trend') || lowerQuery.includes('pattern') || lowerQuery.includes('change')) {
    if (expenses.length > 0) {
      const avgDailySpending = totalExpenses / Math.max(1, Math.ceil(expenses.length / 30));
      insights.push(`Your average daily spending is $${(avgDailySpending / 30).toFixed(2)}.`);
    }
    
    if (currentMonthExpenses.length > 0) {
      const currentDailySpending = currentMonthTotalExpenses / new Date().getDate();
      insights.push(`This month you're spending $${currentDailySpending.toFixed(2)} per day on average.`);
    }
  }
  
  // Financial health assessment
  if (lowerQuery.includes('health') || lowerQuery.includes('good') || lowerQuery.includes('bad') || lowerQuery.includes('advice')) {
    const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;
    
    if (savingsRate > 20) {
      insights.push(`Excellent! You're saving ${savingsRate.toFixed(1)}% of your income.`);
    } else if (savingsRate > 10) {
      insights.push(`Good! You're saving ${savingsRate.toFixed(1)}% of your income.`);
    } else if (savingsRate > 0) {
      insights.push(`You're saving ${savingsRate.toFixed(1)}% of your income. Consider increasing this to 20% for better financial health.`);
    } else {
      insights.push(`You're spending more than you earn. Focus on reducing expenses or increasing income.`);
    }
  }
  
  // If no specific insights were generated, check if it's a general question
  if (insights.length === 0) {
    return handleGeneralQuestion(query, financialData);
  }
  
  return insights.join(' ');
}

// Handle general non-financial questions
function handleGeneralQuestion(query: string, financialData: {
  totalExpenses: number;
  totalIncome: number;
  netSavings: number;
  expenses: any[];
  incomes: any[];
}) {
  const lowerQuery = query.toLowerCase();
  
  // General knowledge responses
  if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('hey')) {
    return `Hello! I'm your AI financial assistant. I can help you with personal finance questions, analyze your spending patterns, and provide financial advice. What would you like to know about your finances?`;
  }
  
  if (lowerQuery.includes('what') && lowerQuery.includes('you') && (lowerQuery.includes('do') || lowerQuery.includes('can'))) {
    return `I'm your AI financial assistant! I can help you with:
• Analyzing your spending and income patterns
• Providing personalized financial advice
• Answering questions about your budget and savings
• Helping you understand your financial health
• Suggesting ways to improve your money management

I have access to your financial data and can provide insights based on your actual spending and income. What would you like to know?`;
  }
  
  if (lowerQuery.includes('help') || lowerQuery.includes('assist')) {
    return `I'm here to help with your personal finances! I can:
• Analyze your spending patterns and trends
• Calculate your savings rate and financial health
• Provide budgeting advice and recommendations
• Answer questions about your income and expenses
• Help you understand where your money goes

Just ask me anything about your finances, like "How can I save more money?" or "What are my biggest expenses?"`;
  }
  
  if (lowerQuery.includes('weather') || lowerQuery.includes('temperature')) {
    return `I'm a financial assistant, so I can't help with weather information. However, I can help you with your personal finances! For example, I can analyze your spending patterns, help with budgeting, or answer questions about your financial health. What financial question can I help you with?`;
  }
  
  if (lowerQuery.includes('time') || lowerQuery.includes('date')) {
    const now = new Date();
    return `The current time is ${now.toLocaleTimeString()}. But I'm here to help with your finances! I can analyze your spending, income, and savings patterns. What financial question would you like me to answer?`;
  }
  
  if (lowerQuery.includes('joke') || lowerQuery.includes('funny')) {
    return `Here's a financial joke: Why don't financial advisors ever get cold? Because they always have their assets covered! 😄

But seriously, I'm here to help with your personal finances. I can analyze your spending patterns, provide budgeting advice, and answer questions about your financial health. What would you like to know about your money?`;
  }
  
  if (lowerQuery.includes('thank') || lowerQuery.includes('thanks')) {
    return `You're welcome! I'm always here to help with your personal finances. Feel free to ask me about your spending patterns, budgeting advice, savings goals, or any other financial questions you might have.`;
  }
  
  // For any other general question, provide a helpful redirect
  return `I'm a financial assistant focused on helping you with personal finance! While I can't answer questions about ${query.toLowerCase()}, I can definitely help you with:

• Your spending and income analysis
• Budgeting and savings advice  
• Financial health assessment
• Expense categorization and trends
• Money management tips

Here's your current financial overview:
• Total expenses: $${financialData.totalExpenses.toFixed(2)} (${financialData.expenses.length} transactions)
• Total income: $${financialData.totalIncome.toFixed(2)} (${financialData.incomes.length} transactions)  
• Net savings: $${financialData.netSavings.toFixed(2)}

What financial question can I help you with today?`;
}
