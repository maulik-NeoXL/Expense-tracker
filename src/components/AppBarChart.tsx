"use client";
import { useState, useEffect } from "react";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useExpenses, useIncomes } from "@/hooks/useApi";

const chartConfig = {
  income: {
    label: "Income",
    color: "#10b981", // green-500
  },
  expense: {
    label: "Expense",
    color: "#ef4444", // red-500
  },
  savings: {
    label: "Savings",
    color: "#3b82f6", // blue-500
  },
} satisfies ChartConfig;

const AppBarChart = () => {
  const [timePeriod, setTimePeriod] = useState("6months");
  const { convertAmount } = useCurrency();
  const { expenses } = useExpenses();
  const { incomes } = useIncomes();

  const getChartData = () => {
    const now = new Date();
    let months: { month: string; income: number; expense: number; savings: number }[] = [];

    if (timePeriod === "6months") {
      // Last 6 months
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = date.toLocaleDateString('en-GB', { 
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
        
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        const monthExpenses = expenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate >= monthStart && expenseDate <= monthEnd;
        }).reduce((sum, expense) => sum + expense.amount, 0);
        
        const monthIncomes = incomes.filter(income => {
          const incomeDate = new Date(income.date);
          return incomeDate >= monthStart && incomeDate <= monthEnd;
        }).reduce((sum, income) => sum + income.amount, 0);
        
        months.push({
          month: monthName,
          income: convertAmount(monthIncomes),
          expense: convertAmount(monthExpenses),
          savings: convertAmount(monthIncomes - monthExpenses),
        });
      }
    } else if (timePeriod === "lastyear") {
      // Last 12 months
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = date.toLocaleDateString('en-GB', { 
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
        
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        const monthExpenses = expenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate >= monthStart && expenseDate <= monthEnd;
        }).reduce((sum, expense) => sum + expense.amount, 0);
        
        const monthIncomes = incomes.filter(income => {
          const incomeDate = new Date(income.date);
          return incomeDate >= monthStart && incomeDate <= monthEnd;
        }).reduce((sum, income) => sum + income.amount, 0);
        
        months.push({
          month: monthName,
          income: convertAmount(monthIncomes),
          expense: convertAmount(monthExpenses),
          savings: convertAmount(monthIncomes - monthExpenses),
        });
      }
    } else if (timePeriod === "last3years") {
      // Last 3 years
      for (let i = 2; i >= 0; i--) {
        const year = now.getFullYear() - i;
        const yearStart = new Date(year, 0, 1);
        const yearEnd = new Date(year, 11, 31);
        
        const yearExpenses = expenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate >= yearStart && expenseDate <= yearEnd;
        }).reduce((sum, expense) => sum + expense.amount, 0);
        
        const yearIncomes = incomes.filter(income => {
          const incomeDate = new Date(income.date);
          return incomeDate >= yearStart && incomeDate <= yearEnd;
        }).reduce((sum, income) => sum + income.amount, 0);
        
        months.push({
          month: year.toString(),
          income: convertAmount(yearIncomes),
          expense: convertAmount(yearExpenses),
          savings: convertAmount(yearIncomes - yearExpenses),
        });
      }
    }

    return months;
  };

  const getTickFormatter = () => {
    if (timePeriod === "last3years") {
      return (value: string) => value;
    }
    return (value: string) => value.slice(0, 3);
  };

  const chartData = getChartData();
  const hasData = chartData.some(item => item.income > 0 || item.expense > 0);

  return (
    <div className="">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-medium">Analysis</h1>
        <Select value={timePeriod} onValueChange={setTimePeriod}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="6months">Last 6 months</SelectItem>
            <SelectItem value="lastyear">Last year</SelectItem>
            <SelectItem value="last3years">Last 3 years</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {!hasData ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Data Yet</h3>
          <p className="text-gray-500 dark:text-gray-400">Start adding expenses and income to see your financial analysis here.</p>
        </div>
      ) : (
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={getTickFormatter()}
            />
            <YAxis
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="income" fill="var(--color-income)" radius={4} />
            <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
            <Bar dataKey="savings" fill="var(--color-savings)" radius={4} />
          </BarChart>
        </ChartContainer>
      )}
    </div>
  );
};

export default AppBarChart;
