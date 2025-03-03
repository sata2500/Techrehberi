import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, PlayCircle } from 'lucide-react';
import { ContentItem } from '@/data/content';

interface ScrollSectionProps {
  title: string;
  items: ContentItem[];
}

export default function ScrollSection({ title, items }: ScrollSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scrollAmount = container.clientWidth * 0.8;
    const newScrollPosition = direction === 'left' 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollPosition,
      behavior: 'smooth'
    });
  };

  const handleScroll = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    setShowLeftButton(container.scrollLeft > 0);
    setShowRightButton(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  const renderMeta = (meta: ContentItem['meta']) => {
    if (meta.date && meta.category) {
      return (
        <>
          <span className="text-sm text-muted-foreground">{meta.date}</span>
          <span className="text-sm text-muted-foreground">{meta.category}</span>
        </>
      );
    }
    if (meta.views && meta.category) {
      return (
        <>
          <span className="text-sm text-muted-foreground">{meta.views}</span>
          <span className="text-sm text-muted-foreground">{meta.category}</span>
        </>
      );
    }
    if (meta.duration && meta.level) {
      return (
        <>
          <span className="text-sm text-muted-foreground">{meta.duration}</span>
          <span className="text-sm text-muted-foreground">{meta.level}</span>
        </>
      );
    }
    if (meta.author && meta.readTime) {
      return (
        <>
          <span className="text-sm text-muted-foreground">{meta.author}</span>
          <span className="text-sm text-muted-foreground">{meta.readTime}</span>
        </>
      );
    }
    return null;
  };

  return (
    <section className="py-8 px-4" aria-labelledby={`section-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="container mx-auto bg-card/30 shadow-md border border-border/40 rounded-lg p-6">
        {/* Başlık - ortada konumlandırılmış */}
        <div className="mb-6 text-center">
          <h2 
            id={`section-${title.toLowerCase().replace(/\s+/g, '-')}`} 
            className="text-2xl font-bold"
          >
            {title}
          </h2>
        </div>

        {/* Kaydırma alanı ve butonlar için konteynır */}
        <div className="relative">
          {/* Sol kaydırma butonu - dikeyde ortalanmış */}
          <button
            onClick={() => scroll('left')}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all ${
              !showLeftButton ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
            disabled={!showLeftButton}
            aria-label="Sola kaydır"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Kaydırılabilir alan */}
          <div
            ref={containerRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4 px-2"
          >
            {items.map((item) => (
              <div
                key={item.id}
                className="flex-none w-[300px] group"
              >
                <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Overlay ve Başla butonu */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Link
                      href={`/icerik/${item.slug}`}
                      className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span className="font-medium">Başla</span>
                    </Link>
                  </div>
                </div>
                <h3 className="font-semibold mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex justify-between items-center">
                  {renderMeta(item.meta)}
                </div>
              </div>
            ))}
          </div>

          {/* Sağ kaydırma butonu - dikeyde ortalanmış */}
          <button
            onClick={() => scroll('right')}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all ${
              !showRightButton ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
            disabled={!showRightButton}
            aria-label="Sağa kaydır"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}