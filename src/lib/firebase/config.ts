// Firebase Mock Implementation
// Gerçek Firebase kullanıma geçildiğinde bu dosya güncellenmelidir

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, User } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase yapılandırma bilgileri
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "mock-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "mock-auth-domain",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "mock-project-id",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "mock-storage-bucket",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "mock-sender-id",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "mock-app-id",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "mock-measurement-id"
};

// Geliştirme ortamı için Firebase Mock implementasyonu
// Gerçek Firebase'e geçişte bu bölüm değiştirilmelidir
let mockAuth: Auth;
let mockFirestore: Firestore;
// 'any' tipi yerine FirebaseApp tipini kullanıyoruz
let mockApp: FirebaseApp | null = null;

// Firebase uygulamasını başlat
if (typeof window !== "undefined") {
  try {
    // Tarayıcı ortamında, gerçek Firebase'i yükle
    mockApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    mockAuth = getAuth(mockApp);
    mockFirestore = getFirestore(mockApp);
  } catch (error) {
    console.error("Firebase initialization error:", error);
    // Mock implementasyon oluştur
    mockAuth = {
      currentUser: null,
      onAuthStateChanged: (callback: (user: User | null) => void) => {
        callback(null);
        return () => {}; // Unsubscribe fonksiyonu
      }
    } as unknown as Auth;
    
    mockFirestore = {} as Firestore;
  }
} else {
  // Sunucu tarafında mock implementasyon
  mockAuth = {
    currentUser: null,
    onAuthStateChanged: (callback: (user: User | null) => void) => {
      callback(null);
      return () => {}; // Unsubscribe fonksiyonu
    }
  } as unknown as Auth;
  
  mockFirestore = {} as Firestore;
}

// Firebase hizmetleri
export const auth = mockAuth;
export const db = mockFirestore;
export const storage = mockApp ? getStorage(mockApp) : {} as unknown; // Mockup başarısız olursa boş nesne dön

export default mockApp;