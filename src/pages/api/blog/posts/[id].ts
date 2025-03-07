// src/pages/api/blog/posts/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getBlogPost, saveBlogPost, deleteBlogPost } from '@/lib/firebase/blog';
import { logPostUpdated, logPostPublished } from '@/lib/firebase/activity';
import { withAdminAuth } from '@/lib/middleware/adminAuth';

interface ExtendedNextApiRequest extends NextApiRequest {
  userId?: string;
}

async function handler(req: ExtendedNextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ success: false, error: 'Invalid ID' });
    }
    
    // GET: Belirli bir blog yazısını getir
    if (req.method === 'GET') {
      const post = await getBlogPost(id);
      
      if (!post) {
        return res.status(404).json({ success: false, error: 'Post not found' });
      }
      
      return res.status(200).json({ success: true, data: post });
    }
    
    // PUT: Blog yazısını güncelle
    if (req.method === 'PUT') {
      const userId = req.userId || 'unknown';
      const authorName = req.body.author?.name || 'Admin';
      const { title, status, previousStatus } = req.body;
      
      // Yazıyı güncelle
      const postId = await saveBlogPost({ ...req.body, id });
      
      // Aktivite kaydı oluştur
      if (previousStatus !== 'published' && status === 'published') {
        // Yazı ilk kez yayınlandıysa
        await logPostPublished(userId, authorName, postId, title);
      } else {
        // Yazı güncellendiyse
        await logPostUpdated(userId, authorName, postId, title);
      }
      
      return res.status(200).json({ success: true, data: { id: postId } });
    }
    
    // DELETE: Blog yazısını sil
    if (req.method === 'DELETE') {
      await deleteBlogPost(id);
      return res.status(200).json({ success: true, data: { id } });
    }
    
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
}

export default withAdminAuth(handler);