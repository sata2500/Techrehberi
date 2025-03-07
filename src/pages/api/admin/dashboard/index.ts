// src/pages/api/admin/dashboard/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { withAdminAuth } from '@/lib/middleware/adminAuth';
import { getDashboardStats, getTrafficStats } from '@/lib/firebase/dashboard';

interface ExtendedNextApiRequest extends NextApiRequest {
  userId?: string;
}

async function handler(req: ExtendedNextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
    
    // Dashboard istatistiklerini getir
    const dashboardStats = await getDashboardStats();
    
    // Trafik istatistiklerini getir
    const trafficStats = await getTrafficStats();
    
    return res.status(200).json({ 
      success: true, 
      data: { 
        ...dashboardStats,
        trafficStats
      }
    });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
}

export default withAdminAuth(handler);