// src/pages/admin/categories/[action].tsx
import { useState, useEffect, useMemo } from 'react';
import { NextPageWithLayout } from '@/pages/_app';
import { ReactElement } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  ArrowLeft, 
  Save, 
  Trash, 
  Image as ImageIcon, 
  Loader 
} from 'lucide-react';
import { slugify } from '@/lib/utils';

// Category type
interface Category {
  id?: string;
  name: string;
  slug: string;
  description: string;
  coverImage?: string;
  order?: number;
  postCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

const CategoryForm: NextPageWithLayout = () => {
  const router = useRouter();
  const { action, id } = router.query;
  
  // State definitions
  const [category, setCategory] = useState<Category>({
    name: '',
    slug: '',
    description: '',
    coverImage: '',
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const isEditMode = useMemo(() => action === 'edit' && id, [action, id]);
  const pageTitle = isEditMode ? 'Edit Category' : 'New Category';
  
  // Fetch category data if in edit mode
  useEffect(() => {
    const fetchCategory = async () => {
      if (isEditMode) {
        try {
          setLoading(true);
          setError(null);
          
          const response = await fetch(`/api/blog/categories/${id}`);
          const data = await response.json();
          
          if (data.success) {
            setCategory(data.data);
          } else {
            setError('Category not found');
            router.push('/admin/categories');
          }
        } catch (err) {
          console.error('Error fetching category:', err);
          setError('Error loading category data');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    
    if (router.isReady) {
      fetchCategory();
    }
  }, [router, isEditMode, id]);
  
  // Generate slug from name
  useEffect(() => {
    if (!isEditMode && category.name) {
      setCategory((prev) => ({
        ...prev,
        slug: slugify(category.name),
      }));
    }
  }, [category.name, isEditMode]);
  
  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Handle cover image upload
  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'category-covers');
    
    try {
      setUploadProgress(1); // Upload started
      
      const response = await fetch('/api/blog/media/upload', {
        method: 'POST',
        body: formData,
      });
      
      setUploadProgress(100); // Upload completed
      
      const data = await response.json();
      
      if (data.success) {
        setCategory((prev) => ({
          ...prev,
          coverImage: data.data.url,
        }));
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Error uploading image');
    } finally {
      setUploadProgress(0);
    }
  };
  
  // Save category
  const handleSave = async () => {
    if (!category.name) {
      setError('Name is required');
      return;
    }
    
    setSaving(true);
    setError(null);
    
    try {
      const url = isEditMode ? `/api/blog/categories/${id}` : '/api/blog/categories';
      const method = isEditMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
      });
      
      const data = await response.json();
      
      if (data.success) {
        router.push('/admin/categories');
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error('Save error:', err);
      setError('Error saving category');
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full py-20">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>{pageTitle} - Tech Rehberi Admin</title>
      </Head>
      
      {/* Top Bar */}
      <header className="sticky top-0 z-10 px-6 py-3 bg-background/90 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/categories"
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-accent transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-semibold">{pageTitle}</h1>
          </div>
          
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors flex items-center gap-2"
          >
            {saving ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Category</span>
          </button>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Main Form */}
          <div className="md:col-span-2 space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={category.name}
                onChange={handleChange}
                placeholder="Category name"
                className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            {/* Slug Field */}
            <div className="space-y-2">
              <label htmlFor="slug" className="block text-sm font-medium">
                Slug (URL)
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 py-2 bg-muted rounded-l-md border border-r-0 border-input">
                  /blog/
                </span>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={category.slug}
                  onChange={handleChange}
                  placeholder="category-slug"
                  className="flex-1 px-3 py-2 bg-background border border-input rounded-r-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Description Field */}
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={category.description}
                onChange={handleChange}
                rows={4}
                placeholder="Category description"
                className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              ></textarea>
            </div>
          </div>
          
          {/* Right Column - Cover Image */}
          <div className="space-y-6">
            <div className="bg-card border rounded-lg p-4 space-y-4">
              <h3 className="font-medium">Cover Image</h3>
              
              {category.coverImage ? (
                <div className="relative aspect-video rounded-md overflow-hidden border border-border">
                  <Image
                    src={category.coverImage}
                    alt="Cover image"
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => setCategory((prev) => ({ ...prev, coverImage: '' }))}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                    title="Remove image"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-muted rounded-md p-8 text-center">
                  <ImageIcon className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload a cover image for this category
                  </p>
                  
                  <label className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90 transition-colors">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleCoverImageUpload}
                    />
                    <span>Select Image</span>
                  </label>
                  
                  {uploadProgress > 0 && (
                    <div className="mt-4">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <p className="text-xs text-muted-foreground">
                Recommended size: 1200x600 pixels. Maximum file size: 2MB.
              </p>
            </div>
            
            {isEditMode && (
              <div className="bg-card border rounded-lg p-4 space-y-4">
                <h3 className="font-medium">Category Info</h3>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Post Count</p>
                    <p className="font-medium">{category.postCount || 0}</p>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground">Order</p>
                    <p className="font-medium">{category.order || '-'}</p>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground">Created</p>
                    <p className="font-medium">
                      {category.createdAt
                        ? new Date(category.createdAt).toLocaleDateString()
                        : '-'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground">Updated</p>
                    <p className="font-medium">
                      {category.updatedAt
                        ? new Date(category.updatedAt).toLocaleDateString()
                        : '-'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// Apply layout
CategoryForm.getLayout = function getLayout(page: ReactElement): ReactElement {
  return <AdminLayout>{page}</AdminLayout>;
};

export default CategoryForm;