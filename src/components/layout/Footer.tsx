import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Github, Mail, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border mt-16">
      {/* Üst Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo ve Hakkında */}
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Image 
                src="/assets/images/logo.png" 
                alt="Tech Rehberi Logo" 
                width={40} 
                height={40}
                className="rounded-lg"
              />
              <span className="font-bold text-lg">Tech Rehberi</span>
            </Link>
            <p className="text-muted-foreground text-sm mb-4">
              Dijital dünyada rehberiniz. Programlama, web teknolojileri, yapay zeka ve daha fazlası hakkında güncel ve kapsamlı içerikler.
            </p>
            <div className="flex space-x-3">
              <Link href="https://facebook.com" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook size={18} />
              </Link>
              <Link href="https://twitter.com" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={18} />
              </Link>
              <Link href="https://instagram.com" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={18} />
              </Link>
              <Link href="https://youtube.com" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube size={18} />
              </Link>
              <Link href="https://linkedin.com" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin size={18} />
              </Link>
              <Link href="https://github.com" className="text-muted-foreground hover:text-primary transition-colors">
                <Github size={18} />
              </Link>
            </div>
          </div>

          {/* Hızlı Linkler */}
          <div>
            <h3 className="font-semibold mb-4">Hızlı Linkler</h3>
            <nav className="flex flex-col space-y-2">
              {/*<Link href="/kurslar" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Kurslar
              </Link>*/}
              <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Blog
              </Link>
              {/*<Link href="/haberler" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Haberler
              </Link>
              <Link href="/programlar" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Programlar
              </Link>
              <Link href="/filmler" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Filmler
              </Link>
              <Link href="/astroloji" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Astroloji
              </Link>*/}
            </nav>
          </div>

          {/* Kategoriler */}
          {/*<div>
            <h3 className="font-semibold mb-4">Kategoriler</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/kurslar/programlama" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Programlama
              </Link>
              <Link href="/kurslar/web" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Web Geliştirme
              </Link>
              <Link href="/kurslar/mobil" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Mobil Uygulama
              </Link>
              <Link href="/kurslar/yapay-zeka" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Yapay Zeka
              </Link>
              <Link href="/kurslar/veri-bilimi" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Veri Bilimi
              </Link>
              <Link href="/kurslar/siber-guvenlik" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Siber Güvenlik
              </Link>
            </nav>
          </div>*/}

          {/* İletişim ve Bülten */}
          <div>
            <h3 className="font-semibold mb-4">Bültenimize Abone Olun</h3>
            <p className="text-sm text-muted-foreground mb-4">
              En son teknoloji haberleri ve içeriklerinden haberdar olun.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="E-posta adresiniz" 
                className="px-3 py-2 bg-background border border-input rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary w-full text-sm"
              />
              <button className="bg-primary text-primary-foreground px-3 py-2 rounded-r-md hover:bg-primary/90">
                <Send size={16} />
              </button>
            </div>
            <div className="mt-6">
              <h3 className="font-semibold mb-2">İletişim</h3>
              <Link href="mailto:info@techrehberi.com" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mt-2">
                <Mail size={14} />
                info@techrehberi.com
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Alt Footer */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Tech Rehberi. Tüm hakları saklıdır.
            </p>
            <div className="flex gap-4">
              <Link href="/gizlilik-politikasi" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                Gizlilik Politikası
              </Link>
              <Link href="/kullanim-sartlari" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                Kullanım Şartları
              </Link>
              <Link href="/cerez-politikasi" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                Çerez Politikası
              </Link>
              <Link href="/sss" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                SSS
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}