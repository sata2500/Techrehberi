// src/pages/_app.tsx
import type { AppProps } from 'next/app';
import type { NextPage } from 'next';
import { ReactElement, ReactNode } from 'react';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import Script from 'next/script';
import { ThemeProvider } from '@/providers/theme-provider';
import { AuthProvider } from '@/contexts/auth-context';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileNavBar from '@/components/layout/MobileNavBar';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

// Özel layout kullanan sayfalar için tip tanımı
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

// Layout destekli AppProps
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Sayfa seviyesinde tanımlanan layout'u kullan
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        <title>Tech Rehberi - Teknoloji Haberleri ve Dijital Dönüşüm</title>
        <meta name="description" content="Güncel teknoloji haberleri, yazılım geliştirme ipuçları ve dijital dönüşüm rehberi." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="google-site-verification" content="google-site-verification=XXXXXXXXX" />
      </Head>
      
      {/* Google Analytics ve diğer scriptler... */}
      
      <AuthProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {getLayout(
            Component.getLayout ? (
              <Component {...pageProps} />
            ) : (
              <div className={`${inter.className} flex flex-col min-h-screen`}>
                <Header />
                <main className="flex-grow pb-16 lg:pb-0">
                  <Component {...pageProps} />
                </main>
                <Footer />
                <MobileNavBar />
              </div>
            )
          )}
        </ThemeProvider>
      </AuthProvider>
    </>
  );
}