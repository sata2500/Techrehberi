// src/lib/firebase/analytics.ts
import { 
    collection, 
    query, 
    where, 
    getDocs, 
    orderBy, 
    limit, 
    Timestamp,
    getDoc,
    doc,
    startAfter,
    endBefore
  } from 'firebase/firestore';
  import { db } from '@/lib/firebase/firebase';
  import { 
    DashboardStats, 
    ViewsData, 
    PopularPost, 
    ActivityLog,
    TopicTrend,
    CategoryData,
    UserActivity
  } from '@/types/dashboard';
  
  // Temel dashboard istatistiklerini getir
  export const getDashboardStats = async (): Promise<DashboardStats> => {
    try {
      // Blog yazıları için koleksiyon referansı
      const postsCollection = collection(db, 'blogPosts');
      
      // Kategoriler için koleksiyon referansı
      const categoriesCollection = collection(db, 'categories');
      
      // Kullanıcılar için koleksiyon referansı
      const usersCollection = collection(db, 'users');
      
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
      
      // İstatistik belgesi referansı
      const statsRef = doc(db, 'statistics', 'general');
      const statsSnapshot = await getDoc(statsRef);
      
      // Toplam görüntülenme ve trend verisi
      let totalViews = 0;
      let viewsTrend = 0;
      
      if (statsSnapshot.exists()) {
        const statsData = statsSnapshot.data();
        totalViews = statsData.totalViews || 0;
        
        // Son 7 gündeki görüntülenme artış yüzdesi (örnek veri)
        const currentViews = statsData.lastWeekViews || 0;
        const previousViews = statsData.previousWeekViews || 0;
        
        viewsTrend = previousViews === 0 
          ? 100 
          : Math.round(((currentViews - previousViews) / previousViews) * 100);
      }
      
      return {
        totalPosts: postsQuery.size,
        publishedPosts: publishedPostsQuery.size,
        draftPosts: draftPostsQuery.size,
        totalCategories: categoriesQuery.size,
        totalUsers: usersQuery.size,
        totalViews,
        viewsTrend
      };
    } catch (error) {
      console.error('Dashboard istatistikleri alınırken hata:', error);
      // Hata durumunda varsayılan değerler döndür
      return {
        totalPosts: 0,
        publishedPosts: 0,
        draftPosts: 0, 
        totalCategories: 0,
        totalUsers: 0,
        totalViews: 0,
        viewsTrend: 0
      };
    }
  };
  
  // Görüntülenme verilerini getir (son 30 gün)
  export const getViewsData = async (): Promise<ViewsData[]> => {
    try {
      const viewsCollection = collection(db, 'statistics', 'daily', 'views');
      
      // Son 30 günün tarihini hesapla
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const viewsQuery = query(
        viewsCollection,
        where('date', '>=', Timestamp.fromDate(thirtyDaysAgo)),
        orderBy('date', 'asc')
      );
      
      const viewsSnapshot = await getDocs(viewsQuery);
      
      const viewsData: ViewsData[] = [];
      
      viewsSnapshot.forEach(doc => {
        const data = doc.data();
        viewsData.push({
          date: data.date.toDate().toISOString().split('T')[0], // 'YYYY-MM-DD' formatına dönüştür
          views: data.views || 0
        });
      });
      
      // Veri yoksa veya eksikse örnek veri oluştur
      if (viewsData.length < 30) {
        return generateSampleViewsData(30);
      }
      
      return viewsData;
    } catch (error) {
      console.error('Görüntülenme verileri alınırken hata:', error);
      return generateSampleViewsData(30);
    }
  };
  
  // En popüler yazıları getir
  export const getPopularPosts = async (postLimit: number = 5): Promise<PopularPost[]> => {
      try {
        const postsCollection = collection(db, 'blogPosts');
        
        const popularPostsQuery = query(
          postsCollection, 
          where('status', '==', 'published'),
          orderBy('viewCount', 'desc'),
          limit(postLimit)
        );
      
      const postsSnapshot = await getDocs(popularPostsQuery);
      
      const popularPosts: PopularPost[] = [];
      
      postsSnapshot.forEach(doc => {
        const data = doc.data();
        popularPosts.push({
          id: doc.id,
          title: data.title || 'Başlıksız Yazı',
          slug: data.slug || '',
          viewCount: data.viewCount || 0,
          likeCount: data.likes || 0,
          commentCount: data.commentCount || 0,
          publishDate: data.publishedAt ? new Date(data.publishedAt.toDate()).toISOString() : new Date().toISOString(),
          category: data.categories && data.categories.length > 0 ? data.categories[0] : undefined
        });
      });
      
      return popularPosts;
    } catch (error) {
      console.error('Popüler yazılar alınırken hata:', error);
      return [];
    }
  };
  
  // Son etkinlikleri getir
  export const getRecentActivities = async (activityLimit: number = 10): Promise<ActivityLog[]> => {
    try {
      const activitiesCollection = collection(db, 'activities');
      
      const activitiesQuery = query(
        activitiesCollection,
        orderBy('timestamp', 'desc'),
        limit(activityLimit)
      );
      
      const activitiesSnapshot = await getDocs(activitiesQuery);
      
      const activities: ActivityLog[] = [];
      
      activitiesSnapshot.forEach(doc => {
        const data = doc.data();
        activities.push({
          id: doc.id,
          type: data.type,
          message: data.message,
          user: data.user || 'Sistem',
          timestamp: data.timestamp ? data.timestamp.toDate() : new Date(),
          entityId: data.entityId,
          entityTitle: data.entityTitle
        });
      });
      
      return activities;
    } catch (error) {
      console.error('Etkinlikler alınırken hata:', error);
      return [];
    }
  };
  
  // Örnek görüntülenme verisi oluştur (API veya DB bağlantısı olmadığında)
  const generateSampleViewsData = (days: number): ViewsData[] => {
    const data: ViewsData[] = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Random görüntülenme sayısı (100-1000 arası)
      const views = Math.floor(Math.random() * 900) + 100;
      
      data.push({
        date: date.toISOString().split('T')[0],
        views
      });
    }
    
    return data;
  };
  
  // Kategori verilerini getir
  export const getCategoryData = async (): Promise<CategoryData[]> => {
    try {
      const categoriesCollection = collection(db, 'categories');
      const categoriesSnapshot = await getDocs(categoriesCollection);
      
      const categoriesData: {name: string, count: number}[] = [];
      let totalPosts = 0;
      
      categoriesSnapshot.forEach(doc => {
        const data = doc.data();
        const count = data.postCount || 0;
        totalPosts += count;
        
        categoriesData.push({
          name: data.name,
          count
        });
      });
      
      // Yüzdelik hesapla ve sırala
      const result: CategoryData[] = categoriesData
        .map(cat => ({
          ...cat,
          percentage: totalPosts === 0 ? 0 : Math.round((cat.count / totalPosts) * 100)
        }))
        .sort((a, b) => b.count - a.count);
      
      return result;
    } catch (error) {
      console.error('Kategori verileri alınırken hata:', error);
      return [];
    }
  };
  
  // Kullanıcı aktivite verilerini getir
  export const getUserActivityData = async (days: number = 14): Promise<UserActivity[]> => {
    try {
      // Gerçek veritabanı sorgusu burada olacak
      
      // Örnek veri oluştur
      const data: UserActivity[] = [];
      const today = new Date();
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        data.push({
          date: date.toISOString().split('T')[0],
          newUsers: Math.floor(Math.random() * 15),
          activeUsers: Math.floor(Math.random() * 100) + 50
        });
      }
      
      return data;
    } catch (error) {
      console.error('Kullanıcı aktivite verileri alınırken hata:', error);
      return [];
    }
  };