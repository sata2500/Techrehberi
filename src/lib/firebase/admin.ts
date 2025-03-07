// src/lib/firebase/admin.ts
import { 
    doc, 
    getDoc, 
    setDoc, 
    collection,
    query,
    where,
    getDocs
  } from 'firebase/firestore';
  import { db } from './firebase';
  
  // Admin kullanıcıları için tip tanımı
  export interface AdminUser {
    userId: string;
    role: 'admin' | 'editor' | 'author';
    permissions: string[];
    createdAt: Date;
    updatedAt: Date;
  }
  
  // Admin koleksiyon referansı
  const adminUsersCollection = collection(db, 'adminUsers');
  
  // Kullanıcının admin rolüne sahip olup olmadığını kontrol et
  export const checkAdminRole = async (userId: string): Promise<boolean> => {
    try {
      const adminRef = doc(adminUsersCollection, userId);
      const adminSnap = await getDoc(adminRef);
      
      return adminSnap.exists() && adminSnap.data().role === 'admin';
    } catch (error) {
      console.error('Error checking admin role:', error);
      return false;
    }
  };
  
  // Kullanıcının herhangi bir admin rolüne sahip olup olmadığını kontrol et
  export const checkAnyAdminRole = async (userId: string): Promise<boolean> => {
    try {
      const adminRef = doc(adminUsersCollection, userId);
      const adminSnap = await getDoc(adminRef);
      
      return adminSnap.exists();
    } catch (error) {
      console.error('Error checking any admin role:', error);
      return false;
    }
  };
  
  // Kullanıcının belirli bir izne sahip olup olmadığını kontrol et
  export const checkPermission = async (userId: string, permission: string): Promise<boolean> => {
    try {
      const adminRef = doc(adminUsersCollection, userId);
      const adminSnap = await getDoc(adminRef);
      
      if (!adminSnap.exists()) return false;
      
      const data = adminSnap.data();
      return data.permissions && data.permissions.includes(permission);
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  };
  
  // Admin kullanıcı oluştur/güncelle
  export const saveAdminUser = async (adminUser: Partial<AdminUser>): Promise<string> => {
    try {
      if (!adminUser.userId) {
        throw new Error('userId is required');
      }
      
      const now = new Date();
      const adminRef = doc(adminUsersCollection, adminUser.userId);
      const adminSnap = await getDoc(adminRef);
      
      if (adminSnap.exists()) {
        // Güncelleme
        await setDoc(adminRef, {
          ...adminUser,
          updatedAt: now
        }, { merge: true });
      } else {
        // Yeni admin
        await setDoc(adminRef, {
          ...adminUser,
          permissions: adminUser.permissions || [],
          createdAt: now,
          updatedAt: now
        });
      }
      
      return adminUser.userId;
    } catch (error) {
      console.error('Error saving admin user:', error);
      throw error;
    }
  };
  
  // İlk admin kullanıcıyı oluştur (kurulum için)
  export const createInitialAdmin = async (userId: string, name: string): Promise<string> => {
    try {
      const adminRef = doc(adminUsersCollection, userId);
      const adminSnap = await getDoc(adminRef);
      
      // Zaten admin varsa işlem yapma
      if (adminSnap.exists()) {
        return userId;
      }
      
      // Admin kullanıcısı yok, oluştur
      const now = new Date();
      await setDoc(adminRef, {
        userId,
        name,
        role: 'admin',
        permissions: ['all'], // Tüm izinler
        createdAt: now,
        updatedAt: now
      });
      
      return userId;
    } catch (error) {
      console.error('Error creating initial admin:', error);
      throw error;
    }
  };

// Admin kullanıcıların listesini getir
export const getAdminUsers = async (): Promise<AdminUser[]> => {
    try {
      const q = query(adminUsersCollection, where('deleted', '!=', true));
      const querySnapshot = await getDocs(q);
      
      const admins: AdminUser[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        admins.push({
          userId: doc.id,
          role: data.role,
          permissions: data.permissions || [],
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        } as AdminUser);
      });
      
      return admins;
    } catch (error) {
      console.error('Error getting admin users:', error);
      throw error;
    }
  };