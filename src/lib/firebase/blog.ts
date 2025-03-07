// src/lib/firebase/blog.ts
import { 
    collection, 
    doc, 
    getDoc, 
    getDocs, 
    setDoc, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    query, 
    where, 
    orderBy, 
    limit, 
    Timestamp, 
    startAfter 
  } from 'firebase/firestore';
  import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
  import { db, storage } from './firebase';
  import { slugify } from '@/lib/utils';
  
  // Tip tanımları
  export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    coverImage: string;
    author: {
      id: string;
      name: string;
      image?: string;
    };
    categories: string[];
    tags: string[];
    readTime: number;
    viewCount: number;
    likes: number;
    status: 'draft' | 'published' | 'archived';
    featured: boolean;
    publishedAt: Date | null;
    updatedAt: Date;
    createdAt: Date;
    metadata: {
      seo: {
        title: string;
        description: string;
        keywords: string[];
      };
      ogImage?: string;
    };
  }
  
  export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    coverImage?: string;
    parentId?: string;
    order: number;
    postCount: number;
    createdAt: Date;
    updatedAt: Date;
  }
  
  // Filtreleme seçenekleri
  export interface FilterOptions {
    status?: 'draft' | 'published' | 'archived';
    category?: string;
    tag?: string;
    featured?: boolean;
    limit?: number;
    lastVisible?: any;
    authorId?: string;
  }
  
  // Koleksiyon referansları
  const postsCollection = collection(db, 'blogPosts');
  const categoriesCollection = collection(db, 'categories');
  
  // Blog yazılarını getir
  export const getBlogPosts = async (options: FilterOptions = {}) => {
    try {
      // Temel sorguyu oluştur
      let q = query(postsCollection, orderBy('createdAt', 'desc'));
      
      // Filtreleri uygula
      if (options.status) {
        q = query(q, where('status', '==', options.status));
      }
      
      if (options.category) {
        q = query(q, where('categories', 'array-contains', options.category));
      }
      
      // Limit uygula
      if (options.limit) {
        q = query(q, limit(options.limit));
      }
      
      // Pagination için son görünen öğeden sonrasını al
      if (options.lastVisible) {
        q = query(q, startAfter(options.lastVisible));
      }
      
      // Sorguyu çalıştır
      const querySnapshot = await getDocs(q);
      
      const posts: BlogPost[] = [];
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        // JavaScript tarafında ek filtreler
        let shouldInclude = true;
        
        if (options.tag && !data.tags?.includes(options.tag)) {
          shouldInclude = false;
        }
        
        if (options.featured !== undefined && data.featured !== options.featured) {
          shouldInclude = false;
        }
        
        if (options.authorId && data.author?.id !== options.authorId) {
          shouldInclude = false;
        }
        
        if (shouldInclude) {
          // Tarihleri düzgün formatla
          posts.push({
            id: doc.id,
            ...data,
            publishedAt: data.publishedAt ? (data.publishedAt instanceof Timestamp ? data.publishedAt.toDate() : new Date(data.publishedAt)) : null,
            updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt),
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt)
          } as BlogPost);
        }
      });
      
      return { posts, lastVisible };
    } catch (error) {
      console.error('Blog yazıları getirilirken hata oluştu:', error);
      throw error;
    }
  };
  
  // Tek bir blog yazısını getir
  export const getBlogPost = async (idOrSlug: string) => {
    try {
      // Önce ID ile dene
      const docRef = doc(postsCollection, idOrSlug);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          publishedAt: data.publishedAt ? (data.publishedAt instanceof Timestamp ? data.publishedAt.toDate() : new Date(data.publishedAt)) : null,
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt),
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt)
        } as BlogPost;
      }
      
      // ID ile bulunamadıysa, slug ile dene
      const q = query(postsCollection, where('slug', '==', idOrSlug));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          publishedAt: data.publishedAt ? (data.publishedAt instanceof Timestamp ? data.publishedAt.toDate() : new Date(data.publishedAt)) : null,
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt),
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt)
        } as BlogPost;
      }
      
      return null;
    } catch (error) {
      console.error('Blog yazısı getirilirken hata oluştu:', error);
      throw error;
    }
  };
  
  // Blog yazısı kaydet
  export const saveBlogPost = async (post: Partial<BlogPost>) => {
    try {
      const now = new Date();
      
      // Slug oluştur (yoksa)
      if (!post.slug && post.title) {
        post.slug = slugify(post.title);
      }
      
      // Firebase için tarih nesnelerini Timestamp'e dönüştür
      const firestoreData = {
        ...post,
        publishedAt: post.publishedAt ? Timestamp.fromDate(new Date(post.publishedAt)) : null,
        updatedAt: Timestamp.fromDate(now),
        createdAt: post.createdAt ? Timestamp.fromDate(new Date(post.createdAt)) : Timestamp.fromDate(now)
      };
      
      // ID'yi kontrol et
      if (post.id) {
        // Belgenin var olup olmadığını kontrol et
        const postRef = doc(postsCollection, post.id);
        const postDoc = await getDoc(postRef);
        
        if (postDoc.exists()) {
          // Belge varsa güncelle
          await updateDoc(postRef, firestoreData);
        } else {
          // Belge yoksa oluştur
          await setDoc(postRef, {
            ...firestoreData,
            viewCount: 0,
            likes: 0
          });
        }
        return post.id;
      } else {
        // Yeni yazı oluştur
        const docRef = await addDoc(postsCollection, {
          ...firestoreData,
          viewCount: 0,
          likes: 0
        });
        
        // ID'yi belgeye ekle
        await updateDoc(docRef, { id: docRef.id });
        
        return docRef.id;
      }
    } catch (error) {
      console.error('Blog yazısı kaydedilirken hata oluştu:', error);
      throw error;
    }
  };
  
  // Blog yazısı sil
  export const deleteBlogPost = async (id: string) => {
    try {
      await deleteDoc(doc(postsCollection, id));
      return true;
    } catch (error) {
      console.error('Blog yazısı silinirken hata oluştu:', error);
      throw error;
    }
  };
  
  // Kategorileri getir
  export const getCategories = async () => {
    try {
      const querySnapshot = await getDocs(query(categoriesCollection, orderBy('order')));
      const categories: Category[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        categories.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt)
        } as Category);
      });
      
      return categories;
    } catch (error) {
      console.error('Kategoriler getirilirken hata oluştu:', error);
      throw error;
    }
  };
  
  // Kategori kaydet
  export const saveCategory = async (category: Partial<Category>) => {
    try {
      const now = new Date();
      
      // Slug oluştur (yoksa)
      if (!category.slug && category.name) {
        category.slug = slugify(category.name);
      }
      
      // ID varsa güncelle, yoksa ekle
      if (category.id) {
        const categoryRef = doc(categoriesCollection, category.id);
        await updateDoc(categoryRef, {
          ...category,
          updatedAt: Timestamp.fromDate(now)
        });
        return category.id;
      } else {
        // Yeni kategori
        const newCategory = {
          ...category,
          postCount: category.postCount || 0,
          order: category.order || 0,
          createdAt: Timestamp.fromDate(now),
          updatedAt: Timestamp.fromDate(now)
        };
        
        const docRef = await addDoc(categoriesCollection, newCategory);
        
        // ID'yi belgeye ekle
        await updateDoc(docRef, { id: docRef.id });
        
        return docRef.id;
      }
    } catch (error) {
      console.error('Kategori kaydedilirken hata oluştu:', error);
      throw error;
    }
  };
  
  // Görsel yükleme
  export const uploadImage = async (file: File, folder: string = 'blog-images') => {
    try {
      const fileExtension = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
      const storageRef = ref(storage, `${folder}/${fileName}`);
      
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      return downloadURL;
    } catch (error) {
      console.error('Görsel yüklenirken hata oluştu:', error);
      throw error;
    }
  };