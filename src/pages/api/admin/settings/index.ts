// src/pages/api/admin/settings/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { withAdminAuth } from '@/lib/middleware/adminAuth';
import { getSiteSettings, saveSiteSettings } from '@/lib/firebase/settings';

interface ExtendedNextApiRequest extends NextApiRequest {
  userId?: string;
}

async function handler(req: ExtendedNextApiRequest, res: NextApiResponse) {
  try {
    // GET: Site ayarlarını getir
    if (req.method === 'GET') {
      const settings = await getSiteSettings();
      return res.status(200).json({ success: true, data: settings });
    }
    
    // POST: Site ayarlarını kaydet
    if (req.method === 'POST') {
      const settingsId = await saveSiteSettings(req.body);
      return res.status(200).json({ success: true, data: { id: settingsId } });
    }
    
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ success: false, error: 'Sunucu hatası' });
  }
}

export default withAdminAuth(handler);