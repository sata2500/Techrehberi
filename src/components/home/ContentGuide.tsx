import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Alt menü öğeleri - Tüm içerikler düz bir listede
const contentItems = [
  // Programlama Kursları
  //{ title: 'Python', href: '/kurslar/programlama/python', color: 'bg-blue-50 dark:bg-blue-900/40' },
  //{ title: 'JavaScript', href: '/kurslar/programlama/javascript', color: 'bg-amber-50 dark:bg-amber-900/40' },
  //{ title: 'Java', href: '/kurslar/programlama/java', color: 'bg-red-50 dark:bg-red-900/40' },
  //{ title: 'C#', href: '/kurslar/programlama/csharp', color: 'bg-purple-50 dark:bg-purple-900/40' },
  //{ title: 'Go', href: '/kurslar/programlama/go', color: 'bg-cyan-50 dark:bg-cyan-900/40' },
  //{ title: 'TypeScript', href: '/kurslar/programlama/typescript', color: 'bg-blue-50 dark:bg-blue-900/40' },
  //{ title: 'React', href: '/kurslar/web/react', color: 'bg-sky-50 dark:bg-sky-900/40' },
  //{ title: 'Vue', href: '/kurslar/web/vue', color: 'bg-green-50 dark:bg-green-900/40' },
  //{ title: 'Angular', href: '/kurslar/web/angular', color: 'bg-red-50 dark:bg-red-900/40' },
  //{ title: 'Next.js', href: '/kurslar/web/nextjs', color: 'bg-slate-50 dark:bg-slate-900/40' },
  //{ title: 'Node.js', href: '/kurslar/web/nodejs', color: 'bg-green-50 dark:bg-green-900/40' },
  //{ title: 'Django', href: '/kurslar/web/django', color: 'bg-emerald-50 dark:bg-emerald-900/40' },
  
  //{ title: 'Veri Analizi', href: '/kurslar/veri/analiz', color: 'bg-violet-50 dark:bg-violet-900/40' },
  //{ title: 'Yapay Zeka', href: '/kurslar/veri/ai', color: 'bg-blue-50 dark:bg-blue-900/40' },
  //{ title: 'Veri Bilimi', href: '/kurslar/veri/datascience', color: 'bg-teal-50 dark:bg-teal-900/40' },
  //{ title: 'ML', href: '/kurslar/veri/ml', color: 'bg-indigo-50 dark:bg-indigo-900/40' },
  //{ title: 'Flutter', href: '/kurslar/mobil/flutter', color: 'bg-cyan-50 dark:bg-cyan-900/40' },
  //{ title: 'React Native', href: '/kurslar/mobil/react-native', color: 'bg-sky-50 dark:bg-sky-900/40' },
  //{ title: 'Android', href: '/kurslar/mobil/android', color: 'bg-green-50 dark:bg-green-900/40' },
  //{ title: 'iOS', href: '/kurslar/mobil/ios', color: 'bg-red-50 dark:bg-red-900/40' },
  { title: 'Yazılım', href: '/blog/software', color: 'bg-slate-50 dark:bg-slate-900/40' },
  { title: 'Kariyer', href: '/blog/career', color: 'bg-teal-50 dark:bg-teal-900/40' },
  { title: 'İpuçları', href: '/blog/tips', color: 'bg-blue-50 dark:bg-blue-900/40' },
  { title: 'DevOps', href: '/blog/devops', color: 'bg-amber-50 dark:bg-amber-900/40' },
];

export default function ContentGuide() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState<Array<typeof contentItems>>([[], []]);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // İki satıra bölme işlemi
  useEffect(() => {
    const midPoint = Math.ceil(contentItems.length / 2);
    setRows([
      contentItems.slice(0, midPoint),
      contentItems.slice(midPoint)
    ]);
  }, []);

  // Kaydırma durumunu kontrol et
  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    
    // Sol ok için scroll pozisyonu kontrolü
    setShowLeftArrow(container.scrollLeft > 20);
    
    // Sağ ok için scroll pozisyonu kontrolü
    const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 20;
    setShowRightArrow(!isAtEnd);
  };

  useEffect(() => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    container.addEventListener('scroll', checkScrollPosition);
    
    // İlk yüklemede ok görünürlüğünü ayarla
    checkScrollPosition();
    
    return () => {
      container.removeEventListener('scroll', checkScrollPosition);
    };
  }, [rows]);

  // Kaydırma fonksiyonları
  const scrollContent = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.75;
    
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <section className="py-8 px-4" aria-labelledby="quick-access-title">
      <div className="container mx-auto bg-card/30 shadow-md border border-border/40 rounded-lg p-6">
        <h2 id="quick-access-title" className="text-xl font-semibold text-center mb-6">Hızlı Erişim</h2>
        
        {/* Kaydırılabilir içerik rehberi - iki satır halinde */}
        <div className="relative">
          {/* Sol kaydırma butonu */}
          {showLeftArrow && (
            <button 
              onClick={() => scrollContent('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Sola kaydır"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
          
          {/* Sağ kaydırma butonu */}
          {showRightArrow && (
            <button 
              onClick={() => scrollContent('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Sağa kaydır"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
          
          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide pb-3 px-8 select-none"
            onScroll={checkScrollPosition}
          >
            <div className="w-fit" style={{ minWidth: "150%" }}>
              {/* Grid kullanarak iki satırlı düzen */}
              <div className="grid grid-rows-2 gap-2">
                <div className="grid grid-flow-col gap-2 auto-cols-fr">
                  {rows[0].map((item, index) => (
                    <Link 
                      key={`row1-${index}`} 
                      href={item.href}
                      className={`${item.color} px-3 py-1.5 rounded-md text-xs shadow-sm border border-gray-100 dark:border-gray-800 transition-colors hover:opacity-80 text-center`}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
                
                <div className="grid grid-flow-col gap-2 auto-cols-fr">
                  {rows[1].map((item, index) => (
                    <Link 
                      key={`row2-${index}`} 
                      href={item.href}
                      className={`${item.color} px-3 py-1.5 rounded-md text-xs shadow-sm border border-gray-100 dark:border-gray-800 transition-colors hover:opacity-80 text-center`}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}