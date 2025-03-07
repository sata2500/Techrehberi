// src/pages/blog/search.tsx
import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Search, Filter, ArrowLeft, Tag, X } from 'lucide-react';
import { blogPosts, searchContent, ContentItem } from '@/data/content';
import BlogPostCard from '@/components/blog/BlogPostCard';

// Kategoriler (daha sonra API'den gelecek)
const categories = [
  { id: 1, title: "Teknoloji", slug: "technology", count: 12 },
  { id: 2, title: "Yazılım", slug: "software", count: 15 },
  { id: 3, title: "Kariyer", slug: "career", count: 8 },
  { id: 4, title: "İpuçları", slug: "tips", count: 10 },
  { id: 5, title: "Güncel", slug: "news", count: 14 },
];

// Popüler etiketler (daha sonra API'den gelecek)
const popularTags = [
  "JavaScript", "React", "Node.js", "Python", "AI", "Flutter", "CSS", "TypeScript"
];

const SearchPage: NextPage = () => {
  const router = useRouter();
  const { q: queryParam, category: categoryParam, tag: tagParam } = router.query;
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<ContentItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 6;
  
  // URL parametrelerinden arama terimini ve filtreleri al
  useEffect(() => {
    if (router.isReady) {
      if (queryParam && typeof queryParam === 'string') {
        setSearchTerm(queryParam);
      }
      
      if (categoryParam && typeof categoryParam === 'string') {
        setSelectedCategory(categoryParam);
      }
      
      if (tagParam && typeof tagParam === 'string') {
        setSelectedTag(tagParam);
      }
    }
  }, [router.isReady, queryParam, categoryParam, tagParam]);
  
  // Arama yap
  useEffect(() => {
    if (!searchTerm && !selectedCategory && !selectedTag) {
      setSearchResults([]);
      return;
    }
    
    const performSearch = async () => {
      setIsSearching(true);
      
      try {
        // Arama işlemini simüle et (gerçek uygulamada API çağrısı yapılacak)
        let results = searchTerm 
          ? searchContent(searchTerm)
          : [...blogPosts];
        
        // Kategori filtresi
        if (selectedCategory) {
          const category = categories.find(c => c.slug === selectedCategory)?.title;
          results = results.filter(post => 
            post.meta.category?.toLowerCase() === category?.toLowerCase()
          );
        }
        
        // Etiket filtresi (düzeltilmiş)
        if (selectedTag) {
            results = results.filter(post => 
            post.tags?.some((tag: string) => tag.toLowerCase() === selectedTag.toLowerCase())
            );
        }
        
        // Sonuçları güncelle
        setSearchResults(results);
      } catch (error) {
        console.error("Arama hatası:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };
    
    // URL'i güncelle
    const queryParams = new URLSearchParams();
    if (searchTerm) queryParams.set('q', searchTerm);
    if (selectedCategory) queryParams.set('category', selectedCategory);
    if (selectedTag) queryParams.set('tag', selectedTag);
    
    const url = `/blog/search${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    router.push(url, undefined, { shallow: true });
    
    performSearch();
  }, [searchTerm, selectedCategory, selectedTag, router]);
  
  // Form gönderildiğinde
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem('search') as HTMLInputElement;
    
    setSearchTerm(input.value);
    setCurrentPage(1);
  };
  
  // Filtreleri temizle
  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedTag(null);
    
    if (!searchTerm) {
      router.push('/blog/search');
    } else {
      router.push(`/blog/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };
  
  // Sayfalama için mevcut sayfadaki sonuçlar
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = searchResults.slice(indexOfFirstResult, indexOfLastResult);
  
  // Toplam sayfa sayısı
  const totalPages = Math.ceil(searchResults.length / resultsPerPage);
  
  // Sayfa değiştirme
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  return (
    <>
      <Head>
        <title>
          {searchTerm 
            ? `"${searchTerm}" için Arama Sonuçları - Tech Rehberi Blog` 
            : 'Blog Araması - Tech Rehberi'}
        </title>
        <meta 
          name="description" 
          content={searchTerm 
            ? `"${searchTerm}" araması için blog yazıları ve içerikler.` 
            : 'Tech Rehberi blog içeriklerinde arama yapın.'}
        />
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
            <span className="text-foreground font-medium">Arama</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Arama ve Sonuçlar */}
          <div className="lg:col-span-2">
            {/* Arama Formu */}
            <div className="bg-card border rounded-xl p-6 mb-8">
              <h1 className="text-2xl font-bold mb-4">Blog Araması</h1>
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    name="search"
                    placeholder="Blog yazılarında ara..."
                    defaultValue={searchTerm}
                    className="w-full py-3 pl-12 pr-4 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchTerm("");
                        router.push(
                          selectedCategory || selectedTag 
                            ? `/blog/search?${selectedCategory ? `category=${selectedCategory}` : ''}${selectedTag ? `&tag=${selectedTag}` : ''}`
                            : '/blog/search'
                        );
                      }}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Ara
                  </button>
                </div>
              </form>
            </div>

            {/* Aktif Filtreler */}
            {(selectedCategory || selectedTag) && (
              <div className="flex items-center gap-2 mb-6 flex-wrap">
                <span className="text-sm text-muted-foreground">Aktif Filtreler:</span>
                
                {selectedCategory && (
                  <div className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                    <span>Kategori: {categories.find(c => c.slug === selectedCategory)?.title}</span>
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                
                {selectedTag && (
                  <div className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                    <span>Etiket: {selectedTag}</span>
                    <button
                      onClick={() => setSelectedTag(null)}
                      className="ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                
                <button
                  onClick={clearFilters}
                  className="text-sm text-muted-foreground hover:text-foreground underline"
                >
                  Filtreleri Temizle
                </button>
              </div>
            )}

            {/* Arama Sonuçları */}
            <div>
              {isSearching ? (
                <div className="flex justify-center py-12">
                  <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                </div>
              ) : searchResults.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">
                      {searchTerm 
                        ? `"${searchTerm}" için Sonuçlar` 
                        : selectedCategory || selectedTag 
                          ? 'Filtrelenmiş Sonuçlar'
                          : 'Tüm Blog Yazıları'}
                    </h2>
                    <span className="text-sm text-muted-foreground">
                      {searchResults.length} sonuç bulundu
                    </span>
                  </div>
                  
                  <div className="space-y-6 mb-8">
                    {currentResults.map(post => (
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
              ) : (
                searchTerm || selectedCategory || selectedTag ? (
                  <div className="text-center py-12 border rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Sonuç Bulunamadı</h3>
                    <p className="text-muted-foreground mb-4">
                      Arama kriterlerinize uygun içerik bulunamadı. Lütfen farklı anahtar kelimeler deneyiniz.
                    </p>
                    <button
                      onClick={clearFilters}
                      className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Filtreleri Temizle</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-semibold mb-2">Arama Yapmaya Başlayın</h3>
                    <p className="text-muted-foreground mb-4">
                      Blog yazılarında arama yapmak için yukarıdaki formu kullanın veya yandaki filtreleri deneyin.
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
          
          {/* Yan Panel - Filtreler */}
          <div className="lg:col-span-1">
            {/* Kategori Filtreleri */}
            <div className="bg-card border rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Kategoriler</h3>
                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="text-xs text-muted-foreground hover:text-foreground underline"
                  >
                    Temizle
                  </button>
                )}
              </div>
              
              <div className="space-y-1">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(
                      selectedCategory === category.slug ? null : category.slug
                    )}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between ${
                      selectedCategory === category.slug
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-accent'
                    }`}
                  >
                    <span>{category.title}</span>
                    <span className="text-xs text-muted-foreground">({category.count})</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Popüler Etiketler */}
            <div className="bg-card border rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Popüler Etiketler</h3>
                {selectedTag && (
                  <button
                    onClick={() => setSelectedTag(null)}
                    className="text-xs text-muted-foreground hover:text-foreground underline"
                  >
                    Temizle
                  </button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedTag(
                      selectedTag === tag ? null : tag
                    )}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm ${
                      selectedTag === tag
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-accent hover:bg-accent/80'
                    }`}
                  >
                    <Tag className="w-3 h-3" />
                    <span>{tag}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Blog Hızlı Bağlantılar */}
            <div className="bg-card border rounded-xl p-6">
              <h3 className="font-semibold mb-4">Hızlı Bağlantılar</h3>
              <div className="space-y-2">
                <Link href="/blog" className="flex items-center text-sm hover:text-primary transition-colors">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2.5"></span>
                  Blog Ana Sayfası
                </Link>
                <Link href="/blog/categories" className="flex items-center text-sm hover:text-primary transition-colors">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2.5"></span>
                  Tüm Kategoriler
                </Link>
                <Link href="/blog/latest" className="flex items-center text-sm hover:text-primary transition-colors">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2.5"></span>
                  En Son Yazılar
                </Link>
                <Link href="/blog/popular" className="flex items-center text-sm hover:text-primary transition-colors">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2.5"></span>
                  En Popüler İçerikler
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchPage;