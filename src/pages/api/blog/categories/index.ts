// src/pages/api/blog/categories/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getCategories, saveCategory } from '@/lib/firebase/blog';
import { withAdminAuth } from '@/lib/middleware/adminAuth';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // GET: Kategorileri getir
    if (req.method === 'GET') {
      const categories = await getCategories();
      return res.status(200).json({ success: true, data: categories });
    }
    
    // POST: Yeni kategori oluştur
    if (req.method === 'POST') {
      const categoryId = await saveCategory(req.body);
      return res.status(201).json({ success: true, data: { id: categoryId } });
    }
    
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
}

export default withAdminAuth(handler);