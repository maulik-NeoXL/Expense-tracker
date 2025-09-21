"use client";

import { useState, useEffect } from 'react';
import { useBudgets, useCategories, useExpenses } from '@/hooks/useApi';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function BudgetPage() {
  const { budgets, loading: budgetsLoading, createBudget, error: budgetsError } = useBudgets();
  const { categories: expenseCategories, loading: categoriesLoading, refetch: refetchCategories } = useCategories('EXPENSE');
  const { expenses, loading: expensesLoading } = useExpenses();
  const { toast } = useToast();
  const { formatCurrency } = useCurrency();
  
  const [formData, setFormData] = useState({
    amount: '',
    categoryId: '',
    period: 'MONTHLY' as 'MONTHLY' | 'WEEKLY' | 'YEARLY',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refresh categories when component mounts to get latest data
  useEffect(() => {
    refetchCategories();
  }, [refetchCategories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.categoryId) return;

    setIsSubmitting(true);
    try {
      await createBudget({
        amount: parseFloat(formData.amount),
        categoryId: formData.categoryId,
        period: formData.period,
      });
      
      setFormData({
        amount: '',
        categoryId: '',
        period: 'MONTHLY',
      });
      
      toast({
        title: "Budget Set!",
        description: `Successfully set ${formatCurrency(parseFloat(formData.amount))} budget for ${formData.period.toLowerCase()} period.`,
      });
    } catch (err) {
      console.error('Error creating budget:', err);
      toast({
        title: "Error",
        description: "Failed to set budget. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate budget statistics
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBudget = totalBudget - totalSpent;
  const budgetUsagePercentage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  // Calculate spent per category
  const getCategorySpent = (categoryId: string) => {
    return expenses
      .filter(expense => expense.categoryId === categoryId)
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  const isOverviewLoading = budgetsLoading || expensesLoading;
  const isCategoriesLoading = categoriesLoading;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Budget</h1>
        <p className="text-muted-foreground mt-2">Set and track your spending limits</p>
      </div>
      
      <div className="grid gap-6">
        {/* Monthly Budget Overview */}
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Budget Overview</h2>
          {isOverviewLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading budget overview...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800">Total Budget</h3>
                  <p className="text-2xl font-bold text-green-900">{formatCurrency(totalBudget)}</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800">Spent</h3>
                  <p className="text-2xl font-bold text-blue-900">{formatCurrency(totalSpent)}</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-800">Remaining</h3>
                  <p className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-purple-900' : 'text-red-600'}`}>
                    {formatCurrency(remainingBudget)}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Budget Progress</span>
                  <span>{budgetUsagePercentage}% used</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${budgetUsagePercentage > 100 ? 'bg-red-500' : 'bg-blue-600'}`}
                    style={{width: `${Math.min(budgetUsagePercentage, 100)}%`}}
                  ></div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Set New Budget */}
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Set New Budget</h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={refetchCategories}
              disabled={categoriesLoading}
            >
              {categoriesLoading ? 'Refreshing...' : 'Refresh Categories'}
            </Button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget-category">Category</Label>
                <Select 
                  value={formData.categoryId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget-amount">Budget Amount</Label>
                <Input 
                  id="budget-amount"
                  type="number" 
                  step="0.01"
                  placeholder="0.00" 
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget-period">Period</Label>
                <Select 
                  value={formData.period}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, period: value as 'MONTHLY' | 'WEEKLY' | 'YEARLY' }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MONTHLY">Monthly</SelectItem>
                    <SelectItem value="WEEKLY">Weekly</SelectItem>
                    <SelectItem value="YEARLY">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button 
              type="submit"
              disabled={isSubmitting || !formData.amount || !formData.categoryId}
              className="mt-4"
            >
              {isSubmitting ? 'Setting...' : 'Set Budget'}
            </Button>
          </form>
          {budgetsError && (
            <p className="mt-2 text-sm text-red-600">Error: {budgetsError}</p>
          )}
        </div>

        {/* Budget Categories */}
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Budget Categories</h2>
          {budgetsLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading budgets...</p>
            </div>
          ) : budgets.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground mb-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Budgets Set</h3>
              <p className="text-gray-500">Create your first budget above to start tracking your spending limits.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {budgets.map((budget) => {
                const categorySpent = getCategorySpent(budget.categoryId);
                const remaining = budget.amount - categorySpent;
                const usagePercentage = budget.amount > 0 ? Math.round((categorySpent / budget.amount) * 100) : 0;
                const isOverBudget = categorySpent > budget.amount;
                
                return (
                  <div 
                    key={budget.id} 
                    className={`flex items-center justify-between p-4 border rounded-lg ${isOverBudget ? 'bg-red-50 border-red-200' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: budget.category.color || '#3B82F6' }}
                      ></div>
                      <div>
                        <p className="font-medium">{budget.category.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(categorySpent)} / {formatCurrency(budget.amount)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {remaining >= 0 ? `${formatCurrency(remaining)} left` : `${formatCurrency(Math.abs(remaining))} over`}
                      </p>
                      <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className={`h-2 rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-blue-500'}`}
                          style={{width: `${Math.min(usagePercentage, 100)}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Budget Tips */}
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Budget Tips</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
              <div>
                <p className="font-medium text-blue-900">Track Daily Spending</p>
                <p className="text-sm text-blue-700">Record expenses daily to stay on top of your budget</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
              <div>
                <p className="font-medium text-green-900">Set Realistic Limits</p>
                <p className="text-sm text-green-700">Start with achievable budget goals and adjust as needed</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
              <div>
                <p className="font-medium text-purple-900">Review Weekly</p>
                <p className="text-sm text-purple-700">Check your progress weekly and make adjustments</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
