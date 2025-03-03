import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Book, PenTool, Newspaper, Laptop, Film, Star, Music, MoreHorizontal, X } from 'lucide-react';

interface NavItem {
  icon: React.ReactNode;
  text: string;
  href: string;
}

export default function MobileNavBar() {
  const router = useRouter();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [visibleItems, setVisibleItems] = useState<NavItem[]>([]);
  const [hiddenItems, setHiddenItems] = useState<NavItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Tüm menü öğeleri
  const allNavItems: NavItem[] = [
    //{ icon: <Book size={20} />, text: "Kurslar", href: "/kurslar" },
    { icon: <PenTool size={20} />, text: "Blog", href: "/blog" },
    //{ icon: <Newspaper size={20} />, text: "Haberler", href: "/haberler" },
    //{ icon: <Laptop size={20} />, text: "Programlar", href: "/programlar" },
    //{ icon: <Film size={20} />, text: "Filmler", href: "/filmler" },
    //{ icon: <Star size={20} />, text: "Astroloji", href: "/astroloji" },
    //{ icon: <Music size={20} />, text: "Müzikler", href: "/muzikler" },
  ];

  // Ekran genişliğine göre görünür öğeleri hesapla
  const calculateVisibleItems = () => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth;
    // "Daha Fazla" butonu hariç her bir öğe için yaklaşık genişlik (px)
    const itemWidth = 70; 
    // "Daha Fazla" butonu için ayrılan genişlik
    const moreButtonWidth = 70;
    
    // Kaç öğenin görünebileceğini hesaplıyoruz (Daha Fazla butonu için yer bırakarak)
    const maxVisibleItems = Math.floor((containerWidth - moreButtonWidth) / itemWidth);
    
    // Tüm öğeler sığıyorsa, "Daha Fazla" butonu gerekmez
    if (allNavItems.length <= maxVisibleItems) {
      setVisibleItems(allNavItems);
      setHiddenItems([]);
    } else {
      // "Daha Fazla" butonu gerekli, görünür öğeleri hesapla
      setVisibleItems(allNavItems.slice(0, maxVisibleItems));
      setHiddenItems(allNavItems.slice(maxVisibleItems));
    }
  };

  // Pencere yeniden boyutlandırıldığında hesaplamayı güncelle
  useEffect(() => {
    calculateVisibleItems();
    window.addEventListener('resize', calculateVisibleItems);
    
    return () => {
      window.removeEventListener('resize', calculateVisibleItems);
    };
  }, []);

  // Aktif bağlantıyı kontrol eden fonksiyon
  const isActive = (href: string) => router.pathname === href || router.pathname.startsWith(`${href}/`);

  return (
    <>
      {/* Sabit mobil menü */}
      <div 
        ref={containerRef}
        className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-background border-t border-border z-50"
      >
        <div className="flex h-full justify-around items-center">
          {visibleItems.map((item, index) => (
            <Link 
              key={index}
              href={item.href}
              className={`flex flex-col items-center justify-center p-1 ${isActive(item.href) ? 'text-primary' : 'text-muted-foreground'}`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.text}</span>
            </Link>
          ))}
          
          {hiddenItems.length > 0 && (
            <button
              className="flex flex-col items-center justify-center p-1 text-muted-foreground"
              onClick={() => setMoreMenuOpen(true)}
            >
              <MoreHorizontal size={20} />
              <span className="text-xs mt-1">Daha</span>
            </button>
          )}
        </div>
      </div>

      {/* "Daha Fazla" menüsü */}
      {moreMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-50 flex items-end justify-center" onClick={() => setMoreMenuOpen(false)}>
          <div 
            className="bg-background rounded-t-xl w-full max-w-md p-4 animate-in slide-in-from-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Tüm Menüler</h3>
              <button 
                onClick={() => setMoreMenuOpen(false)}
                className="p-1 rounded-full hover:bg-muted"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {allNavItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg hover:bg-accent ${isActive(item.href) ? 'text-primary bg-accent' : 'text-foreground'}`}
                  onClick={() => setMoreMenuOpen(false)}
                >
                  {item.icon}
                  <span className="text-xs mt-2 text-center">{item.text}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}