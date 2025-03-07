// src/lib/firebase/admin-app.ts
import * as admin from 'firebase-admin';

// Firebase Admin SDK'yı başlat (eğer henüz başlatılmadıysa)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export const adminAuth = admin.auth();
export const adminFirestore = admin.firestore();