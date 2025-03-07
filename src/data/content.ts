// src/data/content.ts

export interface ContentMeta {
    date?: string;
    category?: string;
    views?: string;
    duration?: string;
    level?: string;
    author?: string;
    readTime?: string;
  }
  
  export interface ContentItem {
    id: number;
    title: string;
    description: string;
    image: string;
    slug?: string;
    meta: ContentMeta;
    tags?: string[]; // tags özelliğini ekledik
  }
  
  // En Son Eklenenler
  export const latestContent: ContentItem[] = [
    {
      id: 1,
      title: "React ile Modern Web Uygulamaları",
      description: "Yeni başlayanlar için kapsamlı React.js rehberi",
      image: "/assets/images/courses/react-course-banner.webp",
      meta: {
        date: "2 saat önce",
        category: "Web Geliştirme"
      },
      slug: "react-modern-web-uygulamalari"
    },
    {
      id: 2,
      title: "Python ile Veri Analizi",
      description: "Pandas ve NumPy kullanarak veri manipülasyonu",
      image: "/assets/images/courses/python-programming-banner.webp",
      meta: {
        date: "3 saat önce",
        category: "Veri Bilimi"
      },
      slug: "python-veri-analizi"
    },
    {
      id: 3,
      title: "Flutter ile Mobil Uygulama",
      description: "Cross-platform mobil uygulama geliştirme",
      image: "/assets/images/courses/flutter-devloping-banner.webp",
      meta: {
        date: "5 saat önce",
        category: "Mobil Geliştirme"
      },
      slug: "flutter-mobil-uygulama"
    },
    {
      id: 4,
      title: "DevOps Temelleri",
      description: "CI/CD pipeline oluşturma ve yönetimi",
      image: "/assets/images/courses/devops-practices-banner.webp",
      meta: {
        date: "6 saat önce",
        category: "DevOps"
      },
      slug: "devops-temelleri"
    }
  ];
  
  // En Çok Okunanlar
  export const popularContent: ContentItem[] = [
    {
      id: 1,
      title: "Yapay Zeka ve Makine Öğrenimi",
      description: "Başlangıç seviyesinden ileri seviyeye ML yolculuğu",
      image: "/assets/images/popular/ai-ml-banner.webp",
      meta: {
        views: "12.5K görüntülenme",
        category: "Yapay Zeka"
      },
      slug: "yapay-zeka-makine-ogrenimi"
    },
    {
      id: 2,
      title: "Web Uygulamaları Güvenliği",
      description: "Modern web güvenliği ve OWASP Top 10",
      image: "/assets/images/popular/web-security-banner.webp",
      meta: {
        views: "10.2K görüntülenme",
        category: "Güvenlik"
      },
      slug: "web-uygulamalari-guvenligi"
    },
    {
      id: 3,
      title: "AWS Cloud Practitioner",
      description: "AWS sertifikasyon hazırlık rehberi",
      image: "/assets/images/popular/aws-cloud-banner.webp",
      meta: {
        views: "9.8K görüntülenme",
        category: "Cloud"
      },
      slug: "aws-cloud-practitioner"
    },
    {
      id: 4,
      title: "Modern UI/UX Tasarım",
      description: "Kullanıcı deneyimi ve arayüz tasarımı",
      image: "/assets/images/popular/uiux-design-banner.webp",
      meta: {
        views: "8.7K görüntülenme",
        category: "Tasarım"
      },
      slug: "modern-uiux-tasarim"
    }
  ];
  
  // Teknolojik Gelişmeler
  export const techUpdates: ContentItem[] = [
    {
      id: 1,
      title: "Quantum Bilgisayarlar",
      description: "Geleceğin bilgisayar teknolojileri",
      image: "/assets/images/tech/quantum-computing-banner.webp",
      meta: {
        date: "3 gün önce",
        category: "Teknoloji"
      },
      slug: "quantum-bilgisayarlar"
    },
    {
      id: 2,
      title: "5G ve Ötesi",
      description: "Yeni nesil iletişim teknolojileri",
      image: "/assets/images/tech/5g-network-banner.webp",
      meta: {
        date: "4 gün önce",
        category: "Telekomünikasyon"
      },
      slug: "5g-ve-otesi"
    },
    {
      id: 3,
      title: "AR ve VR Gelişmeleri",
      description: "Artırılmış ve sanal gerçeklik uygulamaları",
      image: "/assets/images/tech/ar-vr-banner.webp",
      meta: {
        date: "5 gün önce",
        category: "AR/VR"
      },
      slug: "ar-vr-gelismeleri"
    },
    {
      id: 4,
      title: "IoT ve Akıllı Sistemler",
      description: "Nesnelerin interneti ve akıllı cihazlar",
      image: "/assets/images/tech/iot-smart-banner.webp",
      meta: {
        date: "6 gün önce",
        category: "IoT"
      },
      slug: "iot-akilli-sistemler"
    }
  ];
  
  // Önerilen Kurslar
  export const recommendedCourses: ContentItem[] = [
    {
      id: 1,
      title: "iOS Uygulama Geliştirme",
      description: "Swift ile mobil uygulama geliştirme",
      image: "/assets/images/courses/ios-dev-banner.webp",
      meta: {
        duration: "40 saat",
        level: "Orta Seviye"
      },
      slug: "ios-uygulama-gelistirme"
    },
    {
      id: 2,
      title: "Node.js ile Backend",
      description: "Modern backend geliştirme teknikleri",
      image: "/assets/images/courses/nodejs-backend-banner.webp",
      meta: {
        duration: "35 saat",
        level: "İleri Seviye"
      },
      slug: "nodejs-backend"
    },
    {
      id: 3,
      title: "Vue.js 3 Masterclass",
      description: "Composition API ve modern Vue teknikleri",
      image: "/assets/images/courses/vuejs-master-banner.webp",
      meta: {
        duration: "30 saat",
        level: "İleri Seviye"
      },
      slug: "vuejs-masterclass"
    },
    {
      id: 4,
      title: "Django Web Framework",
      description: "Python ile web uygulamaları geliştirme",
      image: "/assets/images/courses/django-web-banner.webp",
      meta: {
        duration: "45 saat",
        level: "Başlangıç"
      },
      slug: "django-web-framework"
    }
  ];
  
  // Blog Önerileri
  export const blogPosts: ContentItem[] = [
    {
      id: 1,
      title: "Web 3.0 ve Blockchain",
      description: "Geleceğin internet teknolojileri",
      image: "/assets/images/blog/blog-career-yazilim-muhendisi.webp",
      meta: {
        author: "Ahmet Yılmaz",
        readTime: "10 dk okuma"
      },
      slug: "web3-blockchain"
    },
    {
      id: 2,
      title: "Clean Code Prensipleri",
      description: "Daha iyi kod yazma teknikleri",
      image: "/assets/images/blog/blog-software-clean-code.webp",
      meta: {
        author: "Mehmet Demir",
        readTime: "15 dk okuma"
      },
      slug: "clean-code-prensipleri"
    },
    {
      id: 3,
      title: "Microservices Mimarisi",
      description: "Modern uygulama mimarileri",
      image: "/assets/images/blog/blog-tips-verimlilik.webp",
      meta: {
        author: "Ayşe Kara",
        readTime: "12 dk okuma"
      },
      slug: "microservices-mimarisi"
    },
    {
      id: 4,
      title: "Frontend Trendleri",
      description: "2024'ün öne çıkan frontend teknolojileri",
      image: "/assets/images/blog/blog-tech-web3.webp",
      meta: {
        author: "Can Yıldız",
        readTime: "8 dk okuma"
      },
      slug: "frontend-trendleri"
    }
  ];
  
  // Yardımcı fonksiyonlar
  export function getContentBySlug(slug: string): ContentItem | undefined {
    const allContent = [
      ...latestContent,
      ...popularContent,
      ...techUpdates,
      //...recommendedCourses,
      ...blogPosts
    ];
    return allContent.find(item => item.slug === slug);
  }
  
  export function getLatestContent(limit: number = 4): ContentItem[] {
    return latestContent.slice(0, limit);
  }
  
  export function getPopularContent(limit: number = 4): ContentItem[] {
    return popularContent.slice(0, limit);
  }
  
  export function getContentByCategory(category: string): ContentItem[] {
    const allContent = [
      ...latestContent,
      ...popularContent,
      ...techUpdates,
      //...recommendedCourses,
      ...blogPosts
    ];
    return allContent.filter(item => item.meta.category === category);
  }
  
  export function getRelatedContent(currentSlug: string, limit: number = 3): ContentItem[] {
    const currentItem = getContentBySlug(currentSlug);
    if (!currentItem?.meta.category) return [];
  
    return getContentByCategory(currentItem.meta.category)
      .filter(item => item.slug !== currentSlug)
      .slice(0, limit);
  }
  
  export function searchContent(query: string): ContentItem[] {
    const allContent = [
      ...latestContent,
      ...popularContent,
      ...techUpdates,
      //...recommendedCourses,
      ...blogPosts
    ];
    
    const searchString = query.toLowerCase();
    return allContent.filter(item => 
      item.title.toLowerCase().includes(searchString) ||
      item.description.toLowerCase().includes(searchString) ||
      item.meta.category?.toLowerCase().includes(searchString)
    );
  }