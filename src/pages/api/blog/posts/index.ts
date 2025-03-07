// src/pages/api/blog/posts/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getBlogPosts, saveBlogPost } from '@/lib/firebase/blog';
import { withAdminAuth } from '@/lib/middleware/adminAuth';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // GET: Blog yazılarını getir
    if (req.method === 'GET') {
      const { category, tag, status, featured, limit, page } = req.query;
      
      const { posts, lastVisible } = await getBlogPosts({
        category: category as string,
        tag: tag as string,
        status: status as 'draft' | 'published' | 'archived',
        featured: featured === 'true',
        limit: limit ? parseInt(limit as string) : 10
      });
      
      return res.status(200).json({
        success: true,
        data: posts,
        pagination: {
          lastVisible: lastVisible ? JSON.parse(JSON.stringify(lastVisible)) : null,
          hasMore: posts.length === (limit ? parseInt(limit as string) : 10)
        }
      });
    }
    
    // POST: Yeni blog yazısı oluştur
    if (req.method === 'POST') {
      const postId = await saveBlogPost(req.body);
      return res.status(201).json({ success: true, data: { id: postId } });
    }
    
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
}

export default withAdminAuth(handler);