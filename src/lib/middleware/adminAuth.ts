// src/lib/middleware/adminAuth.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { adminAuth } from '../firebase/admin-app';
import { checkAdminRole } from '../firebase/admin';

// NextApiRequest'i userId ekleyerek genişlet
interface ExtendedNextApiRequest extends NextApiRequest {
  userId?: string;
}

type ApiHandler = (req: ExtendedNextApiRequest, res: NextApiResponse) => Promise<void>;

export const withAdminAuth = (handler: ApiHandler): ApiHandler => {
  return async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
    try {
      // API rotalarında firebase auth tokenlarını manuel olarak doğrulama
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }
      
      const token = authHeader.split('Bearer ')[1];
      
      if (!token) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }
      
      // Firebase admin auth ile token doğrulama
      const decodedToken = await adminAuth.verifyIdToken(token);
      const userId = decodedToken.uid;
      
      // Admin rolünü kontrol et
      const isAdmin = await checkAdminRole(userId);
      
      if (!isAdmin) {
        return res.status(403).json({ success: false, error: 'Forbidden' });
      }
      
      // Doğrulanmış kullanıcı ID'sini request nesnesine ekle
      req.userId = userId;
      
      // Handler'ı çağır
      return handler(req, res);
    } catch (error) {
      console.error('API authorization error:', error);
      return res.status(401).json({ success: false, error: 'Authentication failed' });
    }
  };
};