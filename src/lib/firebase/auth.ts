// src/lib/firebase/auth.ts

import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  signOut,
  GoogleAuthProvider,
  updateProfile,
  UserCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

// Google Provider
const googleProvider = new GoogleAuthProvider();

// Google ile giriş yapma fonksiyonu
export const signInWithGoogle = async (): Promise<UserCredential> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    
    // Kullanıcı Firebase Authentication'da başarıyla oturum açtıktan sonra
    // Firestore veritabanında kullanıcı verilerini kontrol et/oluştur
    await createOrUpdateUserDocument(result.user);
    
    return result;
  } catch (error) {
    console.error('Google ile giriş yapma hatası:', error);
    throw error;
  }
};

// Kullanıcı dokümanını oluştur veya güncelle
export const createOrUpdateUserDocument = async (user: any) => {
  if (!user) return;

  // Kullanıcı doküman referansı
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  // Kullanıcı verisi yoksa oluştur
  if (!userSnap.exists()) {
    const { displayName, email, photoURL, uid } = user;
    
    try {
      await setDoc(userRef, {
        uid,
        displayName,
        email,
        photoURL,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        role: 'user',
        savedContents: [],
        readContents: [],
        readLaterContents: [],
        preferences: {
          newsletter: true,
          notifications: true
        }
      });
    } catch (error) {
      console.error('Kullanıcı dokümanı oluşturma hatası:', error);
    }
  } else {
    // Kullanıcı verisi varsa, güncellenme zamanını güncelle
    try {
      await setDoc(userRef, {
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (error) {
      console.error('Kullanıcı dokümanı güncelleme hatası:', error);
    }
  }

  return userRef;
};

// Email/password ile üye olma
export const registerWithEmailAndPassword = async (email: string, password: string, displayName: string): Promise<UserCredential> => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Kullanıcı profil bilgilerini güncelle
    await updateProfile(result.user, { displayName });
    
    // Firestore'da kullanıcı dokümanı oluştur
    await createOrUpdateUserDocument(result.user);
    
    return result;
  } catch (error) {
    console.error('Kayıt hatası:', error);
    throw error;
  }
};

// Email/password ile giriş
export const loginWithEmailAndPassword = async (email: string, password: string): Promise<UserCredential> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    
    // Kullanıcı verisini güncelle
    await createOrUpdateUserDocument(result.user);
    
    return result;
  } catch (error) {
    console.error('Giriş hatası:', error);
    throw error;
  }
};

// Şifre sıfırlama maili gönder
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Şifre sıfırlama hatası:', error);
    throw error;
  }
};

// Çıkış yap
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Çıkış yapma hatası:', error);
    throw error;
  }
};