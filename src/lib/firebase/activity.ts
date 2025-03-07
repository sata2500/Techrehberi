// src/lib/firebase/activity.ts
import { 
    collection, 
    addDoc, 
    serverTimestamp
  } from 'firebase/firestore';
  import { db } from '@/lib/firebase/firebase';
  
  // Aktivite türleri
  export type ActivityType = 
    | 'post_created' 
    | 'post_updated' 
    | 'post_published' 
    | 'post_deleted'
    | 'user_registered'
    | 'user_updated'
    | 'comment_added'
    | 'media_uploaded';
  
  // Aktivite verisi arayüzü
  interface ActivityData {
    type: ActivityType;
    message: string;
    user: string;
    userId: string;
    entityId?: string;
    entityTitle?: string;
    metadata?: Record<string, any>;
  }
  
  /**
   * Yeni bir aktivite kaydı oluşturur
   */
  export const logActivity = async (activityData: ActivityData): Promise<string> => {
    try {
      // Aktiviteler koleksiyonu referansı
      const activitiesCollection = collection(db, 'activities');
      
      // Yeni aktivite belgesi oluştur
      const docRef = await addDoc(activitiesCollection, {
        ...activityData,
        timestamp: serverTimestamp()
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Aktivite kaydı oluşturulurken hata:', error);
      throw error;
    }
  };
  
  /**
   * Blog yazısı oluşturulduğunda aktivite kaydı oluşturur
   */
  export const logPostCreated = async (
    userId: string, 
    userName: string, 
    postId: string, 
    postTitle: string
  ): Promise<string> => {
    return logActivity({
      type: 'post_created',
      message: `"${postTitle}" başlıklı yeni bir yazı oluşturuldu`,
      user: userName,
      userId,
      entityId: postId,
      entityTitle: postTitle
    });
  };
  
  /**
   * Blog yazısı güncellendiğinde aktivite kaydı oluşturur
   */
  export const logPostUpdated = async (
    userId: string,
    userName: string,
    postId: string,
    postTitle: string
  ): Promise<string> => {
    return logActivity({
      type: 'post_updated',
      message: `"${postTitle}" başlıklı yazı güncellendi`,
      user: userName,
      userId,
      entityId: postId,
      entityTitle: postTitle
    });
  };
  
  /**
   * Blog yazısı yayınlandığında aktivite kaydı oluşturur
   */
  export const logPostPublished = async (
    userId: string,
    userName: string,
    postId: string,
    postTitle: string
  ): Promise<string> => {
    return logActivity({
      type: 'post_published',
      message: `"${postTitle}" başlıklı yazı yayınlandı`,
      user: userName,
      userId,
      entityId: postId,
      entityTitle: postTitle
    });
  };
  
  /**
   * Kullanıcı kaydı yapıldığında aktivite kaydı oluşturur
   */
  export const logUserRegistered = async (
    userId: string,
    userName: string
  ): Promise<string> => {
    return logActivity({
      type: 'user_registered',
      message: `Yeni kullanıcı kaydı: ${userName}`,
      user: 'Sistem',
      userId: 'system',
      entityId: userId,
      entityTitle: userName
    });
  };
  
  /**
   * Medya yüklendiğinde aktivite kaydı oluşturur
   */
  export const logMediaUploaded = async (
    userId: string,
    userName: string,
    mediaId: string,
    mediaName: string
  ): Promise<string> => {
    return logActivity({
      type: 'media_uploaded',
      message: `"${mediaName}" medyası yüklendi`,
      user: userName,
      userId,
      entityId: mediaId,
      entityTitle: mediaName
    });
  };