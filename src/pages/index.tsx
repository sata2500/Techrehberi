import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Components
import HeroSlider from '@/components/home/HeroSlider';
import ScrollSection from '@/components/home/ScrollSection';
import ContentGuide from '@/components/home/ContentGuide';

// Data
import { slides } from '@/data/slides';
import { 
  latestContent, 
  popularContent,
  techUpdates,
  recommendedCourses,
  blogPosts 
} from '@/data/content';

const HomePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Tech Rehberi - Teknoloji ve Dijital Yaşam Platformu</title>
        <meta 
          name="description" 
          content="Güncel teknoloji haberleri, yazılım eğitimleri, dijital dünyadan haberler ve çok daha fazlası. Yazılım, web geliştirme, yapay zeka ve teknoloji eğitimleri." 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Open Graph / Social Media Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.techrehberi.com/" />
        <meta property="og:title" content="Tech Rehberi - Teknoloji ve Dijital Yaşam Platformu" />
        <meta property="og:description" content="Güncel teknoloji haberleri, yazılım eğitimleri, dijital dünyadan haberler ve çok daha fazlası." />
        <meta property="og:image" content="https://www.techrehberi.com/assets/images/og-image.jpg" />
        
        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Tech Rehberi - Teknoloji ve Dijital Yaşam Platformu" />
        <meta name="twitter:description" content="Güncel teknoloji haberleri, yazılım eğitimleri, dijital dünyadan haberler ve çok daha fazlası." />
        <meta name="twitter:image" content="https://www.techrehberi.com/assets/images/twitter-image.jpg" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://www.techrehberi.com/" />
        
        {/* Keywords */}
        <meta name="keywords" content="yazılım, programlama, teknoloji, web geliştirme, yapay zeka, dijital dönüşüm, mobil uygulama, veri bilimi" />
        
        {/* Language */}
        <meta httpEquiv="content-language" content="tr-TR" />
        
        {/* Robots directives */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      </Head>

      <main aria-label="Ana İçerik">
        {/* Hero Bölümü */}
        <HeroSlider slides={slides} />

        {/* Hızlı Erişim (Eski İçerik Rehberi) */}
        <ContentGuide />

        {/* Son Eklenenler 
        <ScrollSection
          title="En Son Eklenenler"
          items={latestContent}
        />*/}

        {/* Popüler İçerikler 
        <ScrollSection
          title="Popüler İçerikler"
          items={popularContent}
        />*/}

        {/* Teknolojik Gelişmeler 
        <ScrollSection
          title="Teknolojik Gelişmeler"
          items={techUpdates}
        />*/}

        {/* Önerilen Kurslar 
        <ScrollSection
          title="Önerilen Kurslar"
          items={recommendedCourses}
        />*/}

        {/* Blog Önerileri */}
        <ScrollSection
          title="Blog Önerileri"
          items={blogPosts}
        />

        {/* Teknoloji Dünyasını Keşfedin CTA bölümü kaldırıldı */}
      </main>
    </>
  );
};

export default HomePage;