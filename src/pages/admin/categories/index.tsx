// src/pages/admin/categories/index.tsx
import { useState, useEffect } from 'react';
import { NextPageWithLayout } from '@/pages/_app';
import { ReactElement } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Edit, 
  Trash, 
  Plus, 
  Search, 
  MoveUp, 
  MoveDown,
  Loader
} from 'lucide-react';

// Category type
interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverImage?: string;
  order: number;
  postCount: number;
  createdAt: string;
  updatedAt: string;
}

const AdminCategories: NextPageWithLayout = () => {
  // State definitions
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isReordering, setIsReordering] = useState<string | null>(null);
  
  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        
        const response = await fetch('/api/blog/categories');
        const data = await response.json();
        
        if (data.success) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Delete category
  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) {
      return;
    }
    
    setIsDeleting(id);
    
    try {
      const response = await fetch(`/api/blog/categories/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setCategories(categories.filter((category) => category.id !== id));
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    } finally {
      setIsDeleting(null);
    }
  };
  
  // Reorder categories
  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    setIsReordering(id);
    
    try {
      const currentIndex = categories.findIndex((category) => category.id === id);
      
      if (
        (direction === 'up' && currentIndex === 0) ||
        (direction === 'down' && currentIndex === categories.length - 1)
      ) {
        return;
      }
      
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      const newCategories = [...categories];
      
      // Swap order values
      const currentOrder = newCategories[currentIndex].order;
      newCategories[currentIndex].order = newCategories[newIndex].order;
      newCategories[newIndex].order = currentOrder;
      
      // Swap positions in array
      [newCategories[currentIndex], newCategories[newIndex]] = [
        newCategories[newIndex],
        newCategories[currentIndex],
      ];
      
      // Update state
      setCategories(newCategories);
      
      // Update in database
      await fetch(`/api/blog/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          order: newCategories[newIndex].order,
        }),
      });
      
      // Update the other category in database
      await fetch(`/api/blog/categories/${newCategories[currentIndex].id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: newCategories[currentIndex].id,
          order: newCategories[currentIndex].order,
        }),
      });
    } catch (error) {
      console.error('Error reordering categories:', error);
    } finally {
      setIsReordering(null);
    }
  };
  
  // Filtered categories
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <>
      <Head>
        <title>Categories - Tech Rehberi Admin</title>
      </Head>
      
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold">Categories</h2>
          
          <Link
            href="/admin/categories/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Category</span>
          </Link>
        </div>
        
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          </div>
        </div>
        
        {/* Category List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="bg-card border rounded-lg p-6 text-center">
            <p className="text-muted-foreground mb-4">No categories found. Create your first category to get started.</p>
            <Link
              href="/admin/categories/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Category</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="px-4 py-3 text-left">Order</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-center">Posts</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category) => (
                  <tr key={category.id} className="border-b hover:bg-accent/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{category.order}</span>
                        <div className="flex flex-col">
                          <button
                            onClick={() => handleReorder(category.id, 'up')}
                            disabled={isReordering !== null || category.order === 1}
                            className="p-1 rounded-md hover:bg-accent disabled:opacity-30"
                          >
                            <MoveUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReorder(category.id, 'down')}
                            disabled={isReordering !== null || category.order === categories.length}
                            className="p-1 rounded-md hover:bg-accent disabled:opacity-30"
                          >
                            <MoveDown className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {category.coverImage && (
                          <div className="relative w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={category.coverImage}
                              alt={category.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{category.name}</p>
                          <p className="text-xs text-muted-foreground">{category.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-muted-foreground line-clamp-2">{category.description}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-accent rounded-full font-medium text-sm">
                        {category.postCount}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/categories/edit/${category.id}`}
                          className="p-2 text-blue-700 hover:bg-blue-100 rounded-md dark:text-blue-400 dark:hover:bg-blue-900/20"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          disabled={isDeleting === category.id}
                          className="p-2 text-red-700 hover:bg-red-100 rounded-md dark:text-red-400 dark:hover:bg-red-900/20"
                          title="Delete"
                        >
                          {isDeleting === category.id ? (
                            <div className="w-5 h-5 rounded-full border-2 border-current border-t-transparent animate-spin"></div>
                          ) : (
                            <Trash className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

// Apply layout
AdminCategories.getLayout = function getLayout(page: ReactElement): ReactElement {
  return <AdminLayout>{page}</AdminLayout>;
};

export default AdminCategories;