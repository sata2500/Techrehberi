import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Code, 
  Globe, 
  Smartphone, 
  Database, 
  Shield, 
  ArrowRight 
} from 'lucide-react';
import CategoryLayout from '@/components/layout/CategoryLayout';
import { recommendedCourses, ContentItem } from '@/data/content';

const CoursesPage: NextPage = () => {
  const categories = [
    { 
      id: 1, 
      title: "Yazılım Geliştirme", 
      slug: "programlama", 
      description: "Programlama dilleri ve yazılım geliştirme teknikleri",
      count: 25,
      icon: <Code className="h-5 w-5 text-blue-500" />
    },
    { 
      id: 2, 
      title: "Web Teknolojileri", 
      slug: "web", 
      description: "Frontend ve backend web teknolojileri",
      count: 18,
      icon: <Globe className="h-5 w-5 text-green-500" />
    },
    { 
      id: 3, 
      title: "Mobil Uygulama", 
      slug: "mobil", 
      description: "iOS, Android ve cross-platform uygulamalar",
      count: 12,
      icon: <Smartphone className="h-5 w-5 text-purple-500" />
    },
    { 
      id: 4, 
      title: "Veritabanı", 
      slug: "veritabani", 
      description: "SQL, NoSQL ve veri yönetimi",
      count: 8,
      icon: <Database className="h-5 w-5 text-amber-500" />
    },
    { 
      id: 5, 
      title: "Siber Güvenlik", 
      slug: "siber", 
      description: "Güvenlik prensipleri ve koruma teknikleri",
      count: 10,
      icon: <Shield className="h-5 w-5 text-red-500" />
    },
  ];

  // Öne çıkan kurslar bölümü
  const FeaturedCourses = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recommendedCourses.map((course: ContentItem) => (
        <Link 
          key={course.id} 
          href={`/kurslar/${course.slug}`}
          className="group"
        >
          <div className="rounded-xl overflow-hidden border hover:shadow-lg transition-shadow">
            <div className="relative aspect-video">
              <Image
                src={course.image}
                alt={course.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{course.description}</p>
              <div className="flex justify-between items-center">
                {course.meta.duration && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {course.meta.duration}
                  </span>
                )}
                {course.meta.level && (
                  <span className="text-xs bg-secondary/50 px-2 py-1 rounded-full">
                    {course.meta.level}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );

  return (
    <>
      <Head>
        <title>Kurslar - Tech Rehberi</title>
        <meta 
          name="description" 
          content="Yazılım geliştirme, web teknolojileri, mobil uygulama ve daha fazlası için özel hazırlanmış kurslar." 
        />
      </Head>

      <CategoryLayout
        title="Kurslar"
        description="Yazılım, web geliştirme, mobil uygulama ve daha fazlası için kapsamlı kurslar ve eğitimler."
        bgImage="/assets/images/banners/courses-banner.webp"
        categories={categories}
        featuredItems={FeaturedCourses}
      >
        {/* Ekstra İçerik */}
        <section className="py-12 px-4 bg-background">
          <div className="container mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-xl p-8 border border-blue-100 dark:border-blue-900">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="lg:w-2/3">
                  <h2 className="text-2xl font-bold mb-4">Eğitim Yolculuğunuzu Başlatın</h2>
                  <p className="text-lg mb-6">
                    İster yeni başlayan olun ister profesyonel, kurslarımız ile becerilerinizi geliştirin ve yeni teknolojileri öğrenin.
                  </p>
                  <ul className="mb-6 space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white">✓</div>
                      <span>Adım adım, uygulamalı eğitimler</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white">✓</div>
                      <span>Deneyimli eğitmenler tarafından hazırlanmış içerikler</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white">✓</div>
                      <span>Gerçek dünya projelerine dayalı öğrenim</span>
                    </li>
                  </ul>
                  <Link
                    href="/kurslar/programlama"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <span>Şimdi Başla</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="lg:w-1/3 flex justify-center">
                  <div className="relative w-60 h-60">
                    <Image
                      src="/assets/images/courses/education-illustration.svg"
                      alt="Eğitim İllüstrasyonu"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </CategoryLayout>
    </>
  );
};

export default CoursesPage;