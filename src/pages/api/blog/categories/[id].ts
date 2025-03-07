// src/pages/api/blog/categories/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { withAdminAuth } from '@/lib/middleware/adminAuth';
import { getCategory, saveCategory, deleteCategory } from '@/lib/firebase/blog';

interface ExtendedNextApiRequest extends NextApiRequest {
  userId?: string;
}

async function handler(req: ExtendedNextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ success: false, error: 'Geçersiz ID' });
    }
    
    // GET: Belirli bir kategoriyi getir
    if (req.method === 'GET') {
      const category = await getCategory(id);
      
      if (!category) {
        return res.status(404).json({ success: false, error: 'Kategori bulunamadı' });
      }
      
      return res.status(200).json({ success: true, data: category });
    }
    
    // PUT: Kategoriyi güncelle
    if (req.method === 'PUT') {
      const categoryId = await saveCategory({ ...req.body, id });
      return res.status(200).json({ success: true, data: { id: categoryId } });
    }
    
    // DELETE: Kategoriyi sil
    if (req.method === 'DELETE') {
      await deleteCategory(id);
      return res.status(200).json({ success: true, data: { id } });
    }
    
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ success: false, error: 'Sunucu hatası' });
  }
}

export default withAdminAuth(handler);