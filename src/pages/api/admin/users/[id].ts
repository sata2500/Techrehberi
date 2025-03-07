// src/pages/api/admin/users/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { withAdminAuth } from '@/lib/middleware/adminAuth';
import { saveAdminUser } from '@/lib/firebase/admin';

interface ExtendedNextApiRequest extends NextApiRequest {
  userId?: string;
}

async function handler(req: ExtendedNextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ success: false, error: 'Geçersiz ID' });
    }
    
    // PUT: Kullanıcı rolünü veya durumunu güncelle
    if (req.method === 'PUT') {
      const { role, disabled } = req.body;
      
      // Sadece admin kendi rolünü değiştiremez
      if (role && id === req.userId && role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Kendi admin rolünüzü değiştiremezsiniz'
        });
      }
      
      const userId = await saveAdminUser({
        userId: id,
        ...(role && { role }),
        ...(disabled !== undefined && { disabled }),
      });
      
      return res.status(200).json({ success: true, data: { id: userId } });
    }
    
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ success: false, error: 'Sunucu hatası' });
  }
}

export default withAdminAuth(handler);