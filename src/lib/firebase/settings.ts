// src/lib/firebase/settings.ts
import { 
    doc, 
    getDoc, 
    setDoc, 
    Timestamp 
  } from 'firebase/firestore';
  import { db } from './firebase';
  
  // Site ayarları için tip tanımı
  export interface SiteSettings {
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
    updatedAt?: Date;
    createdAt?: Date;
  }
  
  // Varsayılan site ayarları
  const defaultSettings: SiteSettings = {
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
  };
  
  // Site ayarlarını getir
  export const getSiteSettings = async (): Promise<SiteSettings> => {
    try {
      const settingsRef = doc(db, 'settings', 'site');
      const settingsSnap = await getDoc(settingsRef);
      
      if (settingsSnap.exists()) {
        const data = settingsSnap.data();
        return {
          id: 'site',
          ...data,
          updatedAt: data.updatedAt?.toDate(),
          createdAt: data.createdAt?.toDate(),
        } as SiteSettings;
      }
      
      // Ayarlar yoksa varsayılanları kullan
      return { ...defaultSettings };
    } catch (error) {
      console.error('Error getting site settings:', error);
      // Hata durumunda varsayılan ayarları döndür
      return { ...defaultSettings };
    }
  };
  
  // Site ayarlarını kaydet
  export const saveSiteSettings = async (settings: SiteSettings): Promise<string> => {
    try {
      const now = new Date();
      const settingsRef = doc(db, 'settings', 'site');
      
      await setDoc(settingsRef, {
        ...settings,
        updatedAt: Timestamp.fromDate(now),
        createdAt: settings.createdAt ? Timestamp.fromDate(new Date(settings.createdAt)) : Timestamp.fromDate(now),
      });
      
      return 'site';
    } catch (error) {
      console.error('Error saving site settings:', error);
      throw error;
    }
  };