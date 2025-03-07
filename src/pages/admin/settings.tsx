// src/pages/admin/settings.tsx
import { useState, useEffect, useMemo } from 'react';
import { NextPageWithLayout } from '@/pages/_app';
import { ReactElement } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Image from 'next/image';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAuth } from '@/contexts/auth-context';
import { 
  Save, 
  Eye, 
  Trash, 
  Image as ImageIcon, 
  Loader,
  Upload // Upload ikonunu ekledik
} from 'lucide-react';

// Site ayarları tipi
interface SiteSettings {
  id?: string;
  siteName: string;
  siteDescription: string;
  siteLogo?: string;
  siteIcon?: string;
  contactEmail: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string[];
    ogImage?: string;
  };
  appearance: {
    primaryColor: string;
    accentColor: string;
    navbarStyle: 'light' | 'dark' | 'transparent';
    footerStyle: 'light' | 'dark';
  };
}

const AdminSettings: NextPageWithLayout = () => {
  const router = useRouter();
  const { user } = useAuth();
  
  // State tanımlamaları
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'Tech Rehberi',
    siteDescription: 'Dijital dünyada rehberiniz.',
    contactEmail: 'info@techrehberi.com',
    socialLinks: {},
    seo: {
      metaTitle: 'Tech Rehberi - Teknoloji Haberleri ve Dijital Dönüşüm',
      metaDescription: 'Güncel teknoloji haberleri, yazılım geliştirme ipuçları ve dijital dönüşüm rehberi.',
      metaKeywords: ['teknoloji', 'yazılım', 'dijital', 'blog'],
    },
    appearance: {
      primaryColor: '#3b82f6',
      accentColor: '#10b981',
      navbarStyle: 'light',
      footerStyle: 'dark',
    },
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  
  // Veri yükleme
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/admin/settings');
        const data = await response.json();
        
        if (data.success) {
          setSettings(data.data);
        }
      } catch (err) {
        console.error('Ayarlar getirilirken hata oluştu:', err);
        setError('Ayarlar yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);
  
  // Form değişikliklerini işle
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Nested properties için (örn: appearance.primaryColor)
    if (name.includes('.')) {
      const [section, key] = name.split('.');
      setSettings((prev) => ({
        ...prev,
        [section]: {
          ...prev[section as keyof SiteSettings] as Record<string, unknown>,
          [key]: value,
        },
      }));
    } else {
      setSettings((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  
  // Sosyal medya bağlantılarını işle
  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setSettings((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value,
      },
    }));
  };
  
  // Anahtar kelimeleri işle
  const handleKeywordsChange = (keywords: string[]) => {
    setSettings((prev) => ({
      ...prev,
      seo: {
        ...prev.seo,
        metaKeywords: keywords,
      },
    }));
  };
  
  // Logo yükleme
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'site-assets');
    
    try {
      setUploadProgress((prev) => ({ ...prev, logo: 1 }));
      
      const response = await fetch('/api/blog/media/upload', {
        method: 'POST',
        body: formData,
      });
      
      setUploadProgress((prev) => ({ ...prev, logo: 100 }));
      
      const data = await response.json();
      
      if (data.success) {
        setSettings((prev) => ({
          ...prev,
          siteLogo: data.data.url,
        }));
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error('Logo yükleme hatası:', err);
      setError('Logo yüklenirken bir hata oluştu.');
    } finally {
      setUploadProgress((prev) => ({ ...prev, logo: 0 }));
    }
  };
  
  // Favicon yükleme
  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'site-assets');
    
    try {
      setUploadProgress((prev) => ({ ...prev, favicon: 1 }));
      
      const response = await fetch('/api/blog/media/upload', {
        method: 'POST',
        body: formData,
      });
      
      setUploadProgress((prev) => ({ ...prev, favicon: 100 }));
      
      const data = await response.json();
      
      if (data.success) {
        setSettings((prev) => ({
          ...prev,
          siteIcon: data.data.url,
        }));
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error('Favicon yükleme hatası:', err);
      setError('Favicon yüklenirken bir hata oluştu.');
    } finally {
      setUploadProgress((prev) => ({ ...prev, favicon: 0 }));
    }
  };
  
  // OG Görsel yükleme
  const handleOgImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'site-assets');
    
    try {
      setUploadProgress((prev) => ({ ...prev, ogImage: 1 }));
      
      const response = await fetch('/api/blog/media/upload', {
        method: 'POST',
        body: formData,
      });
      
      setUploadProgress((prev) => ({ ...prev, ogImage: 100 }));
      
      const data = await response.json();
      
      if (data.success) {
        setSettings((prev) => ({
          ...prev,
          seo: {
            ...prev.seo,
            ogImage: data.data.url,
          },
        }));
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error('OG Görsel yükleme hatası:', err);
      setError('OG Görsel yüklenirken bir hata oluştu.');
    } finally {
      setUploadProgress((prev) => ({ ...prev, ogImage: 0 }));
    }
  };
  
  // Ayarları kaydet
  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess('Ayarlar başarıyla kaydedildi.');
        // Yeni ID'yi ekle
        if (data.data.id) {
          setSettings((prev) => ({
            ...prev,
            id: data.data.id,
          }));
        }
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error('Ayarlar kaydedilirken hata oluştu:', err);
      setError('Ayarlar kaydedilirken bir hata oluştu.');
    } finally {
      setSaving(false);
      
      // Başarı mesajını 3 saniye sonra temizle
      if (success) {
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      }
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
        <title>Site Ayarları - Tech Rehberi Admin</title>
      </Head>
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Site Ayarları</h2>
          
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors flex items-center gap-2"
          >
            {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Ayarları Kaydet</span>
          </button>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
            {success}
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sol Panel - Temel Ayarlar */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Temel Ayarlar</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="siteName" className="block text-sm font-medium mb-1">
                    Site Adı
                  </label>
                  <input
                    type="text"
                    id="siteName"
                    name="siteName"
                    value={settings.siteName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="siteDescription" className="block text-sm font-medium mb-1">
                    Site Açıklaması
                  </label>
                  <textarea
                    id="siteDescription"
                    name="siteDescription"
                    value={settings.siteDescription}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium mb-1">
                    İletişim E-postası
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    name="contactEmail"
                    value={settings.contactEmail}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Sosyal Medya Bağlantıları</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="facebook" className="block text-sm font-medium mb-1">
                    Facebook
                  </label>
                  <input
                    type="url"
                    id="facebook"
                    name="facebook"
                    value={settings.socialLinks.facebook || ''}
                    onChange={handleSocialChange}
                    placeholder="https://facebook.com/..."
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="twitter" className="block text-sm font-medium mb-1">
                    Twitter
                  </label>
                  <input
                    type="url"
                    id="twitter"
                    name="twitter"
                    value={settings.socialLinks.twitter || ''}
                    onChange={handleSocialChange}
                    placeholder="https://twitter.com/..."
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="instagram" className="block text-sm font-medium mb-1">
                    Instagram
                  </label>
                  <input
                    type="url"
                    id="instagram"
                    name="instagram"
                    value={settings.socialLinks.instagram || ''}
                    onChange={handleSocialChange}
                    placeholder="https://instagram.com/..."
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="youtube" className="block text-sm font-medium mb-1">
                    YouTube
                  </label>
                  <input
                    type="url"
                    id="youtube"
                    name="youtube"
                    value={settings.socialLinks.youtube || ''}
                    onChange={handleSocialChange}
                    placeholder="https://youtube.com/..."
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="linkedin" className="block text-sm font-medium mb-1">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    id="linkedin"
                    name="linkedin"
                    value={settings.socialLinks.linkedin || ''}
                    onChange={handleSocialChange}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">SEO Ayarları</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="metaTitle" className="block text-sm font-medium mb-1">
                    Meta Başlık
                  </label>
                  <input
                    type="text"
                    id="metaTitle"
                    name="seo.metaTitle"
                    value={settings.seo.metaTitle}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="metaDescription" className="block text-sm font-medium mb-1">
                    Meta Açıklama
                  </label>
                  <textarea
                    id="metaDescription"
                    name="seo.metaDescription"
                    value={settings.seo.metaDescription}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Meta Anahtar Kelimeler
                  </label>
                  <input
                    type="text"
                    placeholder="Anahtar kelime ekle ve Enter'a bas"
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const input = e.currentTarget;
                        const value = input.value.trim();
                        
                        if (value && !settings.seo.metaKeywords.includes(value)) {
                          handleKeywordsChange([...settings.seo.metaKeywords, value]);
                          input.value = '';
                        }
                      }
                    }}
                  />
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {settings.seo.metaKeywords.map((keyword, index) => (
                      <div key={index} className="flex items-center gap-1 bg-accent/50 px-2 py-1 rounded-full text-sm">
                        <span>{keyword}</span>
                        <button
                          onClick={() => handleKeywordsChange(settings.seo.metaKeywords.filter((_, i) => i !== index))}
                          className="text-red-500 hover:text-red-700"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    OG Görsel (Sosyal Medya Paylaşımları)
                  </label>
                  
                  {settings.seo.ogImage ? (
                    <div className="relative aspect-[1200/630] rounded-md overflow-hidden mb-2 border border-border">
                      <Image
                        src={settings.seo.ogImage}
                        alt="OG Görsel"
                        fill
                        className="object-cover"
                      />
                      <button
                        onClick={() => setSettings((prev) => ({
                          ...prev,
                          seo: { ...prev.seo, ogImage: undefined }
                        }))}
                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                        title="Görseli kaldır"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-muted rounded-md p-8 text-center">
                      <div className="mb-4">
                        <Upload className="w-10 h-10 mx-auto text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mt-2">
                          OG Görsel yükleyin (1200x630 piksel önerilir)
                        </p>
                      </div>
                      
                      <label className="px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90 transition-colors">
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleOgImageUpload}
                        />
                        <span>Görsel Seç</span>
                      </label>
                      
                      {uploadProgress.ogImage > 0 && (
                        <div className="mt-4">
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{ width: `${uploadProgress.ogImage}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Sağ Panel - Görünüm ve Logo Ayarları */}
          <div className="space-y-6">
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Site Logosu ve Favicon</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Site Logosu
                  </label>
                  
                  {settings.siteLogo ? (
                    <div className="relative h-20 rounded-md overflow-hidden mb-2 border border-border">
                      <Image
                        src={settings.siteLogo}
                        alt="Site Logosu"
                        width={160}
                        height={80}
                        className="object-contain h-full mx-auto"
                      />
                      <button
                        onClick={() => setSettings((prev) => ({ ...prev, siteLogo: undefined }))}
                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                        title="Logoyu kaldır"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-muted rounded-md p-4 text-center">
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mt-2 mb-3">
                        Site logosunu yükleyin
                      </p>
                      
                      <label className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90 transition-colors text-sm">
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleLogoUpload}
                        />
                        <span>Logo Yükle</span>
                      </label>
                      
                      {uploadProgress.logo > 0 && (
                        <div className="mt-3">
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{ width: `${uploadProgress.logo}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Favicon
                  </label>
                  
                  {settings.siteIcon ? (
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-md overflow-hidden border border-border">
                        <Image
                          src={settings.siteIcon}
                          alt="Favicon"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <button
                        onClick={() => setSettings((prev) => ({ ...prev, siteIcon: undefined }))}
                        className="p-1 text-red-600 hover:text-red-700"
                        title="Favicon'u kaldır"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-muted rounded-md p-4 text-center">
                      <p className="text-sm text-muted-foreground mt-2 mb-3">
                        Favicon yükleyin (32x32 veya 64x64 piksel)
                      </p>
                      
                      <label className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90 transition-colors text-sm">
                        <input
                          type="file"
                          className="hidden"
                          accept="image/png,image/x-icon,image/svg+xml"
                          onChange={handleFaviconUpload}
                        />
                        <span>Favicon Yükle</span>
                      </label>
                      
                      {uploadProgress.favicon > 0 && (
                        <div className="mt-3">
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{ width: `${uploadProgress.favicon}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Görünüm Ayarları</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="primaryColor" className="block text-sm font-medium mb-1">
                    Ana Renk
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      id="primaryColor"
                      name="appearance.primaryColor"
                      value={settings.appearance.primaryColor}
                      onChange={handleChange}
                      className="h-9 w-9 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      name="appearance.primaryColor"
                      value={settings.appearance.primaryColor}
                      onChange={handleChange}
                      className="flex-1 px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="accentColor" className="block text-sm font-medium mb-1">
                    Aksent Renk
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      id="accentColor"
                      name="appearance.accentColor"
                      value={settings.appearance.accentColor}
                      onChange={handleChange}
                      className="h-9 w-9 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      name="appearance.accentColor"
                      value={settings.appearance.accentColor}
                      onChange={handleChange}
                      className="flex-1 px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="navbarStyle" className="block text-sm font-medium mb-1">
                    Navbar Stili
                  </label>
                  <select
                    id="navbarStyle"
                    name="appearance.navbarStyle"
                    value={settings.appearance.navbarStyle}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="light">Açık</option>
                    <option value="dark">Koyu</option>
                    <option value="transparent">Şeffaf</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="footerStyle" className="block text-sm font-medium mb-1">
                    Footer Stili
                  </label>
                  <select
                    id="footerStyle"
                    name="appearance.footerStyle"
                    value={settings.appearance.footerStyle}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="light">Açık</option>
                    <option value="dark">Koyu</option>
                  </select>
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
AdminSettings.getLayout = function getLayout(page: ReactElement): ReactElement {
  return <AdminLayout>{page}</AdminLayout>;
};

export default AdminSettings;