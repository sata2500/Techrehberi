// src/data/react-course.ts

export interface VideoContent {
    id: number;
    title: string;
    duration: string;
    videoId: string;
    section?: string;
    tags?: string[];
    streamUrl?: string;
  }
  
  export interface CodeExample {
    title: string;
    code: string;
    language: string;
  }
  
  export interface Resource {
    title: string;
    url: string;
    type: 'documentation' | 'article' | 'video' | 'github';
  }
  
  export interface LearningObjective {
    id: number;
    description: string;
  }
  
  export interface Lesson {
    id: number;
    title: string;
    slug: string;
    duration: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    learningObjectives: LearningObjective[];
    content: {
      overview: string;
      sections: Array<{
        title: string;
        content: string;
      }>;
      videoContents?: VideoContent[];
      codeExamples?: CodeExample[];
    };
    resources: Resource[];
    preview?: boolean;
    requiresAuth?: boolean;
  }
  
  export interface Module {
    id: number;
    title: string;
    slug: string;
    description: string;
    lessons: Lesson[];
  }
  
  export const reactCourseData: Module[] = [
    {
      id: 1,
      title: "React Temelleri",
      slug: "react-temelleri", 
      description: "React'in temel kavramları ve çalışma prensipleri",
      lessons: [
        {
          id: 1,
          title: "React'e Giriş ve Kurulum",
          slug: "reacte-giris-ve-kurulum",
          duration: "15 dk",
          difficulty: "beginner",
          learningObjectives: [
            {
              id: 1,
              description: "React'in temel çalışma prensiplerini anlayacaksınız"
            },
            {
              id: 2,
              description: "Geliştirme ortamınızı hazırlamayı öğreneceksiniz"
            },
            {
              id: 3,
              description: "İlk React uygulamanızı oluşturacaksınız"
            },
            {
              id: 4,
              description: "Modern toolchain'leri tanıyacaksınız"
            }
          ],
          content: {
            overview: "React, Facebook tarafından geliştirilen açık kaynaklı bir JavaScript kütüphanesidir. Bu derste React'in temellerini ve kurulum sürecini öğreneceksiniz.",
            sections: [
              {
                title: "React Nedir?",
                content: "React, kullanıcı arayüzleri oluşturmak için kullanılan bir JavaScript kütüphanesidir. Component-based yapısı ile tekrar kullanılabilir UI elementleri oluşturmanıza olanak sağlar."
              },
              {
                title: "Neden React?",
                content: "React'in en önemli özelliklerinden biri Virtual DOM kullanmasıdır. Bu sayede uygulamanızın performansı artar. Ayrıca geniş bir ekosisteme ve topluluk desteğine sahiptir."
              },
              {
                title: "Kurulum Adımları", 
                content: "React projenizi başlatmak için Node.js ve npm'in bilgisayarınızda kurulu olması gerekir. Create React App veya Vite gibi modern araçlarla hızlıca proje oluşturabilirsiniz."
              }
            ],
            videoContents: [
              {
                id: 1,
                title: "React'e Giriş",
                duration: "5:30",
                videoId: "88c141c4-033d-4e00-9db4-53268e6ec9a2",
                section: "Giriş",
                tags: ["Temel", "Kurulum"]
              },
            ],
            codeExamples: [
              {
                title: "Create React App ile Proje Oluşturma",
                code: "npx create-react-app my-app\ncd my-app\nnpm start",
                language: "bash"
              },
              {
                title: "Vite ile Proje Oluşturma",
                code: "npm create vite@latest my-react-app -- --template react\ncd my-react-app\nnpm install\nnpm run dev",
                language: "bash" 
              }
            ]
          },
          resources: [
            {
              title: "React Resmi Dokümantasyonu",
              url: "https://react.dev",
              type: "documentation"
            },
            {
              title: "Create React App Dokümantasyonu", 
              url: "https://create-react-app.dev",
              type: "documentation"
            },
            {
              title: "React GitHub Deposu",
              url: "https://github.com/facebook/react",
              type: "github"
            }
          ],
          preview: true
        }
        // Diğer dersler buraya eklenebilir
      ]
    }
    // Diğer modüller buraya eklenebilir
  ];
  
  // Yardımcı fonksiyonlar
  export const getAllLessons = async (): Promise<Lesson[]> => {
    return reactCourseData.reduce((lessons: Lesson[], module) => {
      return [...lessons, ...module.lessons];
    }, []);
  };
  
  export const getLessonBySlug = async (slug: string): Promise<Lesson | undefined> => {
    const allLessons = await getAllLessons();
    return allLessons.find(lesson => lesson.slug === slug);
  };
  
  export const getAdjacentLessons = async (currentSlug: string) => {
    const allLessons = await getAllLessons();
    const currentIndex = allLessons.findIndex(lesson => lesson.slug === currentSlug);
    
    return {
      previous: currentIndex > 0 ? allLessons[currentIndex - 1] : null,
      next: currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null
    };
  };
  
  // Microsoft Graph API'den video stream URL'ini almak için mock fonksiyon
  export const getVideoStreamUrl = async (videoId: string): Promise<string> => {
    // Bu fonksiyon normalde Graph API'ye istek atıp gerçek stream URL döndürür
    // Burada örnek bir URL döndürüyoruz
    return `https://example.com/videos/${videoId}/stream`;
  };
  
  export const getLessonVideos = async (slug: string): Promise<VideoContent[]> => {
    const lesson = await getLessonBySlug(slug);
    if (!lesson?.content.videoContents) return [];
  
    try {
      const videosWithUrls = await Promise.all(
        lesson.content.videoContents.map(async (video) => {
          const streamUrl = await getVideoStreamUrl(video.videoId);
          return {
            ...video,
            streamUrl
          };
        })
      );
  
      return videosWithUrls;
    } catch (error) {
      console.error('Video stream URL\'leri alınırken hata:', error);
      throw error;
    }
  };
  
  export const getSectionVideos = async (section: string): Promise<VideoContent[]> => {
    const allLessons = await getAllLessons();
    const videos: VideoContent[] = [];
  
    allLessons.forEach(lesson => {
      lesson.content.videoContents?.forEach(video => {
        if (video.section === section) {
          videos.push(video);
        }
      });
    });
  
    return videos;
  };
  
  export const getVideoById = async (videoId: string): Promise<VideoContent> => {
    const allLessons = await getAllLessons();
    let foundVideo: VideoContent | undefined;
  
    allLessons.some(lesson => {
      foundVideo = lesson.content.videoContents?.find(v => v.videoId === videoId);
      return !!foundVideo;
    });
  
    if (!foundVideo) {
      throw new Error('Video bulunamadı');
    }
  
    const streamUrl = await getVideoStreamUrl(foundVideo.videoId);
    return {
      ...foundVideo,
      streamUrl
    };
  };