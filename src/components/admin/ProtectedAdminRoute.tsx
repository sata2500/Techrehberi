import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/auth-context';
import { useEffect, useState, ReactNode } from 'react';
import { checkAdminRole } from '@/lib/firebase/admin';

interface ProtectedAdminRouteProps {
  children: ReactNode;
}

export default function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      if (!isLoading) {
        if (!user) {
          router.push('/auth/signin?redirect=' + router.asPath);
        } else {
          try {
            const isAdmin = await checkAdminRole(user.uid);
            if (!isAdmin) {
              router.push('/');
            } else {
              setAuthorized(true);
            }
          } catch (error) {
            console.error('Admin role check error:', error);
            router.push('/');
          }
        }
      }
    };
    
    checkAuth();
  }, [user, isLoading, router]);
  
  if (isLoading || !authorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }
  
  return <>{children}</>;
}