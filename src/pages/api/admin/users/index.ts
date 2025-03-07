// src/pages/api/admin/users/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { withAdminAuth } from '@/lib/middleware/adminAuth';
import { getAdminUsers } from '@/lib/firebase/admin';

interface ExtendedNextApiRequest extends NextApiRequest {
  userId?: string;
}

async function handler(req: ExtendedNextApiRequest, res: NextApiResponse) {
  try {
    // GET: Tüm kullanıcıları getir
    if (req.method === 'GET') {
      const users = await getAdminUsers();
      return res.status(200).json({ success: true, data: users });
    }
    
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ success: false, error: 'Sunucu hatası' });
  }
}

export default withAdminAuth(handler);