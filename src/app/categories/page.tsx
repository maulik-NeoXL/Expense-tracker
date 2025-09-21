"use client";

import { useState } from 'react';
import { useCategories } from '@/hooks/useApi';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Edit, X } from 'lucide-react';

export default function CategoriesPage() {
  const { categories: expenseCategories, loading: categoriesLoading, createCategory: createExpenseCategory, updateCategory: updateExpenseCategory, deleteCategory: deleteExpenseCategory } = useCategories('EXPENSE');
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    color: '#3B82F6',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editData, setEditData] = useState({
    name: '',
    color: '#3B82F6',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    setIsSubmitting(true);
    try {
      await createExpenseCategory({
        name: formData.name,
        type: 'EXPENSE',
        color: formData.color,
      });
      
      // Reset form
      setFormData({
        name: '',
        color: '#3B82F6',
      });
      
      toast({
        title: "Category Added!",
        description: `Successfully added "${formData.name}" category.`,
      });
    } catch (err) {
      console.error('Error creating category:', err);
      toast({
        title: "Error",
        description: "Failed to add category. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setEditData({
      name: category.name,
      color: category.color,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingCategory) return;
    
    try {
      await updateExpenseCategory(editingCategory.id, {
        name: editData.name,
        color: editData.color,
      });
      
      toast({
        title: "Category Updated!",
        description: `Successfully updated "${editData.name}" category`,
        variant: "success",
      });
      
      setIsEditModalOpen(false);
      setEditingCategory(null);
      setEditData({ name: '', color: '#3B82F6' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update category. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditingCategory(null);
    setEditData({ name: '', color: '#3B82F6' });
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteExpenseCategory(id);
      } catch (err) {
        console.error('Error deleting category:', err);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Categories</h1>
        <p className="text-muted-foreground mt-2">Manage your expense categories</p>
      </div>
      
      <div className="grid gap-6">
        {/* Add New Category */}
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category-name">Category Name</Label>
                <Input 
                  id="category-name"
                  type="text" 
                  placeholder="e.g., Travel" 
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category-color">Color</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full border border-gray-300" 
                          style={{ backgroundColor: formData.color }}
                        />
                        <span className="text-sm">{formData.color}</span>
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3">
                    <div className="space-y-2">
                      <Label htmlFor="color-picker">Choose Color</Label>
                      <Input 
                        id="color-picker"
                        type="color" 
                        value={formData.color}
                        onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                        className="h-10 w-full cursor-pointer"
                      />
                      <div className="grid grid-cols-6 gap-2 mt-2">
                        {[
                          '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
                          '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16',
                          '#F97316', '#6366F1', '#14B8A6', '#F43F5E'
                        ].map((color) => (
                          <button
                            key={color}
                            type="button"
                            className="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-gray-400 focus:border-primary focus:outline-none"
                            style={{ backgroundColor: color }}
                            onClick={() => setFormData(prev => ({ ...prev, color }))}
                          />
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <Button 
              type="submit"
              disabled={isSubmitting || !formData.name}
              className="mt-4"
            >
              {isSubmitting ? 'Adding...' : 'Add Category'}
            </Button>
          </form>
        </div>

        {/* Expense Categories Table */}
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Expense Categories</h2>
          {expenseCategories.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground mb-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Categories Yet</h3>
              <p className="text-gray-500">Add your first expense category above to start organizing your expenses.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-6 py-4">Category Name</TableHead>
                    <TableHead className="px-6 py-4">Color</TableHead>
                    <TableHead className="px-6 py-4">Type</TableHead>
                    <TableHead className="px-6 py-4">Created</TableHead>
                    <TableHead className="px-6 py-4 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoriesLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                        Loading categories...
                      </TableCell>
                    </TableRow>
                  ) : expenseCategories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                        No categories found. Create your first category above.
                      </TableCell>
                    </TableRow>
                  ) : (
                    expenseCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="px-6 py-4 font-medium">{category.name}</TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full border" 
                            style={{ backgroundColor: category.color || '#3B82F6' }}
                          />
                          <span className="text-sm text-muted-foreground">{category.color}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Expense
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-muted-foreground">
                        {new Date(category.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex gap-1 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Edit Category Modal */}
        {isEditModalOpen && editingCategory && (
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
                  <h2 className="text-lg font-semibold">Edit Category</h2>
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
                      <Label htmlFor="edit-category-name">Category Name</Label>
                      <Input 
                        id="edit-category-name"
                        type="text" 
                        placeholder="e.g., Food, Transport" 
                        value={editData.name}
                        onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-category-color">Color</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start"
                          >
                            <div 
                              className="w-4 h-4 rounded-full mr-2" 
                              style={{ backgroundColor: editData.color }}
                            />
                            <span className="text-sm">{editData.color}</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-3">
                          <div className="space-y-2">
                            <Label htmlFor="edit-color-picker">Choose Color</Label>
                            <Input 
                              id="edit-color-picker"
                              type="color" 
                              value={editData.color}
                              onChange={(e) => setEditData(prev => ({ ...prev, color: e.target.value }))}
                              className="h-10 w-full cursor-pointer"
                            />
                            <div className="grid grid-cols-6 gap-2 mt-2">
                              {[
                                '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
                                '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16',
                                '#F97316', '#6366F1', '#14B8A6', '#F43F5E'
                              ].map((color) => (
                                <button
                                  key={color}
                                  type="button"
                                  className="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-gray-400 focus:border-primary focus:outline-none"
                                  style={{ backgroundColor: color }}
                                  onClick={() => setEditData(prev => ({ ...prev, color }))}
                                />
                              ))}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
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
                      disabled={!editData.name}
                    >
                      Save Changes
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
