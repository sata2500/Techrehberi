import { NextPage } from 'next';
import { signInWithGoogle } from '@/lib/firebase/auth';
import { useState } from 'react';
import { useRouter } from 'next/router'; // App Router'dan Pages Router'a geçerken navigation hook değişir
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';

const SignInPage: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const result = await signInWithGoogle();
      if (result.success) {
        router.push('/'); // Ana sayfaya yönlendir
      }
    } catch (error) {
      setError('Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
      console.error('Giriş hatası:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Giriş Yap - Tech Rehberi</title>
        <meta name="description" content="Hesabınıza giriş yapın." />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link href="/" className="inline-block">
              <Image 
                src="/assets/images/logo.png" 
                alt="Logo" 
                width={64} 
                height={64}
                className="mx-auto rounded-lg"
              />
            </Link>
            <h2 className="mt-6 text-3xl font-bold tracking-tight">
              Hesabınıza giriş yapın
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              veya{' '}
              <Link href="/" className="font-medium text-primary hover:text-primary/90">
                ana sayfaya dönün
              </Link>
            </p>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-input bg-background hover:bg-accent rounded-lg text-sm font-medium transition-colors"
            >
              <Image 
                src="/assets/images/icons/google.svg" 
                alt="Google" 
                width={20} 
                height={20} 
              />
              {isLoading ? 'Giriş yapılıyor...' : 'Google ile devam et'}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  veya email ile devam edin
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <input
                type="email"
                name="email"
                placeholder="Email adresi"
                className="w-full px-3 py-2 border border-input rounded-md text-sm focus:ring-2 focus:ring-primary"
              />
              <input
                type="password"
                name="password"
                placeholder="Şifre"
                className="w-full px-3 py-2 border border-input rounded-md text-sm focus:ring-2 focus:ring-primary"
              />
            </div>

            <button
              type="button"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 rounded-lg text-sm font-medium transition-colors"
            >
              Giriş Yap
            </button>
          </div>

          <div className="text-center text-sm">
            <Link href="/auth/forgot-password" className="text-primary hover:text-primary/90">
              Şifrenizi mi unuttunuz?
            </Link>
          </div>

          <div className="text-center text-sm">
            Hesabınız yok mu?{' '}
            <Link href="/auth/signup" className="font-medium text-primary hover:text-primary/90">
              Kayıt olun
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignInPage;