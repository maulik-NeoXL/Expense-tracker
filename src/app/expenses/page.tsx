"use client";

import { useState } from 'react';
import { useExpenses, useCategories } from '@/hooks/useApi';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { X, Edit, Trash2 } from 'lucide-react';

export default function ExpensesPage() {
  const { expenses, loading, createExpense, updateExpense, deleteExpense, error } = useExpenses();
  const { categories: expenseCategories, createExpenseCategory } = useCategories('EXPENSE');
  const { toast } = useToast();
  const { formatCurrency } = useCurrency();
  
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    categoryId: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [editData, setEditData] = useState({
    amount: '',
    description: '',
    categoryId: '',
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Modal state for adding new category
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [newCategoryData, setNewCategoryData] = useState({
    name: '',
    color: '#3B82F6',
  });
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.categoryId) return;

    setIsSubmitting(true);
    try {
      await createExpense({
        amount: parseFloat(formData.amount),
        description: formData.description || undefined,
        categoryId: formData.categoryId,
      });
      
      // Reset form
      setFormData({
        amount: '',
        description: '',
        categoryId: '',
      });
      
      toast({
        title: "Expense Added!",
        description: `Successfully added ${formatCurrency(parseFloat(formData.amount))} expense.`,
      });
    } catch (err) {
      console.error('Error creating expense:', err);
      toast({
        title: "Error",
        description: "Failed to add expense. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (expense: { id: string; amount: number; description: string; date: string; categoryId: string }) => {
    setEditingExpense(expense);
    setEditData({
      amount: expense.amount.toString(),
      description: expense.description || '',
      categoryId: expense.categoryId,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingExpense) return;
    
    try {
      await updateExpense(editingExpense.id, {
        amount: parseFloat(editData.amount),
        description: editData.description || undefined,
        categoryId: editData.categoryId,
      });
      
      toast({
        title: "Expense Updated!",
        description: `Successfully updated expense`,
        variant: "success",
      });
      
      setIsEditModalOpen(false);
      setEditingExpense(null);
      setEditData({ amount: '', description: '', categoryId: '' });
    } catch (error) {
      console.error('Error updating expense:', error);
      toast({
        title: "Error",
        description: "Failed to update expense. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditingExpense(null);
    setEditData({ amount: '', description: '', categoryId: '' });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(id);
        toast({
          title: "Expense Deleted!",
          description: "Successfully deleted expense",
          variant: "success",
        });
      } catch (error) {
        console.error('Error deleting expense:', error);
        toast({
          title: "Error",
          description: "Failed to delete expense. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryData.name) return;

    setIsCreatingCategory(true);
    try {
      const newCategory = await createExpenseCategory({
        name: newCategoryData.name,
        color: newCategoryData.color,
      });
      
      // Auto-select the new category
      setFormData(prev => ({ ...prev, categoryId: newCategory.id }));
      
      // Reset modal form and close modal
      setNewCategoryData({ name: '', color: '#3B82F6' });
      setIsAddCategoryModalOpen(false);
      
      toast({
        title: "Category Added!",
        description: `Successfully added "${newCategory.name}" category.`,
      });
    } catch (err) {
      console.error('Error creating category:', err);
      toast({
        title: "Error",
        description: "Failed to add category. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Pagination logic
  const totalPages = Math.ceil(expenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExpenses = expenses.slice(startIndex, endIndex);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Expenses</h1>
        <p className="text-muted-foreground mt-2">Track and manage your expenses</p>
      </div>
      
      <div className="grid gap-6">
        {/* Quick Add Expense */}
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Add Expense</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expense-amount">Amount</Label>
                    <Input 
                      id="expense-amount"
                      type="number" 
                      step="0.01"
                      placeholder="0.00" 
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expense-category">Category</Label>
                    <Select 
                      value={formData.categoryId}
                      onValueChange={(value) => {
                        if (value === 'add-new') {
                          setIsAddCategoryModalOpen(true);
                        } else {
                          setFormData(prev => ({ ...prev, categoryId: value }));
                        }
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {expenseCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: category.color }}
                              />
                              {category.name}
                            </div>
                          </SelectItem>
                        ))}
                        <SelectItem value="add-new" className="text-blue-600 font-medium">
                          + Add New Category
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expense-description">Description</Label>
                    <Input 
                      id="expense-description"
                      type="text" 
                      placeholder="What did you spend on?" 
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                </div>
                <Button 
                  type="submit"
                  disabled={isSubmitting || !formData.amount || !formData.categoryId}
                  className="mt-4"
                >
                  {isSubmitting ? 'Adding...' : 'Add Expense'}
                </Button>
              </form>
          {error && (
            <p className="mt-2 text-sm text-red-600">Error: {error}</p>
          )}
        </div>

        {/* Add New Category Modal */}
        {isAddCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 backdrop-blur-sm bg-black/20" 
              onClick={() => setIsAddCategoryModalOpen(false)}
            />
            {/* Modal Content */}
            <div className="relative bg-background border rounded-lg shadow-lg w-full max-w-md mx-4">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Add New Category</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAddCategoryModalOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <form onSubmit={handleCreateCategory}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="category-name">Category Name</Label>
                      <Input 
                        id="category-name"
                        type="text" 
                        placeholder="e.g., Groceries, Transport" 
                        value={newCategoryData.name}
                        onChange={(e) => setNewCategoryData(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category-color">Color</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start"
                          >
                            <div 
                              className="w-4 h-4 rounded-full mr-2" 
                              style={{ backgroundColor: newCategoryData.color }}
                            />
                            {newCategoryData.color}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64">
                          <div className="grid grid-cols-6 gap-2">
                            {['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'].map((color) => (
                              <button
                                key={color}
                                type="button"
                                className="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-gray-400"
                                style={{ backgroundColor: color }}
                                onClick={() => setNewCategoryData(prev => ({ ...prev, color }))}
                              />
                            ))}
                          </div>
                          <div className="mt-4">
                            <Label htmlFor="custom-color">Custom Color</Label>
                            <Input
                              id="custom-color"
                              type="color"
                              value={newCategoryData.color}
                              onChange={(e) => setNewCategoryData(prev => ({ ...prev, color: e.target.value }))}
                              className="mt-1"
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end mt-6">
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsAddCategoryModalOpen(false);
                        setNewCategoryData({ name: '', color: '#3B82F6' });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={isCreatingCategory || !newCategoryData.name}
                    >
                      {isCreatingCategory ? 'Adding...' : 'Add Category'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Expense Modal */}
        {isEditModalOpen && editingExpense && (
          <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-200">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 backdrop-blur-sm bg-black/20 animate-in fade-in duration-200" 
              onClick={handleCancelEdit}
            />
            {/* Modal Content */}
            <div className="relative bg-background border rounded-lg shadow-lg w-full max-w-md mx-4 animate-in zoom-in-95 slide-in-from-bottom-2 duration-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Edit Expense</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelEdit}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-amount">Amount</Label>
                      <Input 
                        id="edit-amount"
                        type="number" 
                        step="0.01"
                        placeholder="0.00" 
                        value={editData.amount}
                        onChange={(e) => setEditData(prev => ({ ...prev, amount: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-category">Category</Label>
                      <Select 
                        value={editData.categoryId}
                        onValueChange={(value) => setEditData(prev => ({ ...prev, categoryId: value }))}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {expenseCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: category.color }}
                                />
                                {category.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-description">Description</Label>
                      <Input 
                        id="edit-description"
                        type="text" 
                        placeholder="What did you spend on?" 
                        value={editData.description}
                        onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end mt-6">
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={!editData.amount || !editData.categoryId}
                    >
                      Save Changes
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* All Expenses Table */}
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">All Expenses</h2>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading expenses...</p>
            </div>
          ) : expenses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No expenses yet. Add your first expense above!</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="px-6 py-4 w-16">S.No</TableHead>
                      <TableHead className="px-6 py-4">Description</TableHead>
                      <TableHead className="px-6 py-4">Category</TableHead>
                      <TableHead className="px-6 py-4">Amount</TableHead>
                      <TableHead className="px-6 py-4">Date</TableHead>
                      <TableHead className="px-6 py-4">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentExpenses.map((expense, index) => (
                      <TableRow key={expense.id}>
                        <TableCell className="px-6 py-4 text-center text-muted-foreground">
                          {startIndex + index + 1}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <span className="font-medium text-left block">{expense.description || 'No description'}</span>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: expense.category.color }}
                            />
                            {expense.category.name}
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <span className="font-semibold text-red-600">-{formatCurrency(expense.amount)}</span>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <span className="text-sm text-muted-foreground">{formatDate(expense.date)}</span>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex gap-1 justify-center">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(expense)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(expense.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {startIndex + 1} to {Math.min(endIndex, expenses.length)} of {expenses.length} expenses
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="px-3 py-1 text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
