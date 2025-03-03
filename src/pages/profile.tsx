import { NextPage } from 'next';
import { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/auth-context';
import { Settings, HelpCircle, LogOut } from 'lucide-react';
import { signOutUser } from '@/lib/firebase/auth';

const ProfilePage: NextPage = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Kullanıcı giriş yapmamışsa, giriş sayfasına yönlendir
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/signin');
    }
  }, [user, isLoading, router]);

  const handleSignOut = async () => {
    try {
      await signOutUser();
      router.push('/');
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return null; // useEffect ile yönlendirme yapılacak
  }

  return (
    <>
      <Head>
        <title>Profilim - Tech Rehberi</title>
        <meta name="description" content="Kullanıcı profil sayfası, kurslar ve içeriklerinizi yönetin." />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-card border rounded-xl p-6 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative w-24 h-24 rounded-full overflow-hidden">
                {user.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt={user.displayName || 'Kullanıcı'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-1">
                  {user.displayName || 'Kullanıcı'}
                </h1>
                <p className="text-muted-foreground mb-4">
                  {user.email}
                </p>
                
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/settings"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Ayarlar
                  </Link>
                  <Link
                    href="/help"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <HelpCircle className="w-4 h-4" />
                    Yardım
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Çıkış Yap
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content Tabs */}
          <div className="border-b mb-6">
            <div className="flex overflow-x-auto space-x-8">
              <button className="px-4 py-2 border-b-2 border-primary font-medium text-primary">
                İçeriklerim
              </button>
              <button className="px-4 py-2 border-b-2 border-transparent font-medium text-muted-foreground hover:text-foreground transition-colors">
                Favoriler
              </button>
              <button className="px-4 py-2 border-b-2 border-transparent font-medium text-muted-foreground hover:text-foreground transition-colors">
                Tamamlananlar
              </button>
              <button className="px-4 py-2 border-b-2 border-transparent font-medium text-muted-foreground hover:text-foreground transition-colors">
                Ayarlar
              </button>
            </div>
          </div>

          {/* Content Placeholder */}
          <div className="bg-card border rounded-xl p-8 text-center">
            <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Henüz İçerik Yok</h2>
            <p className="text-muted-foreground mb-6">
              İçerik ekleyerek kişisel koleksiyonunuzu oluşturmaya başlayın.
            </p>
            <Link 
              href="/"
              className="inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              İçeriklere Göz At
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;