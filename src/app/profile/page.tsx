"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/hooks/useApi';
import { useCurrency } from '@/contexts/CurrencyContext';
import { User, Mail, Calendar, DollarSign, Save, Loader2, Camera, Upload, X, Edit } from 'lucide-react';

export default function ProfilePage() {
  const { toast } = useToast();
  const { formatCurrency } = useCurrency();
  const { profileData, loading, error, updateProfile, refetch } = useProfile();
  
  // Add error boundary for profile data
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Profile</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  
  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }
  
  // Show fallback if no profile data
  if (!profileData) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-gray-600 mb-4">Unable to load profile data</p>
          <Button onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: ''
  });

  // Update form data when profile data loads
  React.useEffect(() => {
    if (profileData) {
      setFormData({
        name: profileData.name || '',
        email: profileData.email || '',
        avatar: profileData.avatar || ''
      });
    }
  }, [profileData]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        name: formData.name,
        email: formData.email,
        avatar: formData.avatar,
      });
      
      setIsEditModalOpen(false);
      toast({
        title: "Profile Updated!",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    console.log('handleCancel called'); // Debug log
    setIsEditModalOpen(false);
    setPreviewImage(null);
    // Reset form data to original values
    if (profileData) {
      setFormData({
        name: profileData.name || '',
        email: profileData.email || '',
        avatar: profileData.avatar || ''
      });
    }
  };

  // Debug: Log when modal state changes
  useEffect(() => {
    console.log('Modal state changed:', isEditModalOpen);
  }, [isEditModalOpen]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      // Convert image to base64 for storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        setPreviewImage(base64String);
        setFormData(prev => ({ ...prev, avatar: base64String }));
        setIsUploading(false);
        
        toast({
          title: "Image uploaded!",
          description: "Your profile picture has been updated.",
          variant: "success",
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setIsUploading(false);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setFormData(prev => ({ ...prev, avatar: '' }));
  };

  const handleImageClick = () => {
    if (isEditModalOpen) {
      fileInputRef.current?.click();
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 mt-2 animate-pulse"></div>
        </div>

        <div className="grid gap-6">
          {/* Profile Overview Skeleton */}
          <Card>
            <CardHeader>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse"></div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                <div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mt-2 animate-pulse"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
            </CardContent>
          </Card>

          {/* Statistics Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12 mt-2 animate-pulse"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-red-600 mb-2">Error Loading Profile</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <h3 className="text-lg font-medium mb-2">No Profile Data</h3>
          <p className="text-muted-foreground">Unable to load profile information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground mt-2">Manage your account settings and preferences</p>
      </div>

      <div className="grid gap-6">
        {/* Profile Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Overview
            </CardTitle>
            <CardDescription>
              Your personal information and account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profileData.avatar} />
                <AvatarFallback className="text-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                  {profileData.name ? profileData.name.split(' ').map(n => n[0]).join('').toUpperCase() : '👤'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-foreground">{profileData.name || 'John Doe'}</h3>
                <p className="text-lg text-muted-foreground mt-1">{profileData.email || 'john.doe@example.com'}</p>
                <div className="mt-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300">
                    Active Account
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Profile Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                  <p className="text-lg font-semibold text-foreground mt-1">{profileData.name || 'John Doe'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Email Address</Label>
                  <p className="text-lg font-semibold text-foreground mt-1">{profileData.email || 'john.doe@example.com'}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Member Since</Label>
                  <p className="text-lg font-semibold text-foreground mt-1">{profileData.joinDate || 'January 2024'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Account Status</Label>
                  <p className="text-lg font-semibold text-green-600 dark:text-green-400 mt-1">Active</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button onClick={() => setIsEditModalOpen(true)} size="lg" className="px-6">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(profileData.statistics.totalExpenses)}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(profileData.statistics.totalIncomes)}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profileData.statistics.activeCategories}</div>
              <p className="text-xs text-muted-foreground">Active categories</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Sources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profileData.statistics.activeSources}</div>
              <p className="text-xs text-muted-foreground">Income sources</p>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Monthly Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(profileData.statistics.monthlyExpenses)}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Monthly Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(profileData.statistics.monthlyIncomes)}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Monthly Savings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${profileData.statistics.monthlySavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(profileData.statistics.monthlySavings)}
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
            <CardDescription>
              Manage your account settings and data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Add Sample Data</h4>
                <p className="text-sm text-muted-foreground">
                  Populate your account with sample expenses, income, and categories
                </p>
              </div>
              <Button 
                variant="outline"
                type="button"
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  try {
                    const response = await fetch('/api/seed', { method: 'POST' });
                    const result = await response.json();
                    if (response.ok) {
                      toast({
                        title: "Sample data added",
                        variant: "success",
                      });
                      // Refetch profile data to update statistics in real-time
                      await refetch();
                    } else {
                      throw new Error(result.error || 'Failed to add sample data');
                    }
                  } catch (error) {
                    toast({
                      title: "Error",
                      description: "Failed to add sample data. Please try again.",
                      variant: "destructive",
                    });
                  }
                }}
              >
                Add Sample Data
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Export Data</h4>
                <p className="text-sm text-muted-foreground">
                  Download your expense and income data
                </p>
              </div>
              <Button variant="outline">
                Export
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Delete Account</h4>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all data
                </p>
              </div>
              <Button variant="destructive">
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div 
          className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 animate-in fade-in duration-200"
          onClick={(e) => {
            console.log('Modal backdrop clicked');
            handleCancel();
          }}
        >
          <div 
            className="bg-background border rounded-lg shadow-lg w-full max-w-md mx-4 animate-in zoom-in-95 slide-in-from-bottom-2 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Edit Profile</h2>
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('X button clicked'); // Debug log
                      handleCancel();
                    }}
                    className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={previewImage || formData.avatar || profileData.avatar} />
                    <AvatarFallback className="text-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                      {profileData.name ? profileData.name.split(' ').map(n => n[0]).join('').toUpperCase() : '👤'}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Upload overlay */}
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                       onClick={handleImageClick}>
                    {isUploading ? (
                      <Loader2 className="h-6 w-6 text-white animate-spin" />
                    ) : (
                      <Camera className="h-6 w-6 text-white" />
                    )}
                  </div>
                  
                  {/* Remove button */}
                </div>
                
                <div className="text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleImageClick}
                    disabled={isUploading}
                    className="mb-2"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {isUploading ? 'Uploading...' : 'Change Photo'}
                  </Button>
                  <p className="text-xs text-muted-foreground">Click to upload or drag and drop</p>
                </div>
              </div>
              
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* Form Fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="modal-name">Full Name</Label>
                  <Input
                    id="modal-name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modal-email">Email Address</Label>
                  <Input
                    id="modal-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} disabled={isSaving} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleCancel();
                  }} 
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
