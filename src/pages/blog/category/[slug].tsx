// src/pages/blog/category/[slug].tsx
import { useState } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ArrowLeft, Filter } from 'lucide-react';
import { blogPosts, ContentItem } from '@/data/content';
import BlogPostCard from '@/components/blog/BlogPostCard';

// Kategori bilgileri - gerçek uygulamada API'den gelecek
const categories = [
  { 
    id: 1, 
    title: "Teknoloji", 
    slug: "technology", 
    description: "En son teknoloji trendleri, yenilikler ve geleceğe dair öngörüler", 
    count: 12,
    image: "/assets/images/categories/technology.jpg",
    color: "bg-blue-500"
  },
  { 
    id: 2, 
    title: "Yazılım", 
    slug: "software", 
    description: "Programlama dilleri, yazılım geliştirme süreçleri ve best practice'ler", 
    count: 15,
    image: "/assets/images/categories/software.jpg",
    color: "bg-emerald-500"
  },
  { 
    id: 3, 
    title: "Kariyer", 
    slug: "career", 
    description: "Teknoloji alanında kariyer gelişimi, iş arama ve mülakat ipuçları", 
    count: 8,
    image: "/assets/images/categories/career.jpg",
    color: "bg-purple-500"
  },
  { 
    id: 4, 
    title: "İpuçları", 
    slug: "tips", 
    description: "Üretkenlik, verimlilik ve daha iyi kod yazma teknikleri", 
    count: 10,
    image: "/assets/images/categories/tips.jpg",
    color: "bg-amber-500"
  },
  { 
    id: 5, 
    title: "Güncel", 
    slug: "news", 
    description: "Teknoloji dünyasından en son haberler ve güncellemeler", 
    count: 14,
    image: "/assets/images/categories/news.jpg",
    color: "bg-red-500"
  },
];

interface CategoryPageProps {
  category: typeof categories[0];
  posts: ContentItem[];
}

const CategoryPage: NextPage<CategoryPageProps> = ({ category, posts }) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  
  // Eğer sayfa henüz oluşturulmadıysa, loading durumunu göster
  if (router.isFallback) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // Kategorinin bulunamadığı durumu kontrol et
  if (!category) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Kategori Bulunamadı</h1>
        <p className="text-muted-foreground mb-8">Aradığınız kategori bulunamadı veya kaldırılmış olabilir.</p>
        <Link
          href="/blog/categories"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tüm Kategorilere Dön</span>
        </Link>
      </div>
    );
  }

  // Sayfalama için mevcut sayfadaki gönderiler
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  
  // Toplam sayfa sayısı
  const totalPages = Math.ceil(posts.length / postsPerPage);
  
  // Sayfa değiştirme işlevi
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  return (
    <>
      <Head>
        <title>{category.title} - Blog Kategorisi | Tech Rehberi</title>
        <meta name="description" content={category.description} />
        <meta property="og:title" content={`${category.title} - Blog Kategorisi | Tech Rehberi`} />
        <meta property="og:description" content={category.description} />
        <meta property="og:image" content={category.image} />
      </Head>

      {/* Hero Banner */}
      <div className={`relative ${category.color} py-16`}>
        <div className="absolute inset-0 opacity-20 bg-pattern-grid"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-2 text-white/80 mb-4 text-sm">
            <Link href="/" className="hover:text-white transition-colors">
              Ana Sayfa
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-white transition-colors">
              Blog
            </Link>
            <span>/</span>
            <Link href="/blog/categories" className="hover:text-white transition-colors">
              Kategoriler
            </Link>
            <span>/</span>
            <span className="text-white font-medium">{category.title}</span>
          </div>

          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-white mb-3">
              {category.title}
            </h1>
            <p className="text-lg text-white/90 mb-6">
              {category.description}
            </p>

            <div className="inline-block bg-white/20 backdrop-blur-sm text-white rounded-full px-4 py-1 text-sm">
              {posts.length} yazı bulundu
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="w-4 h-4" />
            <span>Gösteriliyor: {posts.length} yazı</span>
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

        {/* Blog Posts */}
        {posts.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Bu Kategoride Yazı Bulunamadı</h3>
            <p className="text-muted-foreground mb-4">
              Henüz bu kategoride yayınlanmış bir yazı bulunmuyor.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Tüm Yazılara Dön</span>
            </Link>
          </div>
        ) : (
          <>
            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
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

        {/* Other Categories */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Diğer Kategoriler</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {categories
              .filter(cat => cat.id !== category.id)
              .slice(0, 4)
              .map(cat => (
                <Link 
                  key={cat.id}
                  href={`/blog/category/${cat.slug}`}
                  className="group flex items-center gap-3 bg-card border rounded-lg p-4 hover:shadow-md transition-all duration-300"
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium group-hover:text-primary transition-colors">{cat.title}</h3>
                    <p className="text-xs text-muted-foreground">{cat.count} yazı</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = categories.map((category) => ({
    params: { slug: category.slug },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  
  // Kategoriyi bul
  const category = categories.find((cat) => cat.slug === slug);
  
  if (!category) {
    return {
      notFound: true,
    };
  }
  
  // Bu kategorideki yazıları filtrele
  // Not: Gerçek uygulamada API'den filtrelenmiş veri çekilecek
  const categoryPosts = blogPosts.filter(
    (post) => post.meta.category?.toLowerCase() === category.title.toLowerCase()
  );
  
  return {
    props: {
      category,
      posts: categoryPosts
    },
    revalidate: 3600, // Her saat başı yeniden oluştur
  };
};

export default CategoryPage;