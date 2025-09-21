"use client";

import { useState } from 'react';
import { useSources } from '@/hooks/useApi';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Edit, X } from 'lucide-react';

export default function SourcesPage() {
  const { sources, loading, createSource, updateSource, deleteSource, error } = useSources();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    color: '#3B82F6',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<any>(null);
  const [editData, setEditData] = useState({
    name: '',
    color: '#3B82F6',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    setIsSubmitting(true);
    try {
      await createSource({
        name: formData.name,
        color: formData.color,
      });
      
      setFormData({
        name: '',
        color: '#3B82F6',
      });
      
      toast({
        title: "Source Added!",
        description: `Successfully added "${formData.name}" source.`,
      });
    } catch (err) {
      console.error('Error creating source:', err);
      toast({
        title: "Error",
        description: "Failed to add source. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (source: any) => {
    setEditingSource(source);
    setEditData({
      name: source.name,
      color: source.color,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingSource) return;
    
    try {
      await updateSource(editingSource.id, {
        name: editData.name,
        color: editData.color,
      });
      
      toast({
        title: "Source Updated!",
        description: `Successfully updated "${editData.name}" source`,
        variant: "success",
      });
      
      setIsEditModalOpen(false);
      setEditingSource(null);
      setEditData({ name: '', color: '#3B82F6' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update source. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditingSource(null);
    setEditData({ name: '', color: '#3B82F6' });
  };

  const handleDeleteSource = async (id: string) => {
    if (confirm('Are you sure you want to delete this source?')) {
      try {
        await deleteSource(id);
      } catch (err) {
        console.error('Error deleting source:', err);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Sources</h1>
        <p className="text-muted-foreground mt-2">Manage your income sources</p>
      </div>
      
      <div className="grid gap-6">
        {/* Add New Source */}
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Add New Source</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="source-name">Source Name</Label>
                <Input 
                  id="source-name"
                  type="text" 
                  placeholder="e.g., Company ABC" 
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="source-color">Color</Label>
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
              {isSubmitting ? 'Adding...' : 'Add Source'}
            </Button>
          </form>
          {error && (
            <p className="mt-2 text-sm text-red-600">Error: {error}</p>
          )}
        </div>

        {/* Sources Table */}
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Income Sources</h2>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading sources...</p>
            </div>
          ) : sources.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground mb-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Sources Yet</h3>
              <p className="text-gray-500">Add your first income source above to start tracking where your money comes from.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-6 py-4">Source Name</TableHead>
                    <TableHead className="px-6 py-4">Color</TableHead>
                    <TableHead className="px-6 py-4">Created</TableHead>
                    <TableHead className="px-6 py-4 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sources.map((source) => (
                    <TableRow key={source.id}>
                      <TableCell className="px-6 py-4 font-medium">{source.name}</TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full border" 
                            style={{ backgroundColor: source.color || '#3B82F6' }}
                          />
                          <span className="text-sm text-muted-foreground">{source.color}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-muted-foreground">
                        {new Date(source.createdAt).toLocaleDateString('en-GB', {
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
                            onClick={() => handleEdit(source)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteSource(source.id)}
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
          )}
        </div>

        {/* Edit Source Modal */}
        {isEditModalOpen && editingSource && (
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
                  <h2 className="text-lg font-semibold">Edit Source</h2>
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
                      <Label htmlFor="edit-source-name">Source Name</Label>
                      <Input 
                        id="edit-source-name"
                        type="text" 
                        placeholder="e.g., Salary, Freelance" 
                        value={editData.name}
                        onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-source-color">Color</Label>
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
