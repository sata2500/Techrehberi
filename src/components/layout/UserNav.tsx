import Link from 'next/link';
import { LogIn, UserCircle, Settings, HelpCircle, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { signOutUser } from '@/lib/firebase/auth';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

export function UserNav() {
  const { user, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setIsOpen(false);
      router.push('/'); // Çıkış yaptıktan sonra ana sayfaya yönlendir
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
    }
  };

  // Yükleniyor durumu
  if (isLoading) {
    return <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />;
  }

  // Kullanıcı giriş yapmamışsa
  if (!user) {
    return (
      <Link
        href="/auth/signin"
        className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        <LogIn className="h-4 w-4" />
        <span>Giriş Yap</span>
      </Link>
    );
  }

  // Kullanıcı giriş yapmışsa
  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 rounded-full focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {user.photoURL ? (
          <Image
            src={user.photoURL}
            alt={user.displayName || 'Kullanıcı'}
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <UserCircle className="h-8 w-8 text-muted-foreground" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md border bg-background shadow-lg">
          <div className="p-3 border-b">
            <p className="font-medium truncate">{user.displayName || 'Kullanıcı'}</p>
            <p className="text-sm text-muted-foreground truncate">{user.email}</p>
          </div>

          <div className="p-1">
            <Link
              href="/profile"
              className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent"
              onClick={() => setIsOpen(false)}
            >
              <UserCircle className="h-4 w-4" />
              Profilim
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="h-4 w-4" />
              Ayarlar
            </Link>
            <Link
              href="/help"
              className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent"
              onClick={() => setIsOpen(false)}
            >
              <HelpCircle className="h-4 w-4" />
              Yardım
            </Link>
          </div>

          <div className="border-t p-1">
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm text-red-600 hover:bg-accent"
            >
              <LogOut className="h-4 w-4" />
              Çıkış Yap
            </button>
          </div>
        </div>
      )}
    </div>
  );
}