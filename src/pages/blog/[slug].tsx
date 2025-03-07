// src/pages/blog/[slug].tsx
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Eye, 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Bookmark 
} from 'lucide-react';
import { blogPosts, getContentBySlug, getRelatedContent } from '@/data/content';

interface BlogPostProps {
  post: any;
  relatedPosts: any[];
}

const BlogPostPage: NextPage<BlogPostProps> = ({ post, relatedPosts }) => {
  const router = useRouter();

  // Eğer sayfa henüz oluşturulmadıysa, loading durumunu göster
  if (router.isFallback) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // Yazı bulunamadıysa 404 göster
  if (!post) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">İçerik Bulunamadı</h1>
        <p className="text-muted-foreground mb-8">Aradığınız blog yazısı bulunamadı veya kaldırılmış olabilir.</p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Blog Ana Sayfasına Dön</span>
        </Link>
      </div>
    );
  }

  // Meta açıklaması için içerik özetini kullan
  const metaDescription = post.description || 'Tech Rehberi blog yazısı';

  return (
    <>
      <Head>
        <title>{post.title} - Tech Rehberi</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={`${post.title} - Tech Rehberi`} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={post.image} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.meta.date || new Date().toISOString()} />
        <meta property="article:author" content={post.meta.author || 'Tech Rehberi'} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className="bg-muted py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Ana Sayfa
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
              Blog
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium truncate max-w-[200px]">{post.title}</span>
          </div>
        </div>
      </div>

      <article className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Başlık ve Meta Bilgiler */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {post.meta.author && (
                <div className="flex items-center gap-2">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted">
                    {/* Yazar avatarı (varsayılan) */}
                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-medium">
                      {post.meta.author.charAt(0)}
                    </div>
                  </div>
                  <span>{post.meta.author}</span>
                </div>
              )}
              
              {post.meta.date && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{post.meta.date}</span>
                </div>
              )}
              
              {post.meta.readTime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{post.meta.readTime}</span>
                </div>
              )}
              
              {post.meta.category && (
                <Link 
                  href={`/blog/category/${post.meta.category.toLowerCase().replace(/\s+/g, '-')}`}
                  className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs hover:bg-primary/20 transition-colors"
                >
                  {post.meta.category}
                </Link>
              )}
            </div>
          </div>
          
          {/* Kapak Resmi */}
          <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-8">
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              className="object-cover"
            />
          </div>
          
          {/* İçerik */}
            <div className="prose prose-lg max-w-none mb-8">
            {/* Örnek içerik, gerçek içerik HTML olarak enjekte edilmeli */}
            <p className="lead">{post.description}</p>
            
            <p>Bu içerik dinamik olarak üretilecektir. Şu an için sadece tasarım amaçlı bir örnek gösterilmektedir.</p>
            
            <h2>İçerik Bölümü 1</h2>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac aliquam volutpat, nisl sapien lacinia nisl, 
                vel placerat nisl nisl in nisl. Nullam auctor, nisl ac aliquam volutpat, nisl sapien lacinia nisl, vel placerat nisl nisl in nisl.
            </p>
            
            <blockquote>
                Important note or quote that stands out from the rest of the content. This helps break up the text and highlight key points.
            </blockquote>
            
            <h2>İçerik Bölümü 2</h2>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac aliquam volutpat, nisl sapien lacinia nisl, 
                vel placerat nisl nisl in nisl. Nullam auctor, nisl ac aliquam volutpat, nisl sapien lacinia nisl, vel placerat nisl nisl in nisl.
            </p>
            
            <ul>
                <li>Birinci madde örneği</li>
                <li>İkinci madde örneği</li>
                <li>Üçüncü madde örneği</li>
            </ul>
            
            <h3>Alt Başlık Örneği</h3>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac aliquam volutpat, nisl sapien lacinia nisl, 
                vel placerat nisl nisl in nisl. Nullam auctor, nisl ac aliquam volutpat, nisl sapien lacinia nisl, vel placerat nisl nisl in nisl.
            </p>
            
            <pre><code className="language-javascript">{`
                // Örnek kod bloğu
                function exampleFunction() {
                console.log('Hello, World!');
                return true;
                }
            `}</code></pre>
            </div>
          
          {/* Paylaşım ve Etiketler */}
          <div className="border-t border-b py-4 mb-8">
            <div className="flex flex-wrap justify-between items-center gap-4">
              {/* Etiketler */}
              <div className="flex flex-wrap gap-2">
                {post.tags ? (
                  post.tags.map((tag: string, index: number) => (
                    <Link
                      key={index}
                      href={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                      className="bg-accent px-3 py-1 rounded-full text-xs hover:bg-accent/80 transition-colors"
                    >
                      {tag}
                    </Link>
                  ))
                ) : (
                  // Örnek etiketler
                  <>
                    <Link href="/blog/tag/technology" className="bg-accent px-3 py-1 rounded-full text-xs hover:bg-accent/80 transition-colors">
                      Teknoloji
                    </Link>
                    <Link href="/blog/tag/software" className="bg-accent px-3 py-1 rounded-full text-xs hover:bg-accent/80 transition-colors">
                      Yazılım
                    </Link>
                    <Link href="/blog/tag/web" className="bg-accent px-3 py-1 rounded-full text-xs hover:bg-accent/80 transition-colors">
                      Web
                    </Link>
                  </>
                )}
              </div>
              
              {/* Paylaşım Butonları */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Paylaş:</span>
                <button
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                  className="p-2 rounded-full hover:bg-accent transition-colors"
                  aria-label="Facebook'ta Paylaş"
                >
                  <Facebook className="w-4 h-4" />
                </button>
                <button
                  onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, '_blank')}
                  className="p-2 rounded-full hover:bg-accent transition-colors"
                  aria-label="Twitter'da Paylaş"
                >
                  <Twitter className="w-4 h-4" />
                </button>
                <button
                  onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(post.title)}`, '_blank')}
                  className="p-2 rounded-full hover:bg-accent transition-colors"
                  aria-label="LinkedIn'de Paylaş"
                >
                  <Linkedin className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: post.title,
                        text: post.description,
                        url: window.location.href,
                      });
                    }
                  }}
                  className="p-2 rounded-full hover:bg-accent transition-colors"
                  aria-label="Paylaş"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  className="p-2 rounded-full hover:bg-accent transition-colors"
                  aria-label="Kaydet"
                >
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Yazar Hakkında */}
          <div className="bg-card border rounded-xl p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden">
                {/* Yazar avatarı (varsayılan) */}
                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-xl font-medium">
                  {post.meta.author ? post.meta.author.charAt(0) : 'A'}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">{post.meta.author || 'Yazar'}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Yazılım geliştirici, teknoloji meraklısı ve blog yazarı. Web teknolojileri, yapay zeka ve dijital dönüşüm konularında içerik üretiyorum.
                </p>
                <div className="flex gap-2">
                  <Link href="/blog/author/yazar-slug" className="text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                    Tüm Yazıları Gör
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* İlgili Yazılar */}
          {relatedPosts && relatedPosts.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">İlgili Yazılar</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`} className="group">
                    <div className="relative aspect-[3/2] rounded-lg overflow-hidden mb-3">
                      <Image
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                      {relatedPost.title}
                    </h3>
                    {relatedPost.meta.author && (
                      <p className="text-sm text-muted-foreground">
                        {relatedPost.meta.author}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  // Var olan tüm blog yazılarının slug'larını çıkart
  const paths = blogPosts.map((post) => ({
    params: { slug: post.slug },
  }));

  return {
    paths,
    // fallback: true ile diğer slug'lar da çalışabilir
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  
  // Verilen slug'a göre blog yazısını getir
  const post = getContentBySlug(slug);
  
  // Eğer yazı bulunamadıysa 404 döndür
  if (!post) {
    return {
      notFound: true,
    };
  }
  
  // İlgili yazıları getir
  const relatedPosts = getRelatedContent(slug, 3);
  
  return {
    props: {
      post,
      relatedPosts,
    },
    // Her saat başı yeniden oluştur
    revalidate: 3600,
  };
};

export default BlogPostPage;