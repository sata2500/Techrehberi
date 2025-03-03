import { GetStaticProps, GetStaticPaths } from 'next';
import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, PlayCircle } from 'lucide-react';
import { 
  getContentBySlug, 
  getRelatedContent, 
  latestContent, 
  popularContent, 
  techUpdates, 
  recommendedCourses, 
  blogPosts,
  ContentItem 
} from '@/data/content';
import { VideoPlayer } from '@/components/ui/video-player';

interface ContentDetailProps {
  content: ContentItem;
  relatedContent: ContentItem[];
}

export default function ContentDetail({ content, relatedContent }: ContentDetailProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);

  if (!content) {
    return <div>Yükleniyor...</div>;
  }

  const handlePlayVideo = (id: string) => {
    setVideoId(id);
    setIsPlaying(true);
  };

  return (
    <>
      <Head>
        <title>{content.title} - Tech Rehberi</title>
        <meta name="description" content={content.description} />
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

          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative aspect-video rounded-xl overflow-hidden group cursor-pointer" onClick={() => handlePlayVideo('sample-video-id')}>
              <Image
                src={content.image}
                alt={content.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <PlayCircle className="w-5 h-5" />
                  <span className="font-medium">Videoyu Oynat</span>
                </button>
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-bold mb-4">{content.title}</h1>
              <p className="text-lg text-muted-foreground mb-6">{content.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {content.meta.category && (
                  <div>
                    <p className="text-sm text-muted-foreground">Kategori</p>
                    <p className="font-medium">{content.meta.category}</p>
                  </div>
                )}
                {content.meta.duration && (
                  <div>
                    <p className="text-sm text-muted-foreground">Süre</p>
                    <p className="font-medium">{content.meta.duration}</p>
                  </div>
                )}
                {content.meta.level && (
                  <div>
                    <p className="text-sm text-muted-foreground">Seviye</p>
                    <p className="font-medium">{content.meta.level}</p>
                  </div>
                )}
                {content.meta.views && (
                  <div>
                    <p className="text-sm text-muted-foreground">İzlenme</p>
                    <p className="font-medium">{content.meta.views}</p>
                  </div>
                )}
                {content.meta.author && (
                  <div>
                    <p className="text-sm text-muted-foreground">Yazar</p>
                    <p className="font-medium">{content.meta.author}</p>
                  </div>
                )}
                {content.meta.date && (
                  <div>
                    <p className="text-sm text-muted-foreground">Tarih</p>
                    <p className="font-medium">{content.meta.date}</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => handlePlayVideo('sample-video-id')}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <PlayCircle className="w-5 h-5" />
                Hemen Başla
              </button>
            </div>
          </div>
        </div>

        {/* İçerik Bölümü */}
        <div className="max-w-3xl mx-auto mt-12">
          <div className="prose max-w-none">
            <h2>İçerik Hakkında</h2>
            <p>
              Bu bir örnek içerik sayfasıdır. Gerçek projenizde bu kısımda içeriğin detayları yer alacaktır.
            </p>
            <p>
              Kapsamlı içerik eklemek için veritabanı veya CMS entegrasyonu yapabilirsiniz.
            </p>
          </div>
        </div>

        {/* İlgili İçerikler */}
        {relatedContent.length > 0 && (
          <div className="mt-12 border-t pt-8">
            <h2 className="text-2xl font-bold mb-6">Benzer İçerikler</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedContent.map((related) => (
                <Link 
                  key={related.id} 
                  href={`/icerik/${related.slug}`}
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

      {/* Video Player Modal */}
      {isPlaying && videoId && (
        <VideoPlayer
          videoId={videoId}
          onClose={() => {
            setIsPlaying(false);
            setVideoId(null);
          }}
        />
      )}
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Tüm içerik türlerini birleştirin
  const allContent = [
    ...latestContent,
    ...popularContent,
    ...techUpdates,
    ...recommendedCourses,
    ...blogPosts
  ].filter(item => item.slug); // slug'ı olan içerikleri filtrele

  const paths = allContent.map((item) => ({
    params: { slug: item.slug },
  }));

  return {
    paths,
    fallback: false, // veya 'blocking' dinamik içerik için
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const content = getContentBySlug(slug);
  const relatedContent = getRelatedContent(slug, 3);

  if (!content) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      content,
      relatedContent,
    },
    // revalidate: 3600, // Her 1 saatte bir yeniden oluştur
  };
};