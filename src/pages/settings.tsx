import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useAuth } from '@/contexts/auth-context';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

const SettingsPage: NextPage = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // After mounting, we can access the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  // Kullanıcı giriş yapmamışsa, giriş sayfasına yönlendir
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/signin');
    }
  }, [user, isLoading, router]);

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

  if (!mounted) {
    return null; // Tema bilgisi için montaj kontrolü
  }

  return (
    <>
      <Head>
        <title>Ayarlar - Tech Rehberi</title>
        <meta name="description" content="Kullanıcı ayarları ve tercihlerinizi düzenleyin." />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Profil Sayfasına Dön
            </Link>
            <h1 className="text-3xl font-bold mt-4">Ayarlar</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
            {/* Sidebar */}
            <div>
              <div className="bg-card border rounded-xl p-4 sticky top-20">
                <nav className="space-y-1">
                  <button className="w-full px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium text-left">
                    Genel Ayarlar
                  </button>
                  <button className="w-full px-3 py-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors text-left">
                    Bildirim Ayarları
                  </button>
                  <button className="w-full px-3 py-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors text-left">
                    Profil Bilgileri
                  </button>
                  <button className="w-full px-3 py-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors text-left">
                    Hesap Ayarları
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div>
              <div className="bg-card border rounded-xl p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Tema Ayarları</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    onClick={() => setTheme('light')}
                    className={`p-4 border rounded-lg hover:bg-accent transition-colors flex flex-col items-center ${
                      theme === 'light' ? 'border-primary bg-primary/5' : ''
                    }`}
                  >
                    <Sun className="w-8 h-8 mb-2" />
                    <span className="font-medium">Açık Tema</span>
                  </button>
                  
                  <button
                    onClick={() => setTheme('dark')}
                    className={`p-4 border rounded-lg hover:bg-accent transition-colors flex flex-col items-center ${
                      theme === 'dark' ? 'border-primary bg-primary/5' : ''
                    }`}
                  >
                    <Moon className="w-8 h-8 mb-2" />
                    <span className="font-medium">Koyu Tema</span>
                  </button>
                  
                  <button
                    onClick={() => setTheme('system')}
                    className={`p-4 border rounded-lg hover:bg-accent transition-colors flex flex-col items-center ${
                      theme === 'system' ? 'border-primary bg-primary/5' : ''
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
                      <rect width="20" height="14" x="2" y="3" rx="2"/>
                      <line x1="8" x2="16" y1="21" y2="21"/>
                      <line x1="12" x2="12" y1="17" y2="21"/>
                    </svg>
                    <span className="font-medium">Sistem Teması</span>
                  </button>
                </div>
              </div>

              <div className="bg-card border rounded-xl p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Profil Bilgileri</h2>
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden bg-muted">
                    {user.photoURL ? (
                      <Image
                        src={user.photoURL}
                        alt={user.displayName || 'Kullanıcı'}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 w-full">
                    <div className="grid gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">İsim</label>
                        <input
                          type="text"
                          value={user.displayName || ''}
                          disabled
                          className="w-full px-3 py-2 border border-input rounded-md bg-muted/50"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                          type="email"
                          value={user.email || ''}
                          disabled
                          className="w-full px-3 py-2 border border-input rounded-md bg-muted/50"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <button
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        disabled
                      >
                        Profil Bilgilerini Güncelle
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card border rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Gizlilik Ayarları</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Email Bildirimleri</h3>
                      <p className="text-sm text-muted-foreground">Yeni içerik ve duyurular için email bildirimleri al</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-muted rounded-full peer peer-focus:ring-4 peer-focus:ring-primary/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Çerezler ve İzleme</h3>
                      <p className="text-sm text-muted-foreground">İçerik önerileri için tercihlerin izlenmesine izin ver</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-muted rounded-full peer peer-focus:ring-4 peer-focus:ring-primary/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;