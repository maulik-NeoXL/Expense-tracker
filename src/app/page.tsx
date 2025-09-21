
"use client";

import AppBarChart from "@/components/AppBarChart";
import CardList from "@/components/CardList";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useDashboard } from "@/hooks/useApi";

const Homepage = () => {
  const { formatCurrency } = useCurrency();
  const { dashboardData, loading, error } = useDashboard();
  
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 dark:text-red-400">Error loading dashboard: {error}</p>
      </div>
    );
  }

  const summary = dashboardData?.summary || {
    totalExpenses: 0,
    totalIncomes: 0,
    totalBudgets: 0,
    netIncome: 0,
    remainingBudget: 0,
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 dark:bg-green-950/20 hover:bg-green-100 dark:hover:bg-green-950/30 p-6 rounded-lg border border-green-200 dark:border-green-800 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700 dark:text-green-300">Total Income</p>
              <p className="text-2xl font-bold text-green-800 dark:text-green-200">{formatCurrency(summary.totalIncomes)}</p>
            </div>
            <div className="h-8 w-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <svg className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/30 p-6 rounded-lg border border-red-200 dark:border-red-800 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700 dark:text-red-300">Total Expenses</p>
              <p className="text-2xl font-bold text-red-800 dark:text-red-200">{formatCurrency(summary.totalExpenses)}</p>
            </div>
            <div className="h-8 w-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <svg className="h-4 w-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-950/30 p-6 rounded-lg border border-blue-200 dark:border-blue-800 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Savings</p>
              <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">{formatCurrency(summary.netIncome)}</p>
            </div>
            <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <svg className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Overview */}
      {summary.totalBudgets > 0 && (
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Budget Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-50 dark:bg-purple-950/20 hover:bg-purple-100 dark:hover:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-4 transition-colors duration-200">
              <h3 className="font-semibold text-purple-800 dark:text-purple-200">Total Budget</h3>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{formatCurrency(summary.totalBudgets)}</p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-950/20 hover:bg-orange-100 dark:hover:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg p-4 transition-colors duration-200">
              <h3 className="font-semibold text-orange-800 dark:text-orange-200">Remaining</h3>
              <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{formatCurrency(summary.remainingBudget)}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Budget Usage</span>
              <span>{summary.totalBudgets > 0 ? Math.round((summary.totalExpenses / summary.totalBudgets) * 100) : 0}% used</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full" 
                style={{width: `${summary.totalBudgets > 0 ? Math.min((summary.totalExpenses / summary.totalBudgets) * 100, 100) : 0}%`}}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Chart - Full Width */}
      <div className="bg-card p-4 rounded-lg border">
        <AppBarChart />
      </div>

      {/* Recent Transactions */}
      <div className="bg-card p-4 rounded-lg border pb-6">
        <CardList title="Latest Transactions" />
      </div>
    </div>
  );
};

export default Homepage;
