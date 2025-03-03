import { NextApiRequest, NextApiResponse } from 'next';
import { searchContent } from '@/data/content';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { q } = req.query;

  if (!q || typeof q !== 'string') {
    return res.status(400).json({ 
      message: 'Invalid query parameter',
      results: [] 
    });
  }

  try {
    const results = searchContent(q);
    
    return res.status(200).json({
      query: q,
      count: results.length,
      results
    });
  } catch (error) {
    console.error('Arama sırasında hata:', error);
    return res.status(500).json({ 
      message: 'Arama işlemi sırasında bir hata oluştu',
      results: [] 
    });
  }
}