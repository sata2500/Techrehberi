// src/pages/admin/posts/index.tsx
import { useState, useEffect } from 'react';
import { NextPageWithLayout } from '@/pages/_app';
import { ReactElement } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Edit, 
  Trash, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  EyeOff, 
  ArrowUpDown,
  Check,
  X
} from 'lucide-react';

// Blog post tipi
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  author: {
    id: string;
    name: string;
    image?: string;
  };
  categories: string[];
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// Kategoriler için tip
interface Category {
  id: string;
  name: string;
}

const AdminPosts: NextPageWithLayout = () => {
  const router = useRouter();
  
  // State tanımlamaları
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isChangingStatus, setIsChangingStatus] = useState<string | null>(null);
  
  // API'den verileri getirme
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Gerçek uygulamada burası API'den veri çekecek
        // Şimdilik örnek veri kullanıyoruz
        
        // Blog yazılarını getir
        const postsResponse = await fetch('/api/blog/posts');
        const postsData = await postsResponse.json();
        
        if (postsData.success) {
          setPosts(postsData.data);
        }
        
        // Kategorileri getir
        const categoriesResponse = await fetch('/api/blog/categories');
        const categoriesData = await categoriesResponse.json();
        
        if (categoriesData.success) {
          setCategories(categoriesData.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Yazıyı silme işlemi
  const handleDelete = async (id: string) => {
    if (!confirm('Bu yazıyı silmek istediğinizden emin misiniz?')) {
      return;
    }
    
    setIsDeleting(id);
    
    try {
      const response = await fetch(`/api/blog/posts/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPosts(posts.filter((post) => post.id !== id));
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setIsDeleting(null);
    }
  };
  
  // Yazı durumunu değiştirme (yayınlama/taslak yapma)
  const togglePostStatus = async (id: string, currentStatus: 'draft' | 'published' | 'archived') => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    
    setIsChangingStatus(id);
    
    try {
      const post = posts.find((p) => p.id === id);
      
      if (!post) return;
      
      const response = await fetch(`/api/blog/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...post,
          status: newStatus,
          publishedAt: newStatus === 'published' ? new Date().toISOString() : null,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPosts(
          posts.map((post) =>
            post.id === id
              ? { 
                ...post, 
                status: newStatus, 
                publishedAt: newStatus === 'published' ? new Date().toISOString() : null 
              }
              : post
          )
        );
      }
    } catch (error) {
      console.error('Error updating post status:', error);
    } finally {
      setIsChangingStatus(null);
    }
  };
  
  // Filtrelenmiş ve sıralanmış yazılar
  const filteredAndSortedPosts = posts
    .filter((post) => {
      // Arama filtresi
      const matchesSearch = searchTerm === '' || 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Durum filtresi
      const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
      
      // Kategori filtresi
      const matchesCategory = categoryFilter === '' || post.categories.includes(categoryFilter);
      
      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      // Sıralama
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else {
        return a.title.localeCompare(b.title);
      }
    });
  
  // Tarih formatlamak için yardımcı fonksiyon
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  return (
    <>
      <Head>
        <title>Blog Yazıları - Tech Rehberi Admin</title>
      </Head>
      
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold">Blog Yazıları</h2>
          
          <Link
            href="/admin/posts/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Yazı Ekle</span>
          </Link>
        </div>
        
        {/* Filtreler ve Arama */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Yazı ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          </div>
          
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'published' | 'draft')}
              className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">Tüm Yazılar</option>
              <option value="published">Yayında</option>
              <option value="draft">Taslak</option>
            </select>
          </div>
          
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Tüm Kategoriler</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'title')}
              className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="newest">En Yeni</option>
              <option value="oldest">En Eski</option>
              <option value="title">Başlık (A-Z)</option>
            </select>
          </div>
        </div>
        
        {/* Yazı Tablosu */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>
        ) : filteredAndSortedPosts.length === 0 ? (
          <div className="bg-card border rounded-lg p-6 text-center">
            <p className="text-muted-foreground mb-4">Henüz blog yazısı bulunmuyor veya filtrelere uygun yazı yok.</p>
            <Link
              href="/admin/posts/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>İlk Yazınızı Ekleyin</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="px-4 py-3 text-left">Başlık</th>
                  <th className="px-4 py-3 text-left">Kategori</th>
                  <th className="px-4 py-3 text-left">Durum</th>
                  <th className="px-4 py-3 text-left">Tarih</th>
                  <th className="px-4 py-3 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedPosts.map((post) => (
                  <tr key={post.id} className="border-b hover:bg-accent/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src={post.coverImage || "https://via.placeholder.com/80"}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium truncate">{post.title}</p>
                          <p className="text-xs text-muted-foreground">{post.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {post.categories.map((categoryId) => {
                          const category = categories.find((c) => c.id === categoryId);
                          return (
                            <span 
                              key={categoryId} 
                              className="inline-block px-2 py-1 text-xs bg-accent rounded-md"
                            >
                              {category?.name || categoryId}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          post.status === 'published'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400'
                        }`}
                      >
                        {post.status === 'published' ? 'Yayında' : 'Taslak'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {post.status === 'published' 
                        ? formatDate(post.publishedAt)
                        : formatDate(post.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => togglePostStatus(post.id, post.status)}
                          disabled={isChangingStatus === post.id}
                          className={`p-2 rounded-md ${
                            post.status === 'published'
                              ? 'hover:bg-amber-100 text-amber-800 dark:hover:bg-amber-900/20 dark:text-amber-400'
                              : 'hover:bg-green-100 text-green-800 dark:hover:bg-green-900/20 dark:text-green-400'
                          }`}
                          title={post.status === 'published' ? 'Taslağa Çevir' : 'Yayınla'}
                        >
                          {isChangingStatus === post.id ? (
                            <div className="w-5 h-5 rounded-full border-2 border-current border-t-transparent animate-spin"></div>
                          ) : post.status === 'published' ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                        
                        <Link
                          href={`/admin/posts/edit/${post.id}`}
                          className="p-2 text-blue-700 hover:bg-blue-100 rounded-md dark:text-blue-400 dark:hover:bg-blue-900/20"
                          title="Düzenle"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        
                        <button
                          onClick={() => handleDelete(post.id)}
                          disabled={isDeleting === post.id}
                          className="p-2 text-red-700 hover:bg-red-100 rounded-md dark:text-red-400 dark:hover:bg-red-900/20"
                          title="Sil"
                        >
                          {isDeleting === post.id ? (
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

// Layout'u uygula
AdminPosts.getLayout = function getLayout(page: ReactElement): ReactElement {
  return <AdminLayout>{page}</AdminLayout>;
};

export default AdminPosts;