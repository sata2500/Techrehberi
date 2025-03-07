// src/lib/firebase/dashboard.ts
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit, 
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';

// Dashboard istatistik verileri için tip tanımı
export interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalCategories: number;
  totalUsers: number;
  recentPosts: RecentPost[];
  recentActivities: Activity[];
  popularPosts: PopularPost[];
  trafficStats: {date: string, views: number}[];
}

// Son yazılar için tip tanımı
export interface RecentPost {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  author: string;
  createdAt: Date;
}

// Popüler yazılar için tip tanımı
export interface PopularPost {
  id: string;
  title: string;
  slug: string;
  viewCount: number;
  likeCount: number;
}

// Aktivite tipi
export interface Activity {
  id: string;
  type: 'post_created' | 'post_updated' | 'post_published' | 'user_registered' | 'comment_added';
  message: string;
  user: string;
  timestamp: Date;
  entityId?: string;
  entityTitle?: string;
}

/**
 * Dashboard istatistiklerini getirir
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    // Blog yazıları için koleksiyon referansı
    const postsCollection = collection(db, 'blogPosts');
    
    // Kategoriler için koleksiyon referansı
    const categoriesCollection = collection(db, 'categories');
    
    // Kullanıcılar için koleksiyon referansı
    const usersCollection = collection(db, 'users');
    
    // Aktiviteler için koleksiyon referansı
    const activitiesCollection = collection(db, 'activities');
    
    // Tüm yazıları sorgulamak için
    const postsQuery = await getDocs(postsCollection);
    
    // Kategorileri sorgulamak için
    const categoriesQuery = await getDocs(categoriesCollection);
    
    // Kullanıcıları sorgulamak için
    const usersQuery = await getDocs(usersCollection);
    
    // Yayınlanmış yazıları saymak için
    const publishedPostsQuery = await getDocs(
      query(postsCollection, where('status', '==', 'published'))
    );
    
    // Taslak yazıları saymak için
    const draftPostsQuery = await getDocs(
      query(postsCollection, where('status', '==', 'draft'))
    );
    
    // Son eklenen 5 yazıyı getir
    const recentPostsQuery = await getDocs(
      query(postsCollection, orderBy('createdAt', 'desc'), limit(5))
    );
    
    // Son aktiviteleri getir
    const recentActivitiesQuery = await getDocs(
      query(activitiesCollection, orderBy('timestamp', 'desc'), limit(10))
    );
    
    // En popüler yazıları getir (görüntülenme sayısına göre)
    const popularPostsQuery = await getDocs(
      query(postsCollection, where('status', '==', 'published'), orderBy('viewCount', 'desc'), limit(5))
    );
    
    // Son eklenen yazıları formatlayarak diziye dönüştür
    const recentPosts: RecentPost[] = [];
    recentPostsQuery.forEach((doc) => {
      const postData = doc.data();
      recentPosts.push({
        id: doc.id,
        title: postData.title || 'Başlıksız Yazı',
        slug: postData.slug || '',
        status: postData.status || 'draft',
        author: postData.author?.name || 'Anonim',
        createdAt: postData.createdAt instanceof Timestamp ? postData.createdAt.toDate() : new Date(postData.createdAt)
      });
    });
    
    // Son aktiviteleri formatlayarak diziye dönüştür
    const recentActivities: Activity[] = [];
    recentActivitiesQuery.forEach((doc) => {
      const activityData = doc.data();
      recentActivities.push({
        id: doc.id,
        type: activityData.type,
        message: activityData.message,
        user: activityData.user || 'Sistem',
        timestamp: activityData.timestamp instanceof Timestamp ? activityData.timestamp.toDate() : new Date(activityData.timestamp),
        entityId: activityData.entityId,
        entityTitle: activityData.entityTitle
      });
    });
    
    // Popüler yazıları formatlayarak diziye dönüştür
    const popularPosts: PopularPost[] = [];
    popularPostsQuery.forEach((doc) => {
      const postData = doc.data();
      popularPosts.push({
        id: doc.id,
        title: postData.title || 'Başlıksız Yazı',
        slug: postData.slug || '',
        viewCount: postData.viewCount || 0,
        likeCount: postData.likes || 0
      });
    });
    
    // Trafik istatistiklerini al
    const trafficStats = await getTrafficStats();
    
    // Toplanmış istatistikleri döndür
    return {
      totalPosts: postsQuery.size,
      publishedPosts: publishedPostsQuery.size,
      draftPosts: draftPostsQuery.size,
      totalCategories: categoriesQuery.size,
      totalUsers: usersQuery.size,
      recentPosts,
      recentActivities,
      popularPosts,
      trafficStats
    };
  } catch (error) {
    console.error('Dashboard istatistikleri alınırken hata:', error);
    // Hata durumunda boş bir istatistik nesnesi döndür
    return {
      totalPosts: 0,
      publishedPosts: 0,
      draftPosts: 0, 
      totalCategories: 0,
      totalUsers: 0,
      recentPosts: [],
      recentActivities: [],
      popularPosts: [],
      trafficStats: []
    };
  }
};

/**
 * Son 7 günlük trafik verilerini getirir (mock veri)
 */
export const getTrafficStats = async (): Promise<{date: string, views: number}[]> => {
  // Gerçek uygulamada bu veriyi Google Analytics veya başka bir servis üzerinden çekersiniz
  // Şimdilik örnek veri döndürüyoruz
  const today = new Date();
  const stats = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Random görüntülenme sayısı (100-500 arası)
    const views = Math.floor(Math.random() * 400) + 100;
    
    stats.push({
      date: date.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' }),
      views
    });
  }
  
  return stats;
};