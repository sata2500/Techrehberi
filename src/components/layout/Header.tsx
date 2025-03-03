import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { UserNav } from './UserNav';

// Ana menü öğeleri
const mainNavItems = [
  //{ href: "/kurslar", text: "Kurslar" },
  { href: "/blog", text: "Blog" },
  //{ href: "/haberler", text: "Haberler" },
  //{ href: "/programlar", text: "Programlar" },
  //{ href: "/filmler", text: "Filmler" },
  //{ href: "/astroloji", text: "Astroloji" },
  //{ href: "/muzikler", text: "Müzikler" }
];

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center space-x-2">
              <Image 
                src="/assets/images/logo.png" 
                alt="Tech Rehberi Logo" 
                width={40} 
                height={40}
                className="rounded-lg"
                priority
              />
              <span className="font-bold text-lg hidden sm:inline-block">Tech Rehberi</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {mainNavItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {item.text}
              </Link>
            ))}
          </nav>
          
          {/* Sağdaki Araçlar (Arama, Tema, Kullanıcı) */}
          <div className="flex items-center gap-3">
            {/* Arama Butonu */}
            <div className={`hidden md:flex relative ${isSearchExpanded ? 'w-60' : 'w-40'} transition-all duration-300`}>
              <input
                type="text"
                placeholder="Ara..."
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                onFocus={() => setIsSearchExpanded(true)}
                onBlur={() => setIsSearchExpanded(false)}
              />
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
            
            {/* Tema Değiştirici */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="relative p-2 hover:bg-accent rounded-md"
              aria-label="Tema değiştir"
            >
              <Sun className="h-5 w-5 transition-all duration-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
              <Moon className="h-5 w-5 transition-all duration-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
            </button>
            
            {/* Mobil Arama */}
            <button
              className="md:hidden p-2 hover:bg-accent rounded-md"
              aria-label="Ara"
              onClick={() => {
                if (searchInputRef.current) {
                  searchInputRef.current.focus();
                }
              }}
            >
              <Search className="h-5 w-5" />
            </button>
            
            {/* Kullanıcı Menüsü */}
            <UserNav />
          </div>
        </div>
      </div>
      
      {/* Mobil Arama Input (Normalde gizli) */}
      <div className="md:hidden overflow-hidden transition-all duration-300 h-0 focus-within:h-12 border-t border-border/0 focus-within:border-border">
        <div className="container mx-auto px-4 h-full flex items-center">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Aramak istediğiniz şeyi yazın..."
            className="w-full h-9 px-3 py-2 bg-background text-sm outline-none"
          />
        </div>
      </div>
    </header>
  );
}