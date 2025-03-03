import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    browserSessionPersistence,
    setPersistence
  } from 'firebase/auth';
  import { auth } from './config';
  
  // Google ile giriş
  export const signInWithGoogle = async () => {
    try {
      // Oturum kalıcılığını ayarla
      await setPersistence(auth, browserSessionPersistence);
      
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return { success: true, user: result.user };
    } catch (error) {
      console.error('Google ile giriş hatası:', error);
      return { success: false, error };
    }
  };
  
  // Çıkış yap
  export const signOutUser = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Çıkış yaparken hata:', error);
      return { success: false, error };
    }
  };
  
  // Kullanıcı durumu kontrolü
  export const isUserLoggedIn = () => {
    return auth.currentUser !== null;
  };