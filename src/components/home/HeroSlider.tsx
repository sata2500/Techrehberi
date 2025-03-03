import React, { useState, useEffect, useCallback, TouchEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Slide } from '@/data/slides';

interface HeroSliderProps {
  slides: Slide[];
}

export default function HeroSlider({ slides }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [slidesPerView, setSlidesPerView] = useState(1);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  // Touch olayları için minimum kaydırma mesafesi
  const minSwipeDistance = 50;

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSlidesPerView(3);
      } else if (window.innerWidth >= 768) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || !mounted) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % (slides.length - (slidesPerView - 1)));
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlaying, slides.length, slidesPerView, mounted]);

  const handleTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentSlide < slides.length - slidesPerView) {
      setCurrentSlide(prev => prev + 1);
      setIsAutoPlaying(false);
    }
    
    if (isRightSwipe && currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
      setIsAutoPlaying(false);
    }
  }, [touchStart, touchEnd, currentSlide, slides.length, slidesPerView]);

  const nextSlide = () => {
    if (currentSlide < slides.length - slidesPerView) {
      setCurrentSlide(prev => prev + 1);
      setIsAutoPlaying(false);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
      setIsAutoPlaying(false);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  if (!mounted) return null;

  return (
    <section className="w-full py-8 bg-background" aria-labelledby="hero-slider-title">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative bg-card/30 shadow-md border border-border/40 rounded-lg p-6">
          <h2 id="hero-slider-title" className="sr-only">Öne Çıkan İçerikler</h2>
          
          <div 
            className="overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ 
                transform: `translateX(-${currentSlide * (100 / slidesPerView)}%)`,
              }}
            >
              {slides.map((slide) => (
                <div 
                  key={slide.id}
                  className={`px-2 flex-shrink-0`}
                  style={{ width: `${100 / slidesPerView}%` }}
                >
                  <div className="relative aspect-[16/9] rounded-xl overflow-hidden group">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes={`(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw`}
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
                      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                        <h2 className="text-lg md:text-xl font-bold text-white mb-1">
                          {slide.title}
                        </h2>
                        <p className="text-sm md:text-base text-white/90 mb-4">
                          {slide.description}
                        </p>
                        <Link
                          href={`/slayt/${slide.slug}`}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          Detaylar
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slider Kontrolleri */}
          <button
            onClick={prevSlide}
            className={`absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white border border-gray-200 flex items-center justify-center shadow-lg z-10 transition-opacity ${
              currentSlide === 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
            }`}
            disabled={currentSlide === 0}
            aria-label="Önceki slayt"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={nextSlide}
            className={`absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white border border-gray-200 flex items-center justify-center shadow-lg z-10 transition-opacity ${
              currentSlide === slides.length - slidesPerView ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
            }`}
            disabled={currentSlide === slides.length - slidesPerView}
            aria-label="Sonraki slayt"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Slayt İndikatörleri */}
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: slides.length - (slidesPerView - 1) }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-6 h-1 rounded-sm transition-all ${
                  currentSlide === index 
                    ? 'bg-primary' 
                    : 'bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600'
                }`}
                aria-label={`${index + 1}. slayta git`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}