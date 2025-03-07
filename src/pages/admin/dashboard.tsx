// src/pages/admin/dashboard.tsx
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState, ReactElement } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { FileText, FolderOpen, Users } from 'lucide-react';

// Özel layout kullanan sayfalar için tip tanımı
type NextPageWithLayout<P = {}> = NextPage<P> & {
  getLayout?: (page: ReactElement) => ReactElement;
}

// İstatistikler için tip tanımı
interface DashboardStats {
  totalPosts: number;
  draftPosts: number;
  publishedPosts: number;
  categories: number;
}

const AdminDashboard: NextPageWithLayout = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    draftPosts: 0,
    publishedPosts: 0,
    categories: 0
  });
  
  const [loading, setLoading] = useState(true);
  
  // İstatistik verilerini getir
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Gerçek uygulamada burada API çağrısı yapacaksınız
        // Şimdilik örnek veriler kullanıyoruz
        setStats({
          totalPosts: 5,
          draftPosts: 2,
          publishedPosts: 3,
          categories: 4
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  return (
    <>
      <Head>
        <title>Admin Dashboard - Tech Rehberi</title>
      </Head>
      
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        
        {loading ? (
          <div className="flex justify-center">
            <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>
        ) : (
          <>
            {/* İstatistik Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-card border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Toplam Yazı</p>
                    <h4 className="text-2xl font-bold">{stats.totalPosts}</h4>
                  </div>
                  <div className="rounded-full bg-primary/10 p-3">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </div>
              
              <div className="bg-card border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Yayında</p>
                    <h4 className="text-2xl font-bold">{stats.publishedPosts}</h4>
                  </div>
                  <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3">
                    <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>
              
              <div className="bg-card border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Taslak</p>
                    <h4 className="text-2xl font-bold">{stats.draftPosts}</h4>
                  </div>
                  <div className="rounded-full bg-amber-100 dark:bg-amber-900/20 p-3">
                    <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
              </div>
              
              <div className="bg-card border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Kategoriler</p>
                    <h4 className="text-2xl font-bold">{stats.categories}</h4>
                  </div>
                  <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-3">
                    <FolderOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Hızlı Erişim */}
            <div className="bg-card border rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">Hızlı Erişim</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/admin/posts/create" className="bg-primary text-primary-foreground rounded-lg p-4 hover:bg-primary/90 transition-colors">
                  <h4 className="font-medium mb-1">Yeni Blog Yazısı</h4>
                  <p className="text-sm opacity-90">Yeni bir blog yazısı oluşturun</p>
                </Link>
                
                <Link href="/admin/categories/create" className="bg-accent hover:bg-accent/80 rounded-lg p-4 transition-colors">
                  <h4 className="font-medium mb-1">Yeni Kategori</h4>
                  <p className="text-sm text-muted-foreground">Yeni bir kategori ekleyin</p>
                </Link>
                
                <Link href="/admin/media" className="bg-accent hover:bg-accent/80 rounded-lg p-4 transition-colors">
                  <h4 className="font-medium mb-1">Medya Kütüphanesi</h4>
                  <p className="text-sm text-muted-foreground">Görselleri yönetin</p>
                </Link>
              </div>
            </div>

            {/* Son Etkinlikler */}
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Son Etkinlikler</h3>
              <p className="text-muted-foreground text-center py-4">
                Henüz etkinlik bulunmuyor.
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
};

// Layout'u bileşene ekle
AdminDashboard.getLayout = function getLayout(page: ReactElement): ReactElement {
    return <AdminLayout>{page}</AdminLayout>;
  };
  
  export default AdminDashboard;