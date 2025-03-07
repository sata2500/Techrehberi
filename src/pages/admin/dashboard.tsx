// src/pages/admin/dashboard.tsx
import { useState, useEffect, ReactElement } from 'react';
import { NextPageWithLayout } from '@/pages/_app'; // Bu satırı düzelttim - tip tanımını import ediyoruz
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/AdminLayout';
import DashboardStatsGrid from '@/components/admin/DashboardStats';
import VisitorChart from '@/components/admin/VisitorChart';
import ContentPerformanceChart from '@/components/admin/ContentPerformanceChart';
import TrendingTopics from '@/components/admin/TrendingTopics';
import { 
  FileText, 
  FolderOpen, 
  Users, 
  Clock, 
  Calendar, 
  Eye // Eye bileşenini burada import ediyoruz
} from 'lucide-react';
import { 
  getDashboardStats, 
  getViewsData, 
  getPopularPosts, 
  getRecentActivities,
  getCategoryData
} from '@/lib/firebase/analytics';
import { DashboardStats, ViewsData, PopularPost, ActivityLog, TopicTrend, CategoryData } from '@/types/dashboard';

// Örnek trending konular
const SAMPLE_TRENDING_TOPICS: TopicTrend[] = [
  { topic: 'React', count: 15, trend: 24 },
  { topic: 'Next.js', count: 12, trend: 18 },
  { topic: 'TypeScript', count: 10, trend: 5 },
  { topic: 'Tailwind CSS', count: 8, trend: 12 },
  { topic: 'Firebase', count: 7, trend: -3 },
  { topic: 'Artificial Intelligence', count: 6, trend: 30 },
  { topic: 'Web Development', count: 5, trend: 0 }
];

