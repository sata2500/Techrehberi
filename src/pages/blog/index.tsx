import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { blogPosts, ContentItem } from '@/data/content';

const BlogPage: NextPage = () => {
  const categories = [
    { id: 1, title: "Teknoloji", slug: "tech", count: 12 },
    { id: 2, title: "Yazılım", slug: "software", count: 15 },
    { id: 3, title: "Kariyer", slug: "career", count: 8 },
    { id: 4, title: "İpuçları", slug: "tips", count: 10 },
    { id: 5, title: "Güncel", slug: "news", count: 14 },
  ];

  return (
    <>
      <Head>
        <title>Blog Yazıları - Tech Rehberi</title>
        <meta name="description" content="Teknoloji, yazılım ve dijital trendler hakkında güncel blog yazıları." />
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="py-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Blog Yazıları</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Teknoloji dünyasındaki son gelişmeler, yazılım ipuçları ve dijital trendler hakkında içerikler.
          </p>
        </div>

        {/* Featured Post */}
        {blogPosts.length > 0 && (
          <div className="mb-12">
            <Link href={`/blog/${blogPosts[0].slug}`} className="group">
              <div className="grid md:grid-cols-2 gap-6 items-center bg-card hover:bg-card/80 border rounded-xl p-6 transition-colors">
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                  <Image
                    src={blogPosts[0].image}
                    alt={blogPosts[0].title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div>
                  <div className="mb-4">
                    <span className="inline-block bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
                      Öne Çıkan
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {blogPosts[0].title}
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    {blogPosts[0].description}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">{blogPosts[0].meta.author}</span>
                    <span className="text-muted-foreground">{blogPosts[0].meta.readTime}</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Categories */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Kategoriler</h2>
            <Link href="/blog/kategoriler" className="text-primary hover:underline">
              Tümünü Gör
            </Link>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/blog/${category.slug}`}
                className="bg-card hover:bg-accent/50 border px-4 py-2 rounded-lg transition-colors"
              >
                <span className="font-medium">{category.title}</span>
                <span className="text-muted-foreground ml-2">({category.count})</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Blog Posts */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Son Yazılar</h2>
            <Link href="/blog/tumu" className="text-primary hover:underline">
              Tümünü Gör
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post: ContentItem) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                <div className="relative aspect-[3/2] rounded-lg overflow-hidden mb-3">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {post.description}
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">{post.meta.author}</span>
                  <span className="text-muted-foreground">{post.meta.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPage;