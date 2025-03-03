import { NextApiRequest, NextApiResponse } from 'next';
import { getVideoById } from '@/data/react-course';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid video ID' });
  }

  try {
    const video = await getVideoById(id);
    
    return res.status(200).json({
      id: video.videoId,
      title: video.title,
      url: video.streamUrl,
    });
  } catch (error) {
    console.error('Video alınırken hata:', error);
    return res.status(404).json({ message: 'Video bulunamadı' });
  }
}