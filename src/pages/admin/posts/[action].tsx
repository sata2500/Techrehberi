// src/pages/admin/posts/[action].tsx
import { useState, useEffect, useMemo } from 'react';
import { NextPageWithLayout } from '@/pages/_app';
import { ReactElement } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAuth } from '@/contexts/auth-context';
import { BlogPostEditor } from '@/components/admin/BlogPostEditor'; // Bu bileşeni sonra oluşturacağız
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Trash, 
  Image as ImageIcon, 
  Loader
} from 'lucide-react';
import { slugify } from '@/lib/utils';

// Blog yazısı için tip
interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  author: {
    id: string;
    name: string;
    image?: string;
  };
  categories: string[];
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  publishedAt: string | null;
  createdAt?: string;
  updatedAt?: string;
  metadata: {
    seo: {
      title: string;
      description: string;
      keywords: string[];
    };
    ogImage?: string;
  };
}

// Kategori tipi
interface Category {
  id: string;
  name: string;
}

const BlogPostForm: NextPageWithLayout = () => {
  const router = useRouter();
  const { action, id } = router.query;
  const { user } = useAuth();
  
  // State tanımlamaları
  const [post, setPost] = useState<BlogPost>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    coverImage: '',
    author: {
      id: '',
      name: '',
    },
    categories: [],
    tags: [],
    status: 'draft',
    featured: false,
    publishedAt: null,
    metadata: {
      seo: {
        title: '',
        description: '',
        keywords: [],
      },
    },
  });
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const isEditMode = useMemo(() => action === 'edit' && id, [action, id]);
  const pageTitle = isEditMode ? 'Blog Yazısı Düzenle' : 'Yeni Blog Yazısı';
  
  // Veri yükleme
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Kategorileri getir
        const categoriesResponse = await fetch('/api/blog/categories');
        const categoriesData = await categoriesResponse.json();
        
        if (categoriesData.success) {
          setCategories(categoriesData.data);
        }
        
        // Düzenleme modunda ise yazıyı getir
        if (isEditMode) {
          const postResponse = await fetch(`/api/blog/posts/${id}`);
          const postData = await postResponse.json();
          
          if (postData.success) {
            setPost(postData.data);
          } else {
            setError('Yazı bulunamadı');
            router.push('/admin/posts');
          }
        } else {
          // Yeni yazı oluşturma modu ise, author bilgilerini ayarla
          if (user) {
            setPost((prevPost) => ({
              ...prevPost,
              author: {
                id: user.uid,
                name: user.displayName || 'Admin',
                image: user.photoURL || undefined,
              },
            }));
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Veri yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchData();
    }
  }, [router, isEditMode, id, user]);
  
  // Başlık değiştiğinde otomatik slug oluştur
  useEffect(() => {
    if (!isEditMode && post.title) {
      setPost((prevPost) => ({
        ...prevPost,
        slug: slugify(post.title),
      }));
    }
  }, [post.title, isEditMode]);
  
  // Form değişikliklerini işleme
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setPost((prevPost) => ({
      ...prevPost,
      [name]: value,
    }));
  };
  
  // SEO meta veri değişikliklerini işleme
  const handleSeoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setPost((prevPost) => ({
      ...prevPost,
      metadata: {
        ...prevPost.metadata,
        seo: {
          ...prevPost.metadata.seo,
          [name]: value,
        },
      },
    }));
  };
  
  // Anahtar kelime değişikliklerini işleme
  const handleKeywordsChange = (keywords: string[]) => {
    setPost((prevPost) => ({
      ...prevPost,
      metadata: {
        ...prevPost.metadata,
        seo: {
          ...prevPost.metadata.seo,
          keywords,
        },
      },
    }));
  };
  
  // Kategori değişikliklerini işleme
  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    
    setPost((prevPost) => ({
      ...prevPost,
      categories: checked
        ? [...prevPost.categories, value]
        : prevPost.categories.filter((category) => category !== value),
    }));
  };
  
  // Etiket değişikliklerini işleme
  const handleTagsChange = (tags: string[]) => {
    setPost((prevPost) => ({
      ...prevPost,
      tags,
    }));
  };
  
  // İçerik değişikliklerini işleme
  const handleContentChange = (content: string) => {
    setPost((prevPost) => ({
      ...prevPost,
      content,
    }));
  };
  
  // Kapak görseli yükleme
  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'blog-covers');
    
    try {
      setUploadProgress(1); // Yükleme başladı
      
      const response = await fetch('/api/blog/media/upload', {
        method: 'POST',
        body: formData,
      });
      
      setUploadProgress(100); // Yükleme tamamlandı
      
      const data = await response.json();
      
      if (data.success) {
        setPost((prevPost) => ({
          ...prevPost,
          coverImage: data.data.url,
        }));
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Görsel yüklenirken bir hata oluştu');
    } finally {
      setUploadProgress(0);
    }
  };
  
  // Formu kaydetme
  const handleSave = async (status: 'draft' | 'published' = 'draft') => {
    if (!post.title) {
      setError('Başlık alanı zorunludur');
      return;
    }
    
    setSaving(true);
    setError(null);
    
    try {
      const savePost = {
        ...post,
        status,
        publishedAt: status === 'published' ? new Date().toISOString() : post.publishedAt,
      };
      
      const url = isEditMode ? `/api/blog/posts/${id}` : '/api/blog/posts';
      const method = isEditMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(savePost),
      });
      
      const data = await response.json();
      
      if (data.success) {
        router.push('/admin/posts');
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error('Save error:', err);
      setError('Yazı kaydedilirken bir hata oluştu');
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
      
      {/* Üst Bar */}
      <header className="sticky top-0 z-10 px-6 py-3 bg-background/90 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/posts"
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-accent transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-semibold">{pageTitle}</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSave('draft')}
              disabled={saving}
              className="px-4 py-2 bg-accent hover:bg-accent/80 rounded-md transition-colors flex items-center gap-2"
            >
              {saving && post.status === 'draft' ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Taslak Kaydet</span>
            </button>
            
            <button
              onClick={() => handleSave('published')}
              disabled={saving}
              className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors flex items-center gap-2"
            >
              {saving && post.status === 'published' ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              <span>Yayınla</span>
            </button>
          </div>
        </div>
      </header>
      
      {/* Ana İçerik */}
      <div className="p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sol Kolon - Ana Form */}
          <div className="md:col-span-2 space-y-6">
            {/* Başlık ve Slug */}
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium">
                Başlık
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={post.title}
                onChange={handleChange}
                placeholder="Blog yazısı başlığı"
                className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
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
                  value={post.slug}
                  onChange={handleChange}
                  placeholder="blog-yazisi-url"
                  className="flex-1 px-3 py-2 bg-background border border-input rounded-r-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Kapak Görseli */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Kapak Görseli</label>
              {post.coverImage ? (
                <div className="relative aspect-video rounded-md overflow-hidden border border-border">
                  <Image
                    src={post.coverImage}
                    alt="Kapak görseli"
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => setPost((prev) => ({ ...prev, coverImage: '' }))}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                    title="Görseli kaldır"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-muted rounded-md p-8 text-center">
                  <ImageIcon className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Kapak görseli yükleyin veya sürükleyip bırakın
                  </p>
                  
                  <label className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90 transition-colors">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleCoverImageUpload}
                    />
                    <span>Görsel Seç</span>
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
            </div>
            
            {/* İçerik Editörü */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">İçerik</label>
              <BlogPostEditor
                content={post.content}
                onChange={handleContentChange}
              />
            </div>
            
            {/* Özet */}
            <div className="space-y-2">
              <label htmlFor="excerpt" className="block text-sm font-medium">
                Özet
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={post.excerpt}
                onChange={handleChange}
                rows={3}
                placeholder="Blog yazısı için kısa bir özet"
                className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              ></textarea>
              <p className="text-xs text-muted-foreground">
                Bu özet, blog listelerinde ve sosyal medya paylaşımlarında görünecektir. Boş bırakırsanız içerikten otomatik oluşturulur.
              </p>
            </div>
          </div>
          
          {/* Sağ Kolon - Yan Panel */}
          <div className="space-y-6">
            {/* Yayın Ayarları */}
            <div className="bg-card border rounded-lg p-4 space-y-4">
              <h3 className="font-medium">Yayın Ayarları</h3>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={post.featured}
                  onChange={(e) => setPost((prev) => ({ ...prev, featured: e.target.checked }))}
                  className="w-4 h-4 text-primary bg-background border-input rounded focus:ring-primary"
                />
                <label htmlFor="featured" className="ml-2 text-sm">
                  Öne Çıkan Yazı
                </label>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="status" className="block text-sm font-medium">
                  Durum
                </label>
                <select
                  id="status"
                  name="status"
                  value={post.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="draft">Taslak</option>
                  <option value="published">Yayında</option>
                </select>
              </div>
            </div>
            
            {/* Kategoriler */}
            <div className="bg-card border rounded-lg p-4 space-y-4">
              <h3 className="font-medium">Kategoriler</h3>
              
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {categories.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Henüz kategori yok.</p>
                ) : (
                  categories.map((category) => (
                    <div key={category.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`category-${category.id}`}
                        value={category.id}
                        checked={post.categories.includes(category.id)}
                        onChange={handleCategoryChange}
                        className="w-4 h-4 text-primary bg-background border-input rounded focus:ring-primary"
                      />
                      <label htmlFor={`category-${category.id}`} className="ml-2 text-sm">
                        {category.name}
                      </label>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {/* Etiketler */}
            <div className="bg-card border rounded-lg p-4 space-y-4">
              <h3 className="font-medium">Etiketler</h3>
              
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Etiket ekle ve Enter'a bas"
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.currentTarget;
                      const value = input.value.trim();
                      
                      if (value && !post.tags.includes(value)) {
                        handleTagsChange([...post.tags, value]);
                        input.value = '';
                      }
                    }
                  }}
                />
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {post.tags.map((tag, index) => (
                    <div key={index} className="flex items-center gap-1 bg-accent/50 px-2 py-1 rounded-full text-sm">
                      <span>{tag}</span>
                      <button
                        onClick={() => handleTagsChange(post.tags.filter((_, i) => i !== index))}
                        className="text-red-500 hover:text-red-700"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* SEO Ayarları */}
            <div className="bg-card border rounded-lg p-4 space-y-4">
              <h3 className="font-medium">SEO Ayarları</h3>
              
              <div className="space-y-2">
                <label htmlFor="seo-title" className="block text-sm font-medium">
                  SEO Başlığı
                </label>
                <input
                  type="text"
                  id="seo-title"
                  name="title"
                  value={post.metadata.seo.title}
                  onChange={handleSeoChange}
                  placeholder="SEO için başlık (boş ise ana başlık kullanılır)"
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="seo-description" className="block text-sm font-medium">
                  Meta Açıklama
                </label>
                <textarea
                  id="seo-description"
                  name="description"
                  value={post.metadata.seo.description}
                  onChange={handleSeoChange}
                  rows={2}
                  placeholder="SEO için açıklama (boş ise özet kullanılır)"
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                ></textarea>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium">Anahtar Kelimeler</label>
                <input
                  type="text"
                  placeholder="Anahtar kelime ekle ve Enter'a bas"
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.currentTarget;
                      const value = input.value.trim();
                      
                      if (value && !post.metadata.seo.keywords.includes(value)) {
                        handleKeywordsChange([...post.metadata.seo.keywords, value]);
                        input.value = '';
                      }
                    }
                  }}
                />
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {post.metadata.seo.keywords.map((keyword, index) => (
                    <div key={index} className="flex items-center gap-1 bg-accent/50 px-2 py-1 rounded-full text-sm">
                      <span>{keyword}</span>
                      <button
                        onClick={() => handleKeywordsChange(post.metadata.seo.keywords.filter((_, i) => i !== index))}
                        className="text-red-500 hover:text-red-700"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Layout'u uygula
BlogPostForm.getLayout = function getLayout(page: ReactElement): ReactElement {
  return <AdminLayout>{page}</AdminLayout>;
};

export default BlogPostForm;