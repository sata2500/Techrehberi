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
  Loader,
  AlertCircle,
  X,
  Upload,
  CheckCircle
} from 'lucide-react';
import { slugify } from '@/lib/utils';
import MediaLibrary from '@/components/admin/MediaLibrary';

// Category type
interface Category {
  id?: string;
  name: string;
  slug: string;
  description: string;
  coverImage?: string;
  parentId?: string;
  order?: number;
  postCount?: number;
  createdAt?: string;
  updatedAt?: string;
  color?: string;
  icon?: string;
}

interface MediaItem {
  id: string;
  url: string;
  name: string;
  type: string;
  size: number;
  createdAt: string;
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
    color: '#3b82f6', // Default primary color
    parentId: '',
  });
  
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  
  const isEditMode = useMemo(() => action === 'edit' && id, [action, id]);
  const pageTitle = isEditMode ? 'Kategori Düzenle' : 'Yeni Kategori';
  
  // Fetch category data if in edit mode
  useEffect(() => {
    const fetchCategory = async () => {
      if (isEditMode) {
        try {
          setLoading(true);
          setError(null);
          
          // Gerçek uygulamada API'den kategori verisini çekin
          // const response = await fetch(`/api/blog/categories/${id}`);
          // const data = await response.json();
          
          // Örnek veri
          await new Promise(resolve => setTimeout(resolve, 800));
          
          const mockCategory: Category = {
            id: id as string,
            name: 'Yazılım Geliştirme',
            slug: 'yazilim-gelistirme',
            description: 'Yazılım geliştirme, programlama dilleri ve kodlama hakkında içerikler.',
            coverImage: '/assets/images/categories/software.jpg',
            color: '#10b981',
            parentId: '',
            order: 1,
            postCount: 12,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          setCategory(mockCategory);
        } catch (err) {
          console.error('Error fetching category:', err);
          setError('Kategori verileri yüklenirken bir hata oluştu');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    
    // Üst kategorileri getir
    const fetchParentCategories = async () => {
      try {
        // Gerçek uygulamada API'den kategorileri çekin
        // const response = await fetch('/api/blog/categories?type=parents');
        // const data = await response.json();
        
        // Örnek veriler
        await new Promise(resolve => setTimeout(resolve, 600));
        
        const mockParentCategories: Category[] = [
          { id: 'cat1', name: 'Teknoloji', slug: 'teknoloji', description: 'Teknoloji içerikleri' },
          { id: 'cat2', name: 'Yazılım', slug: 'yazilim', description: 'Yazılım içerikleri' },
          { id: 'cat3', name: 'Kariyer', slug: 'kariyer', description: 'Kariyer içerikleri' },
        ];
        
        setParentCategories(mockParentCategories);
      } catch (err) {
        console.error('Error fetching parent categories:', err);
      }
    };
    
    if (router.isReady) {
      fetchCategory();
      fetchParentCategories();
    }
  }, [router.isReady, isEditMode, id]);
  
  // Generate slug from name
  useEffect(() => {
    if (!isEditMode && category.name && !category.slug) {
      setCategory((prev) => ({
        ...prev,
        slug: slugify(category.name),
      }));
    }
  }, [category.name, isEditMode, category.slug]);
  
  // Form değişiklikleri işleyicisi
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    setCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Medya kütüphanesinden görsel seçme işleyicisi
  const handleMediaSelect = (media: MediaItem) => {
    setCategory(prev => ({
      ...prev,
      coverImage: media.url
    }));
    setShowMediaLibrary(false);
  };
  
  // Kapak görseli yükleme
  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'category-covers');
    
    try {
      setUploadProgress(1); // Yükleme başladı
      
      // Simüle edilmiş yükleme
      for (let i = 1; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 50));
        setUploadProgress(i);
      }
      
      // Gerçek uygulamada API'ye dosya yükleyeceksiniz
      // const response = await fetch('/api/blog/media/upload', {
      //   method: 'POST',
      //   body: formData,
      // });
      // const data = await response.json();
      
      // Simüle edilmiş yanıt
      const mockResponse = {
        success: true,
        data: {
          url: URL.createObjectURL(file)
        }
      };
      
      if (mockResponse.success) {
        setCategory((prev) => ({
          ...prev,
          coverImage: mockResponse.data.url,
        }));
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Görsel yüklenirken bir hata oluştu');
    } finally {
      setUploadProgress(0);
    }
  };
  
  // Form doğrulama
  const validateForm = (): boolean => {
    if (!category.name) {
      setError('Kategori adı zorunludur');
      return false;
    }
    
    if (!category.slug) {
      setError('Slug zorunludur');
      return false;
    }
    
    return true;
  };
  
  // Kategori kaydetme
  const handleSave = async () => {
    if (!validateForm()) return;
    
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Gerçek uygulamada kategoriyi kaydedin
      // const url = isEditMode ? `/api/blog/categories/${id}` : '/api/blog/categories';
      // const method = isEditMode ? 'PUT' : 'POST';
      
      // const response = await fetch(url, {
      //   method,
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(category),
      // });
      
      // const data = await response.json();
      
      // Simüle edilmiş kaydetme
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Başarı mesajı
      setSuccess(`Kategori başarıyla ${isEditMode ? 'güncellendi' : 'oluşturuldu'}`);
      
      // ID atama (yeni kategori için)
      if (!isEditMode) {
        setCategory(prev => ({
          ...prev,
          id: Date.now().toString()
        }));
      }
      
      // 2 saniye sonra kategoriler listesine dön
      setTimeout(() => {
        router.push('/admin/categories');
      }, 2000);
      
    } catch (err) {
      console.error('Save error:', err);
      setError('Kategori kaydedilirken bir hata oluştu');
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
            <span>Kategori Kaydet</span>
          </button>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="p-6">
        {/* Bildirimler */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <div className="flex-1">{error}</div>
            <button 
              onClick={() => setError(null)}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md dark:bg-green-900/20 dark:border-green-800 dark:text-green-400 flex items-start">
            <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <div className="flex-1">{success}</div>
            <button 
              onClick={() => setSuccess(null)}
              className="ml-2 text-green-500 hover:text-green-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Main Form */}
          <div className="md:col-span-2 space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">
                Kategori Adı
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={category.name}
                onChange={handleChange}
                placeholder="Kategori adı"
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
                  /blog/category/
                </span>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={category.slug}
                  onChange={handleChange}
                  placeholder="kategori-slug"
                  className="flex-1 px-3 py-2 bg-background border border-input rounded-r-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Cover Image */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Kapak Görseli</label>
              {category.coverImage ? (
                <div className="relative aspect-[16/9] rounded-md overflow-hidden border border-border">
                  <Image
                    src={category.coverImage}
                    alt="Kapak görseli"
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => setCategory((prev) => ({ ...prev, coverImage: '' }))}
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
                    Kapak görseli yükleyin veya medya kütüphanesinden seçin
                  </p>
                  
                  <div className="flex justify-center gap-4">
                    <label className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90 transition-colors">
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleCoverImageUpload}
                      />
                      <Upload className="w-4 h-4 mr-2" />
                      <span>Görsel Yükle</span>
                    </label>
                    
                    <button
                      onClick={() => setShowMediaLibrary(true)}
                      className="inline-flex items-center justify-center px-4 py-2 bg-accent hover:bg-accent/80 rounded-md transition-colors"
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      <span>Kütüphaneden Seç</span>
                    </button>
                  </div>
                  
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
            
            {/* Description Field */}
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium">
                Açıklama
              </label>
              <textarea
                id="description"
                name="description"
                value={category.description}
                onChange={handleChange}
                rows={4}
                placeholder="Kategori açıklaması"
                className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              ></textarea>
              <p className="text-xs text-muted-foreground">
                Bu açıklama, kategori sayfalarında ve kategori listelerinde görünecektir.
              </p>
            </div>
          </div>
          
          {/* Right Column - Settings */}
          <div className="space-y-6">
            {/* Parent Category */}
            <div className="bg-card border rounded-lg p-4 space-y-4">
              <h3 className="font-medium">Üst Kategori</h3>
              
              <div className="space-y-2">
                <label htmlFor="parentId" className="block text-sm font-medium">
                  Üst Kategori Seçin (Opsiyonel)
                </label>
                <select
                  id="parentId"
                  name="parentId"
                  value={category.parentId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Ana Kategori (Üst kategori yok)</option>
                  {parentCategories.map((parent) => (
                    <option key={parent.id} value={parent.id}>
                      {parent.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground">
                  Bu kategoriyi başka bir kategorinin alt kategorisi olarak ayarlar.
                </p>
              </div>
            </div>
            
            {/* Color Settings */}
            <div className="bg-card border rounded-lg p-4 space-y-4">
              <h3 className="font-medium">Renk Ayarları</h3>
              
              <div className="space-y-2">
                <label htmlFor="color" className="block text-sm font-medium">
                  Kategori Rengi
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    id="color"
                    name="color"
                    value={category.color}
                    onChange={handleChange}
                    className="h-9 w-12 border rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    name="color"
                    value={category.color}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Bu renk kategori kartlarında ve kategori sayfalarında kullanılacaktır.
                </p>
              </div>
            </div>
            
            {/* Display Order */}
            <div className="bg-card border rounded-lg p-4 space-y-4">
              <h3 className="font-medium">Görüntüleme Ayarları</h3>
              
              <div className="space-y-2">
                <label htmlFor="order" className="block text-sm font-medium">
                  Sıralama Düzeni
                </label>
                <input
                  type="number"
                  id="order"
                  name="order"
                  value={category.order || 0}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <p className="text-xs text-muted-foreground">
                  Kategori listelerinde görüntüleme sırası. Düşük değerler önce gösterilir.
                </p>
              </div>
            </div>
            
            {/* Category Info */}
            {isEditMode && category.postCount !== undefined && (
              <div className="bg-card border rounded-lg p-4 space-y-4">
                <h3 className="font-medium">Kategori Bilgileri</h3>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Yazı Sayısı</p>
                    <p className="font-medium">{category.postCount}</p>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground">Sıralama</p>
                    <p className="font-medium">{category.order || '-'}</p>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground">Oluşturulma</p>
                    <p className="font-medium">
                      {category.createdAt
                        ? new Date(category.createdAt).toLocaleDateString()
                        : '-'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground">Güncelleme</p>
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
      
      {/* Media Library Modal */}
      {showMediaLibrary && (
        <MediaLibrary
          isModal={true}
          onClose={() => setShowMediaLibrary(false)}
          onSelect={handleMediaSelect}
          allowedTypes={['image/*']}
        />
      )}
    </>
  );
};

// Apply layout
CategoryForm.getLayout = function getLayout(page: ReactElement): ReactElement {
  return <AdminLayout>{page}</AdminLayout>;
};

export default CategoryForm;