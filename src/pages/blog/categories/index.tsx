// src/pages/blog/categories/index.tsx
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, FileText, Tag, Bookmark } from 'lucide-react';

// Tüm kategorilerin listesi - daha sonra API'den çekilecek
const categories = [
  { 
    id: 1, 
    title: "Teknoloji", 
    slug: "technology", 
    description: "En son teknoloji trendleri, yenilikler ve geleceğe dair öngörüler", 
    count: 12,
    image: "/assets/images/categories/technology.jpg"
  },
  { 
    id: 2, 
    title: "Yazılım", 
    slug: "software", 
    description: "Programlama dilleri, yazılım geliştirme süreçleri ve best practice'ler", 
    count: 15,
    image: "/assets/images/categories/software.jpg"
  },
  { 
    id: 3, 
    title: "Kariyer", 
    slug: "career", 
    description: "Teknoloji alanında kariyer gelişimi, iş arama ve mülakat ipuçları", 
    count: 8,
    image: "/assets/images/categories/career.jpg"
  },
  { 
    id: 4, 
    title: "İpuçları", 
    slug: "tips", 
    description: "Üretkenlik, verimlilik ve daha iyi kod yazma teknikleri", 
    count: 10,
    image: "/assets/images/categories/tips.jpg"
  },
  { 
    id: 5, 
    title: "Güncel", 
    slug: "news", 
    description: "Teknoloji dünyasından en son haberler ve güncellemeler", 
    count: 14,
    image: "/assets/images/categories/news.jpg"
  },
  { 
    id: 6, 
    title: "Web Geliştirme", 
    slug: "web-development", 
    description: "Frontend, backend ve fullstack web geliştirme içerikleri", 
    count: 18,
    image: "/assets/images/categories/web-dev.jpg"
  },
  { 
    id: 7, 
    title: "Mobil", 
    slug: "mobile", 
    description: "Mobil uygulama geliştirme, tasarım ve kullanıcı deneyimi", 
    count: 7,
    image: "/assets/images/categories/mobile.jpg"
  },
  { 
    id: 8, 
    title: "Yapay Zeka", 
    slug: "artificial-intelligence", 
    description: "Yapay zeka, makine öğrenimi ve veri bilimi", 
    count: 9,
    image: "/assets/images/categories/ai.jpg"
  },
];

const CategoriesPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Blog Kategorileri - Tech Rehberi</title>
        <meta name="description" content="Tech Rehberi blog kategorileri - teknoloji, yazılım, kariyer ve daha fazlası." />
        <meta property="og:title" content="Blog Kategorileri - Tech Rehberi" />
        <meta property="og:description" content="Tech Rehberi blog kategorileri - teknoloji, yazılım, kariyer ve daha fazlası." />
        <meta property="og:type" content="website" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Ana Sayfa
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
              Blog
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">Kategoriler</span>
          </div>
        </div>

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Blog Kategorileri</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            İlgilendiğiniz konuları keşfedin ve alanınızdaki en son gelişmeleri takip edin.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.map((category) => (
            <Link 
              key={category.id}
              href={`/blog/category/${category.slug}`}
              className="group bg-card border rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 h-full"
            >
              <div className="relative h-48">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-white">{category.title}</h2>
                      <span className="bg-primary/80 text-primary-foreground text-xs rounded-full px-2 py-1 backdrop-blur-sm">
                        {category.count} yazı
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {category.description}
                </p>
                <span className="inline-flex items-center gap-1 text-sm text-primary font-medium">
                  İçerikleri Gör
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Topics */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Popüler Konular</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold">Öne Çıkan Yazılar</h3>
              </div>
              <ul className="space-y-3">
                <li>
                  <Link href="/blog/category/technology/web3-blockchain" className="flex items-center text-sm hover:text-primary transition-colors">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2.5"></span>
                    Web 3.0 ve Blockchain Geleceği
                  </Link>
                </li>
                <li>
                  <Link href="/blog/category/software/clean-code-prensipleri" className="flex items-center text-sm hover:text-primary transition-colors">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2.5"></span>
                    Clean Code Prensipleri
                  </Link>
                </li>
                <li>
                  <Link href="/blog/category/tips/verimlilik" className="flex items-center text-sm hover:text-primary transition-colors">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2.5"></span>
                    Yazılımcılar İçin Verimlilik İpuçları
                  </Link>
                </li>
                <li>
                  <Link href="/blog/category/career/yazilim-muhendisi" className="flex items-center text-sm hover:text-primary transition-colors">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2.5"></span>
                    Yazılım Mühendisi Kariyer Rehberi
                  </Link>
                </li>
                <li>
                  <Link href="/blog/category/tech/web3" className="flex items-center text-sm hover:text-primary transition-colors">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2.5"></span>
                    2025 Teknoloji Trendleri
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="bg-card border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Tag className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold">Popüler Etiketler</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href="/blog/tag/javascript" className="bg-accent px-3 py-1.5 rounded-full text-sm hover:bg-accent/80 transition-colors">
                  JavaScript
                </Link>
                <Link href="/blog/tag/python" className="bg-accent px-3 py-1.5 rounded-full text-sm hover:bg-accent/80 transition-colors">
                  Python
                </Link>
                <Link href="/blog/tag/react" className="bg-accent px-3 py-1.5 rounded-full text-sm hover:bg-accent/80 transition-colors">
                  React
                </Link>
                <Link href="/blog/tag/nextjs" className="bg-accent px-3 py-1.5 rounded-full text-sm hover:bg-accent/80 transition-colors">
                  Next.js
                </Link>
                <Link href="/blog/tag/nodejs" className="bg-accent px-3 py-1.5 rounded-full text-sm hover:bg-accent/80 transition-colors">
                  Node.js
                </Link>
                <Link href="/blog/tag/ai" className="bg-accent px-3 py-1.5 rounded-full text-sm hover:bg-accent/80 transition-colors">
                  Yapay Zeka
                </Link>
                <Link href="/blog/tag/cloud" className="bg-accent px-3 py-1.5 rounded-full text-sm hover:bg-accent/80 transition-colors">
                  Cloud
                </Link>
                <Link href="/blog/tag/devops" className="bg-accent px-3 py-1.5 rounded-full text-sm hover:bg-accent/80 transition-colors">
                  DevOps
                </Link>
                <Link href="/blog/tag/backend" className="bg-accent px-3 py-1.5 rounded-full text-sm hover:bg-accent/80 transition-colors">
                  Backend
                </Link>
                <Link href="/blog/tag/frontend" className="bg-accent px-3 py-1.5 rounded-full text-sm hover:bg-accent/80 transition-colors">
                  Frontend
                </Link>
                <Link href="/blog/tag/mobile" className="bg-accent px-3 py-1.5 rounded-full text-sm hover:bg-accent/80 transition-colors">
                  Mobil
                </Link>
                <Link href="/blog/tag/tips" className="bg-accent px-3 py-1.5 rounded-full text-sm hover:bg-accent/80 transition-colors">
                  İpuçları
                </Link>
              </div>
            </div>
            
            <div className="bg-card border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Bookmark className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold">İçerik Serilerimiz</h3>
              </div>
              <ul className="space-y-3">
                <li>
                  <Link href="/blog/series/javascript-temelleri" className="flex items-center text-sm hover:text-primary transition-colors">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2.5"></span>
                    JavaScript Temelleri (5 bölüm)
                  </Link>
                </li>
                <li>
                  <Link href="/blog/series/react-hooks" className="flex items-center text-sm hover:text-primary transition-colors">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2.5"></span>
                    React Hooks Detaylı Rehber (8 bölüm)
                  </Link>
                </li>
                <li>
                  <Link href="/blog/series/yapay-zeka-101" className="flex items-center text-sm hover:text-primary transition-colors">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2.5"></span>
                    Yapay Zeka 101 (4 bölüm)
                  </Link>
                </li>
                <li>
                  <Link href="/blog/series/cloud-platformlari" className="flex items-center text-sm hover:text-primary transition-colors">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2.5"></span>
                    Cloud Platformları Karşılaştırma (3 bölüm)
                  </Link>
                </li>
                <li>
                  <Link href="/blog/series/tech-kariyeri" className="flex items-center text-sm hover:text-primary transition-colors">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2.5"></span>
                    Teknoloji Kariyerine Başlangıç (6 bölüm)
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Back to Blog */}
        <div className="flex justify-center">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Blog Ana Sayfasına Dön</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default CategoriesPage;