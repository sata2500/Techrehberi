// src/data/slides.ts

export interface Slide {
    id: number;
    title: string;
    description: string;
    image: string;
    slug: string;
    category?: string;
    readTime?: string;
    publishDate?: string;
  }
  
  export const slides: Slide[] = [
    {
      id: 1,
      title: "Bloglar Yayında",
      description: "2024'ün öne çıkan blog yazıları, teknoloji ve geliştirmeye dair herşey",
      image: "/assets/images/banners/banner-home-slider-1.webp",
      slug: "bloglar-yayinda",
      category: "Blog",/*
      readTime: "10 dk",
      publishDate: "9 Ocak 2024"*/
    },/*
    {
      id: 2,
      title: "Mobil Uygulama Geliştirme",
      description: "Cross-platform geliştirme araçları ve en iyi uygulamalar",
      image: "/assets/images/banners/banner-home-slider-2.webp",
      slug: "mobil-uygulama-gelistirme",
      category: "Mobil Geliştirme",
      readTime: "8 dk",
      publishDate: "8 Ocak 2024"
    },
    {
      id: 3,
      title: "Yapay Zeka ve Veri Bilimi",
      description: "Modern veri analizi ve yapay zeka uygulamaları",
      image: "/assets/images/banners/banner-home-slider-3.webp",
      slug: "yapay-zeka-ve-veri-bilimi",
      category: "Yapay Zeka",
      readTime: "12 dk",
      publishDate: "7 Ocak 2024"
    },
    {
      id: 4,
      title: "Siber Güvenlik",
      description: "Güncel güvenlik tehditleri ve koruma yöntemleri",
      image: "/assets/images/banners/banner-home-slider-4.webp",
      slug: "siber-guvenlik",
      category: "Güvenlik",
      readTime: "15 dk",
      publishDate: "6 Ocak 2024"
    },
    {
      id: 5,
      title: "Cloud Computing",
      description: "Bulut teknolojileri ve modern altyapı çözümleri",
      image: "/assets/images/banners/banner-home-slider-5.webp",
      slug: "cloud-computing",
      category: "Cloud",
      readTime: "10 dk",
      publishDate: "5 Ocak 2024"
    },
    {
      id: 6,
      title: "DevOps Pratikleri",
      description: "Sürekli entegrasyon ve dağıtım süreçleri",
      image: "/assets/images/banners/banner-home-slider-6.webp",
      slug: "devops-pratikleri",
      category: "DevOps",
      readTime: "11 dk",
      publishDate: "4 Ocak 2024"
    },
    {
      id: 7,
      title: "Blockchain Teknolojileri",
      description: "Dağıtık sistemler ve kripto uygulamaları",
      image: "/assets/images/banners/banner-home-slider-7.webp",
      slug: "blockchain-teknolojileri",
      category: "Blockchain",
      readTime: "13 dk",
      publishDate: "3 Ocak 2024"
    },
    {
      id: 8,
      title: "Blockchain Teknolojileri Deneme",
      description: "Dağıtık sistemler ve kripto uygulamaları",
      image: "/assets/images/banners/banner-home-slider-8.webp",
      slug: "blockchain-teknolojileri",
      category: "Blockchain",
      readTime: "13 dk",
      publishDate: "3 Ocak 2024"
    }*/
  ];
  
  // Yardımcı fonksiyonlar
  export function getSlideBySlug(slug: string): Slide | undefined {
    return slides.find(slide => slide.slug === slug);
  }
  
  export function getRelatedSlides(currentSlug: string, limit: number = 2): Slide[] {
    return slides
      .filter(slide => slide.slug !== currentSlug)
      .slice(0, limit);
  }
  
  export function getLatestSlides(limit: number = 5): Slide[] {
    return [...slides]
      .sort((a, b) => new Date(b.publishDate!).getTime() - new Date(a.publishDate!).getTime())
      .slice(0, limit);
  }