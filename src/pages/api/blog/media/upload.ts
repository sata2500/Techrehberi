// src/pages/api/blog/media/upload.ts düzeltilmiş versiyon
import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm, Fields, Files, File as FormidableFile } from 'formidable';
import { withAdminAuth } from '@/lib/middleware/adminAuth';
import { uploadImage } from '@/lib/firebase/blog';

// Form veri analizi için formidable konfigürasyonu
export const config = {
  api: {
    bodyParser: false, // Form data'yı manuel olarak işlemek için bodyParser'ı devre dışı bırakıyoruz
  },
};

interface ExtendedNextApiRequest extends NextApiRequest {
  userId?: string;
}

// Formidable File tipi için geliştirilmiş arayüz
interface FormidableFileWithPath extends FormidableFile {
  filepath: string;
  originalFilename: string | null;
  mimetype: string | null;
  size: number;
}

async function handler(req: ExtendedNextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
    
    // Multipart form-data'yı ayrıştır
    const form = new IncomingForm({
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10 MB maksimum dosya boyutu
    });
    
    form.parse(req, async (err: Error | null, fields: Fields, files: Files) => {
      if (err) {
        return res.status(500).json({ success: false, error: 'File parsing error' });
      }
      
      try {
        // `files.file` tanımlı mı kontrol et
        if (!files.file) {
          return res.status(400).json({ success: false, error: 'No file uploaded' });
        }
        
        // Dosyayı al ve tür dönüşümü yap
        const file = Array.isArray(files.file) ? files.file[0] : files.file as FormidableFileWithPath;
        
        // `fields.folder` tanımlı mı kontrol et ve varsayılan değer ekle
        const folderField = fields.folder;
        const folder = folderField 
          ? (Array.isArray(folderField) ? folderField[0] : folderField) 
          : 'blog-images';
        
        // Firebase Storage'a dosyayı yükle
        const downloadUrl = await uploadImage({
          filepath: file.filepath,
          originalFilename: file.originalFilename || 'unnamed-file',
          mimetype: file.mimetype || 'application/octet-stream',
          size: file.size
        }, typeof folder === 'string' ? folder : 'blog-images');
        
        return res.status(200).json({
          success: true,
          data: {
            url: downloadUrl,
            filename: file.originalFilename || 'unnamed-file',
          },
        });
      } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({ success: false, error: 'File upload failed' });
      }
    });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
}

export default withAdminAuth(handler);