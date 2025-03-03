import React, { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Category {
  id: number;
  title: string;
  slug: string;
  description?: string;
  count?: number;
  icon?: ReactNode;
}

interface CategoryLayoutProps {
  title: string;
  description: string;
  bgImage?: string;
  categories: Category[];
  featuredItems?: ReactNode;
  children?: ReactNode;
}

export default function CategoryLayout({
  title,
  description,
  bgImage,
  categories,
  featuredItems,
  children
}: CategoryLayoutProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className={`py-16 px-4 bg-gradient-to-r from-primary/90 to-primary/70 relative`}
      >
        {bgImage && (
          <div 
            className="absolute inset-0 z-0 opacity-20 bg-cover bg-center" 
            style={{ backgroundImage: `url(${bgImage})` }}
          />
        )}
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h1>
            <p className="text-xl text-white/90">
              {description}
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 px-4 bg-background">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-8">Kategoriler</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link 
                key={category.id} 
                href={`${title.toLowerCase()}/${category.slug}`}
                className="group p-4 rounded-lg border hover:border-primary hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3">
                  {category.icon && (
                    <div className="mt-1 flex-shrink-0">
                      {category.icon}
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium group-hover:text-primary transition-colors">
                      {category.title}
                    </h3>
                    {category.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {category.description}
                      </p>
                    )}
                    {category.count !== undefined && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {category.count} içerik
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items */}
      {featuredItems && (
        <section className="py-12 px-4 bg-accent/30">
          <div className="container mx-auto">
            <h2 className="text-2xl font-bold mb-8">Öne Çıkanlar</h2>
            {featuredItems}
          </div>
        </section>
      )}

      {/* Additional Content */}
      {children}

      {/* Explore More CTA */}
      <section className="py-10 px-4 border-t">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-xl font-semibold mb-1">Daha fazla keşfet</h3>
              <p className="text-muted-foreground">Tüm içeriklere göz atmak ve daha fazlasını keşfetmek için</p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg inline-flex items-center gap-2 hover:bg-primary/90 transition-colors"
            >
              <span>Ana Sayfaya Dön</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}