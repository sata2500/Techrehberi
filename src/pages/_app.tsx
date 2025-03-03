import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import Script from 'next/script';
import { ThemeProvider } from '@/providers/theme-provider';
import { AuthProvider } from '@/contexts/auth-context';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer'; // Footer bileşenini import ediyoruz
import MobileNavBar from '@/components/layout/MobileNavBar';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Tech Rehberi - Teknoloji Haberleri ve Dijital Dönüşüm</title>
        <meta name="description" content="Güncel teknoloji haberleri, yazılım geliştirme ipuçları ve dijital dönüşüm rehberi." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="google-site-verification" content="google-site-verification=XXXXXXXXX" />
      </Head>
      
      {/* Google Analytics */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-LNJ2KXE7HW"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-LNJ2KXE7HW', {
              'anonymize_ip': true,
              'cookie_flags': 'SameSite=None;Secure'
            });
          `,
        }}
      />

      {/* Google AdSense */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9393909278390048"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      
      <AuthProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className={`${inter.className} flex flex-col min-h-screen`}>
            <Header />
            <main className="flex-grow pb-16 lg:pb-0">
              <Component {...pageProps} />
            </main>
            <Footer /> {/* Footer bileşenini ekliyoruz */}
            <MobileNavBar />
          </div>
        </ThemeProvider>
      </AuthProvider>
    </>
  );
}