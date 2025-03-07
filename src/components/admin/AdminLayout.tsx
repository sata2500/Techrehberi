// src/components/admin/AdminLayout.tsx
import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOutUser } from '@/lib/firebase/auth';
import { LayoutDashboard, FileText, FolderOpen, Users, Settings, LogOut } from 'lucide-react';
import ProtectedAdminRoute from './ProtectedAdminRoute';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  
  const handleSignOut = async () => {
    try {
      await signOutUser();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  const isActivePath = (path: string) => {
    return router.pathname === path || router.pathname.startsWith(`${path}/`);
  };
  
  return (
    <ProtectedAdminRoute>
      <div className="flex h-screen bg-background">
        {/* Admin Sidebar */}
        <aside className="w-64 bg-card border-r border-border">
          <div className="p-6">
            <h1 className="text-xl font-bold">Tech Rehberi Admin</h1>
          </div>
          
          <nav className="mt-6">
            <div className="px-4 py-2 text-xs font-semibold text-muted-foreground">
              İçerik Yönetimi
            </div>
            
            <Link 
              href="/admin/dashboard" 
              className={`flex items-center px-6 py-3 text-sm ${
                isActivePath('/admin/dashboard') 
                  ? 'bg-primary/10 text-primary border-r-2 border-primary font-medium' 
                  : 'text-muted-foreground hover:bg-accent transition-colors'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 mr-3" />
              Dashboard
            </Link>
            
            <Link 
              href="/admin/posts" 
              className={`flex items-center px-6 py-3 text-sm ${
                isActivePath('/admin/posts') 
                  ? 'bg-primary/10 text-primary border-r-2 border-primary font-medium' 
                  : 'text-muted-foreground hover:bg-accent transition-colors'
              }`}
            >
              <FileText className="w-4 h-4 mr-3" />
              Blog Yazıları
            </Link>
            
            <Link 
              href="/admin/categories" 
              className={`flex items-center px-6 py-3 text-sm ${
                isActivePath('/admin/categories') 
                  ? 'bg-primary/10 text-primary border-r-2 border-primary font-medium' 
                  : 'text-muted-foreground hover:bg-accent transition-colors'
              }`}
            >
              <FolderOpen className="w-4 h-4 mr-3" />
              Kategoriler
            </Link>
            
            <Link 
              href="/admin/users" 
              className={`flex items-center px-6 py-3 text-sm ${
                isActivePath('/admin/users') 
                  ? 'bg-primary/10 text-primary border-r-2 border-primary font-medium' 
                  : 'text-muted-foreground hover:bg-accent transition-colors'
              }`}
            >
              <Users className="w-4 h-4 mr-3" />
              Kullanıcılar
            </Link>
            
            <Link 
              href="/admin/settings" 
              className={`flex items-center px-6 py-3 text-sm ${
                isActivePath('/admin/settings') 
                  ? 'bg-primary/10 text-primary border-r-2 border-primary font-medium' 
                  : 'text-muted-foreground hover:bg-accent transition-colors'
              }`}
            >
              <Settings className="w-4 h-4 mr-3" />
              Site Ayarları
            </Link>
            
            <button 
              onClick={handleSignOut}
              className="flex items-center w-full text-left px-6 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Çıkış Yap
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </ProtectedAdminRoute>
  );
}