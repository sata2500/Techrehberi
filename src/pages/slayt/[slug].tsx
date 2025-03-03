import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { getSlideBySlug, getRelatedSlides, slides, Slide } from '@/data/slides';
import { ArrowLeft } from 'lucide-react';

interface SlideDetailProps {
  slide: Slide;
  relatedSlides: Slide[];
}

export default function SlideDetail({ slide, relatedSlides }: SlideDetailProps) {
  if (!slide) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <>
      <Head>
        <title>{slide.title} - Tech Rehberi</title>
        <meta name="description" content={slide.description} />
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Bölümü */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Ana Sayfaya Dön
          </Link>

          <div className="relative aspect-[21/9] rounded-xl overflow-hidden mb-6">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              {slide.category && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {slide.category}
                </span>
              )}
              {slide.readTime && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                  {slide.readTime}
                </span>
              )}
              {slide.publishDate && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                  {slide.publishDate}
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">{slide.title}</h1>
            <p className="text-lg text-muted-foreground mb-8">{slide.description}</p>

            {/* Burada içerik detayları olacak */}
            <div className="prose max-w-none">
              <p>
                Bu bir örnek içerik sayfasıdır. Gerçek projenizde bu kısımda slayt içeriğinizin detayları yer alacaktır.
              </p>
              <p>
                Kapsamlı içerik eklemek için veritabanı veya CMS entegrasyonu yapabilirsiniz.
              </p>
            </div>
          </div>
        </div>

        {/* İlgili Slaytlar */}
        {relatedSlides.length > 0 && (
          <div className="mt-12 border-t pt-8">
            <h2 className="text-2xl font-bold mb-6">İlgili İçerikler</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedSlides.map((related) => (
                <Link 
                  key={related.id} 
                  href={`/slayt/${related.slug}`}
                  className="group"
                >
                  <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                    <Image
                      src={related.image}
                      alt={related.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    {related.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {related.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = slides.map((slide) => ({
    params: { slug: slide.slug },
  }));

  return {
    paths,
    fallback: false, // true olarak değiştirilebilir, eğer yeni içerikler dinamik olarak ekleniyorsa
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const slide = getSlideBySlug(slug);
  const relatedSlides = getRelatedSlides(slug, 3);

  if (!slide) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      slide,
      relatedSlides,
    },
    // İçerik sık güncellenmiyorsa revalidate süresini ayarlayabilirsiniz
    // revalidate: 3600, // Her 1 saatte bir yeniden oluştur
  };
};