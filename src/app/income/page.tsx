"use client";

import { useState } from 'react';
import { useIncomes, useSources } from '@/hooks/useApi';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { X, Edit, Trash2 } from 'lucide-react';

export default function IncomePage() {
  const { incomes, loading, createIncome, updateIncome, deleteIncome, error } = useIncomes();
  const { sources, createSource } = useSources();
  const { toast } = useToast();
  const { formatCurrency } = useCurrency();
  
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    sourceId: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<any>(null);
  const [editData, setEditData] = useState({
    amount: '',
    description: '',
    sourceId: '',
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [isAddSourceModalOpen, setIsAddSourceModalOpen] = useState(false);
  const [newSourceData, setNewSourceData] = useState({
    name: '',
    color: '#3B82F6',
  });
  const [isCreatingSource, setIsCreatingSource] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount) return;

    setIsSubmitting(true);
    try {
      await createIncome({
        amount: parseFloat(formData.amount),
        description: formData.description || undefined,
        sourceId: formData.sourceId || undefined,
      });
      
      // Reset form
      setFormData({
        amount: '',
        description: '',
        sourceId: '',
      });
      
      toast({
        title: "Income Added!",
        description: `Successfully added ${formatCurrency(parseFloat(formData.amount))} income.`,
      });
    } catch (err) {
      console.error('Error creating income:', err);
      toast({
        title: "Error",
        description: "Failed to add income. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (income: any) => {
    setEditingIncome(income);
    setEditData({
      amount: income.amount.toString(),
      description: income.description || '',
      sourceId: income.sourceId || '',
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingIncome) return;
    
    try {
      await updateIncome(editingIncome.id, {
        amount: parseFloat(editData.amount),
        description: editData.description || undefined,
        sourceId: editData.sourceId || undefined,
      });
      
      toast({
        title: "Income Updated!",
        description: `Successfully updated income`,
        variant: "success",
      });
      
      setIsEditModalOpen(false);
      setEditingIncome(null);
      setEditData({ amount: '', description: '', sourceId: '' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update income. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditingIncome(null);
    setEditData({ amount: '', description: '', sourceId: '' });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this income?')) {
      try {
        await deleteIncome(id);
        toast({
          title: "Income Deleted!",
          description: "Successfully deleted income",
          variant: "success",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete income. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleCreateSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceData.name) return;

    setIsCreatingSource(true);
    try {
      const newSource = await createSource({
        name: newSourceData.name,
        color: newSourceData.color,
      });
      
      // Set the new source as selected
      setFormData(prev => ({ ...prev, sourceId: newSource.id }));
      
      // Reset new source form
      setNewSourceData({
        name: '',
        color: '#3B82F6',
      });
      setIsAddSourceModalOpen(false);
      
      toast({
        title: "Source Added!",
        description: `Successfully added "${newSource.name}" source.`,
      });
    } catch (err) {
      console.error('Error creating source:', err);
      toast({
        title: "Error",
        description: "Failed to add source. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingSource(false);
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
  const totalPages = Math.ceil(incomes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentIncomes = incomes.slice(startIndex, endIndex);

  // Calculate totals
  const totalThisMonth = incomes.reduce((sum, income) => sum + income.amount, 0);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Income</h1>
        <p className="text-muted-foreground mt-2">Track and manage your income sources</p>
      </div>
      
      <div className="grid gap-6">
        {/* Quick Add Income */}
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Add Income</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="income-amount">Amount</Label>
                    <Input 
                      id="income-amount"
                      type="number" 
                      step="0.01"
                      placeholder="0.00" 
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="income-source">Source</Label>
                    <Select 
                      value={formData.sourceId}
                      onValueChange={(value) => {
                        if (value === 'add-new') {
                          setIsAddSourceModalOpen(true);
                        } else {
                          setFormData(prev => ({ ...prev, sourceId: value }));
                        }
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Source" />
                      </SelectTrigger>
                      <SelectContent>
                        {sources.map((source) => (
                          <SelectItem key={source.id} value={source.id}>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: source.color }}
                              />
                              {source.name}
                            </div>
                          </SelectItem>
                        ))}
                        <SelectItem value="add-new" className="text-blue-600 font-medium">
                          + Add New Source
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="income-description">Description</Label>
                    <Input 
                      id="income-description"
                      type="text" 
                      placeholder="Income details" 
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                </div>
                <Button 
                  type="submit"
                  disabled={isSubmitting || !formData.amount || !formData.sourceId}
                  className="mt-4"
                >
                  {isSubmitting ? 'Adding...' : 'Add Income'}
                </Button>
              </form>
          {error && (
            <p className="mt-2 text-sm text-red-600">Error: {error}</p>
          )}
        </div>

        {/* Add New Source Modal */}
        {isAddSourceModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 backdrop-blur-sm bg-black/20" 
              onClick={() => setIsAddSourceModalOpen(false)}
            />
            {/* Modal Content */}
            <div className="relative bg-background border rounded-lg shadow-lg w-full max-w-md mx-4">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Add New Source</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAddSourceModalOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <form onSubmit={handleCreateSource}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="source-name">Source Name</Label>
                      <Input 
                        id="source-name"
                        type="text" 
                        placeholder="e.g., Salary, Freelance" 
                        value={newSourceData.name}
                        onChange={(e) => setNewSourceData(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="source-color">Color</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start"
                          >
                            <div 
                              className="w-4 h-4 rounded-full mr-2" 
                              style={{ backgroundColor: newSourceData.color }}
                            />
                            {newSourceData.color}
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
                                onClick={() => setNewSourceData(prev => ({ ...prev, color }))}
                              />
                            ))}
                          </div>
                          <div className="mt-4">
                            <Label htmlFor="custom-color">Custom Color</Label>
                            <Input
                              id="custom-color"
                              type="color"
                              value={newSourceData.color}
                              onChange={(e) => setNewSourceData(prev => ({ ...prev, color: e.target.value }))}
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
                        setIsAddSourceModalOpen(false);
                        setNewSourceData({ name: '', color: '#3B82F6' });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={isCreatingSource || !newSourceData.name}
                    >
                      {isCreatingSource ? 'Adding...' : 'Add Source'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Income Modal */}
        {isEditModalOpen && editingIncome && (
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
                  <h2 className="text-lg font-semibold">Edit Income</h2>
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
                      <Label htmlFor="edit-income-amount">Amount</Label>
                      <Input 
                        id="edit-income-amount"
                        type="number" 
                        step="0.01"
                        placeholder="0.00" 
                        value={editData.amount}
                        onChange={(e) => setEditData(prev => ({ ...prev, amount: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-income-source">Source</Label>
                      <Select 
                        value={editData.sourceId}
                        onValueChange={(value) => {
                          if (value === 'add-new') {
                            setIsAddSourceModalOpen(true);
                          } else {
                            setEditData(prev => ({ ...prev, sourceId: value }));
                          }
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Source" />
                        </SelectTrigger>
                        <SelectContent>
                          {sources.map((source) => (
                            <SelectItem key={source.id} value={source.id}>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: source.color }}
                                />
                                {source.name}
                              </div>
                            </SelectItem>
                          ))}
                          <SelectItem value="add-new" className="text-blue-600 font-medium">
                            + Add New Source
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-income-description">Description</Label>
                      <Input 
                        id="edit-income-description"
                        type="text" 
                        placeholder="What was this income for?" 
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
                      disabled={!editData.amount}
                    >
                      Save Changes
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Income Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border rounded-lg p-4">
            <h3 className="font-semibold text-green-600">This Month</h3>
            <p className="text-2xl font-bold">{formatCurrency(totalThisMonth)}</p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <h3 className="font-semibold text-green-600">Total Entries</h3>
            <p className="text-2xl font-bold">{incomes.length}</p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <h3 className="font-semibold text-green-600">Average</h3>
            <p className="text-2xl font-bold">
              {incomes.length > 0 ? formatCurrency(totalThisMonth / incomes.length) : formatCurrency(0)}
            </p>
          </div>
        </div>

        {/* All Income Table */}
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">All Income</h2>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading incomes...</p>
            </div>
          ) : incomes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No income entries yet. Add your first income above!</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="px-6 py-4 w-16">S.No</TableHead>
                      <TableHead className="px-6 py-4">Description</TableHead>
                      <TableHead className="px-6 py-4">Source</TableHead>
                      <TableHead className="px-6 py-4">Amount</TableHead>
                      <TableHead className="px-6 py-4">Date</TableHead>
                      <TableHead className="px-6 py-4">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentIncomes.map((income, index) => (
                      <TableRow key={income.id}>
                        <TableCell className="px-6 py-4 text-center text-muted-foreground">
                          {startIndex + index + 1}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <span className="font-medium text-left block">{income.description || 'No description'}</span>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {income.source && (
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: income.source.color }}
                              />
                            )}
                            <span>{income.source ? income.source.name : 'No source'}</span>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <span className="font-semibold text-green-600">+{formatCurrency(income.amount)}</span>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <span className="text-sm text-muted-foreground">{formatDate(income.date)}</span>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex gap-1 justify-center">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(income)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(income.id)}
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
                    Showing {startIndex + 1} to {Math.min(endIndex, incomes.length)} of {incomes.length} incomes
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
