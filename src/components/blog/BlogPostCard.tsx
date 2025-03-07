// src/components/blog/BlogPostCard.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, MessageCircle, Eye } from 'lucide-react';

interface BlogPostCardProps {
  post: {
    id: number;
    title: string;
    slug?: string;
    description: string;
    image: string;
    meta: {
      author?: string;
      date?: string;
      readTime?: string;
      category?: string;
      views?: string;
      comments?: number;
    };
  };
  variant?: 'default' | 'featured' | 'minimal';
  className?: string;
}

export default function BlogPostCard({ post, variant = 'default', className = '' }: BlogPostCardProps) {
  // Post slug kontrolü
  const href = post.slug ? `/blog/${post.slug}` : '#';

  // Farklı varyantlar için render fonksiyonları
  const renderDefault = () => (
    <Link href={href} className={`group block overflow-hidden h-full ${className}`}>
      <div className="flex flex-col h-full bg-card border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300">
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {post.meta.category && (
            <div className="absolute top-2 left-2 bg-primary/80 text-primary-foreground text-xs px-2 py-1 rounded-md backdrop-blur-sm">
              {post.meta.category}
            </div>
          )}
        </div>

        <div className="flex flex-col flex-grow p-4">
          <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {post.description}
          </p>

          <div className="flex items-center gap-4 mt-auto text-xs text-muted-foreground">
            {post.meta.date && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{post.meta.date}</span>
              </div>
            )}
            
            {post.meta.readTime && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{post.meta.readTime}</span>
              </div>
            )}

            {post.meta.views && (
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>{post.meta.views}</span>
              </div>
            )}

            {post.meta.comments && (
              <div className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                <span>{post.meta.comments}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );

  const renderFeatured = () => (
    <Link href={href} className={`group block ${className}`}>
      <div className="grid md:grid-cols-2 gap-6 bg-card border rounded-lg overflow-hidden p-6 hover:shadow-md transition-shadow duration-300">
        <div className="relative aspect-[4/3] md:aspect-square overflow-hidden rounded-lg">
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="flex flex-col justify-center">
          {post.meta.category && (
            <div className="inline-block mb-3 bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
              {post.meta.category}
            </div>
          )}

          <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
          
          <p className="text-muted-foreground mb-5 line-clamp-3">
            {post.description}
          </p>

          <div className="flex items-center gap-4 text-sm">
            {post.meta.author && (
              <div className="flex items-center gap-2">
                <div className="relative w-6 h-6 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center text-primary font-medium text-xs">
                  {post.meta.author.charAt(0)}
                </div>
                <span className="text-foreground">{post.meta.author}</span>
              </div>
            )}
            
            {post.meta.date && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{post.meta.date}</span>
              </div>
            )}
            
            {post.meta.readTime && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{post.meta.readTime}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );

  const renderMinimal = () => (
    <Link href={href} className={`group flex gap-4 ${className}`}>
      <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="80px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-col">
        <h3 className="text-sm font-medium mb-1 line-clamp-2 group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        
        <div className="flex items-center gap-3 mt-auto text-xs text-muted-foreground">
          {post.meta.date && (
            <span>{post.meta.date}</span>
          )}
          
          {post.meta.readTime && (
            <span>{post.meta.readTime}</span>
          )}
        </div>
      </div>
    </Link>
  );

  // Varyanta göre doğru render fonksiyonunu döndür
  switch (variant) {
    case 'featured':
      return renderFeatured();
    case 'minimal':
      return renderMinimal();
    case 'default':
    default:
      return renderDefault();
  }
}