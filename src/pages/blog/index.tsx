// src/pages/blog/index.tsx
import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Filter, ArrowRight } from 'lucide-react';
import { blogPosts, ContentItem } from '@/data/content';
import BlogPostCard from '@/components/blog/BlogPostCard';

const BlogPage: NextPage = () => {
  // Kategoriler (daha sonra API'den çekilecek)
  const categories = [
    { id: 1, title: "Teknoloji", slug: "technology", count: 12 },
    { id: 2, title: "Yazılım", slug: "software", count: 15 },
    { id: 3, title: "Kariyer", slug: "career", count: 8 },
    { id: 4, title: "İpuçları", slug: "tips", count: 10 },
    { id: 5, title: "Güncel", slug: "news", count: 14 },
  ];

  // İçerik durumları
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [filteredPosts, setFilteredPosts] = useState<ContentItem[]>(blogPosts);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  
  // Arama ve filtreleme işlevi
  useEffect(() => {
    let result = [...blogPosts];
    
    // Arama terimine göre filtrele
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(post => 
        post.title.toLowerCase().includes(term) || 
        post.description.toLowerCase().includes(term)
      );
    }
    
    // Kategoriye göre filtrele
    if (activeCategory) {
      result = result.filter(post => 
        post.meta.category?.toLowerCase() === activeCategory.toLowerCase()
      );
    }
    
    setFilteredPosts(result);
    setCurrentPage(1); // Filtreleme yapıldığında ilk sayfaya dön
  }, [searchTerm, activeCategory]);
  
  // Sayfalama için mevcut sayfadaki gönderiler
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  
  // Toplam sayfa sayısı
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  
  // Sayfa değiştirme işlevi
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <>
      <Head>
        <title>Blog Yazıları - Tech Rehberi</title>
        <meta name="description" content="Teknoloji, yazılım ve dijital trendler hakkında güncel blog yazıları." />
        <meta property="og:title" content="Blog Yazıları - Tech Rehberi" />
        <meta property="og:description" content="Teknoloji, yazılım ve dijital trendler hakkında güncel blog yazıları." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/assets/images/og-blog.jpg" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="py-12 mb-8 border-b">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Blog Yazıları</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Teknoloji dünyasındaki son gelişmeler, yazılım ipuçları ve dijital trendler hakkında içerikler.
            </p>
            
            {/* Arama Formu */}
            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                placeholder="Blog yazılarında ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 pl-12 pr-4 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {filteredPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Öne Çıkan</h2>
            <BlogPostCard post={filteredPosts[0]} variant="featured" />
          </section>
        )}

        {/* Categories */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Kategoriler</h2>
            <Link href="/blog/categories" className="text-primary hover:underline flex items-center gap-1">
              <span>Tümünü Gör</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeCategory === null 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-accent hover:bg-accent/80'
              }`}
            >
              Tümü
            </button>
            
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.slug)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeCategory === category.slug 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-accent hover:bg-accent/80'
                }`}
              >
                {category.title}
                <span className="ml-2 text-xs opacity-70">({category.count})</span>
              </button>
            ))}
          </div>
          
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="w-4 h-4" />
              <span>Gösteriliyor: {filteredPosts.length} yazı</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sırala:</span>
              <select
                className="bg-background border border-input rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                defaultValue="latest"
              >
                <option value="latest">En Yeni</option>
                <option value="oldest">En Eski</option>
                <option value="popular">En Popüler</option>
              </select>
            </div>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="mb-12">
          {/* Sonuç Yoksa */}
          {currentPosts.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Sonuç Bulunamadı</h3>
              <p className="text-muted-foreground mb-4">
                Aradığınız kriterlere uygun blog yazısı bulunamadı.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setActiveCategory(null);
                }}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Filtreleri Temizle
              </button>
            </div>
          ) : (
            <>
              {/* Blog Post Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {currentPosts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <button
                    onClick={() => paginate(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    className="w-10 h-10 flex items-center justify-center rounded-md border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Önceki sayfa"
                  >
                    &laquo;
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => paginate(index + 1)}
                      className={`w-10 h-10 rounded-md ${
                        currentPage === index + 1
                          ? 'bg-primary text-primary-foreground'
                          : 'border hover:bg-accent'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => paginate(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 flex items-center justify-center rounded-md border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Sonraki sayfa"
                  >
                    &raquo;
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* Newsletter Signup */}
        <section className="bg-accent/50 rounded-xl p-8 mb-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-3">Bültenimize Abone Olun</h2>
            <p className="text-muted-foreground mb-6">
              En son blog yazılarını, güncellemeleri ve teknoloji haberlerini alın.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="flex-1 px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                Abone Ol
              </button>
            </div>
            
            <p className="text-xs text-muted-foreground mt-4">
              Abone olarak gizlilik politikamızı kabul etmiş olursunuz. İstediğiniz zaman abonelikten çıkabilirsiniz.
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default BlogPage;