// Döngüsel tanımı kaldırdım
const AdminDashboard: NextPageWithLayout = () => {
  const router = useRouter();
  
  // State'ler
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalCategories: 0,
    totalUsers: 0,
    totalViews: 0,
    viewsTrend: 0
  });
  
  const [viewsData, setViewsData] = useState<ViewsData[]>([]);
  const [popularPosts, setPopularPosts] = useState<PopularPost[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<TopicTrend[]>(SAMPLE_TRENDING_TOPICS);
  
  const [loading, setLoading] = useState<{
    stats: boolean;
    views: boolean;
    posts: boolean;
    activities: boolean;
    categories: boolean;
  }>({
    stats: true,
    views: true,
    posts: true,
    activities: true,
    categories: true
  });
  
  const [error, setError] = useState<string | null>(null);
  
  // Verileri getir
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // İstatistikleri getir
        const statsData = await getDashboardStats();
        setStats(statsData);
        setLoading(prev => ({ ...prev, stats: false }));
        
        // Görüntülenme verilerini getir
        const views = await getViewsData();
        setViewsData(views);
        setLoading(prev => ({ ...prev, views: false }));
        
        // Popüler yazıları getir
        const posts = await getPopularPosts();
        setPopularPosts(posts);
        setLoading(prev => ({ ...prev, posts: false }));
        
        // Son etkinlikleri getir
        const activities = await getRecentActivities();
        setActivities(activities);
        setLoading(prev => ({ ...prev, activities: false }));
        
        // Kategori verilerini getir
        const categories = await getCategoryData();
        setCategoryData(categories);
        setLoading(prev => ({ ...prev, categories: false }));
        
        // Trendig konular gerçek uygulamada API'den gelecek
        // Şimdilik örnek veriler kullanıyoruz
      } catch (err) {
        console.error('Dashboard verileri alınırken hata:', err);
        setError('Dashboard verileri yüklenirken bir hata oluştu. Lütfen sayfayı yenileyip tekrar deneyin.');
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Tarih formatlamak için yardımcı fonksiyon
  const formatDate = (dateString: string | Date): string => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <>
      <Head>
        <title>Admin Dashboard - Tech Rehberi</title>
      </Head>
      
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-md border border-red-200 dark:border-red-800 mb-6">
            <p>{error}</p>
            <button 
              onClick={() => router.reload()}
              className="mt-2 text-sm text-red-700 dark:text-red-400 underline"
            >
              Sayfayı Yenile
            </button>
          </div>
        )}
        
        {/* İstatistik Kartları */}
        <section className="mb-8">
          <DashboardStatsGrid stats={stats} isLoading={loading.stats} />
        </section>
        
        {/* Ana Grafikler */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <VisitorChart 
            data={viewsData} 
            title="Site Ziyaretleri" 
            isLoading={loading.views}
          />
          
          <ContentPerformanceChart 
            data={categoryData} 
            isLoading={loading.categories}
          />
        </section>
        
        {/* Alt İçerik Bölümü */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Trend Konular */}
          <div>
            <TrendingTopics 
              topics={trendingTopics} 
              isLoading={false}
              title="Trend Konular"
            />
          </div>
          
          {/* Popüler Yazılar */}
          <div className="md:col-span-2">
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Popüler Yazılar</h3>
              
              {loading.posts ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0">
                      <div className="w-12 h-12 bg-muted/50 rounded-md animate-pulse flex-shrink-0"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted/50 rounded-full w-3/4 animate-pulse"></div>
                        <div className="h-3 bg-muted/50 rounded-full w-1/2 animate-pulse"></div>
                      </div>
                      <div className="w-16 h-4 bg-muted/50 rounded-full animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : popularPosts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Henüz popüler yazı bulunmuyor</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {popularPosts.map((post, index) => (
                    <div key={post.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                      <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="font-semibold text-primary">{index + 1}</span>
                      </div>
                      
                      <div className="flex-1">
                        <Link href={`/admin/posts/edit/${post.id}`} className="hover:text-primary">
                          <h4 className="font-medium line-clamp-1">{post.title}</h4>
                        </Link>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {post.viewCount} görüntülenme
                          </span>
                          
                          {post.category && (
                            <span className="flex items-center gap-1">
                              <FolderOpen className="w-3 h-3" />
                              {post.category}
                            </span>
                          )}
                          
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(post.publishDate).split(' ')[0]}
                          </span>
                        </div>
                      </div>
                      
                      <Link
                        href={`/admin/posts/edit/${post.id}`}
                        className="text-xs px-2 py-1 bg-accent hover:bg-accent/70 rounded"
                      >
                        Düzenle
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
        
        {/* Son Etkinlikler */}
        <section className="bg-card border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Son Etkinlikler</h3>
          
          {loading.activities ? (
            <div className="space-y-6">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex items-start gap-3 pb-4 border-b last:border-0">
                  <div className="w-10 h-10 bg-muted/50 rounded-full animate-pulse flex-shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted/50 rounded-full w-3/4 animate-pulse"></div>
                    <div className="h-3 bg-muted/50 rounded-full w-1/2 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Henüz etkinlik bulunmuyor.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 pb-4 border-b last:border-0">
                  <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-primary/10">
                    {activity.type === 'post_created' && <FileText className="w-4 h-4 text-primary" />}
                    {activity.type === 'post_updated' && <Clock className="w-4 h-4 text-amber-500" />}
                    {activity.type === 'post_published' && <Eye className="w-4 h-4 text-green-500" />}
                    {activity.type === 'user_registered' && <Users className="w-4 h-4 text-blue-500" />}
                    {activity.type === 'comment_added' && <FileText className="w-4 h-4 text-purple-500" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.message}</p>
                    <div className="flex items-center mt-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>{formatDate(activity.timestamp)}</span>
                      <span className="mx-2">•</span>
                      <span>{activity.user}</span>
                    </div>
                  </div>
                  {activity.entityId && activity.type.startsWith('post_') && (
                    <Link 
                      href={`/admin/posts/edit/${activity.entityId}`}
                      className="flex-shrink-0 px-2 py-1 text-xs bg-accent rounded-md hover:bg-accent/80"
                    >
                      Görüntüle
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
};

// Layout'u bileşene ekle
AdminDashboard.getLayout = function getLayout(page: ReactElement): ReactElement {
  return <AdminLayout>{page}</AdminLayout>;
};

export default AdminDashboard;