// src/components/admin/BlogPostEditor.tsx
import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  Quote,
  Undo,
  Redo
} from 'lucide-react';
import styles from '@/styles/BlogEditor.module.css'; // Bu dosyayı daha sonra oluşturacağız

interface BlogPostEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function BlogPostEditor({ content, onChange }: BlogPostEditorProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkMenu, setShowLinkMenu] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showImageMenu, setShowImageMenu] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: 'İçeriği buraya yazın...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Bileşen monte edildikten sonra işlemleri yap
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // İlk yüklemede içeriği ayarla
  useEffect(() => {
    if (editor && content && editor.isEmpty) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  // Link ekleme
  const setLink = () => {
    if (!linkUrl) return;

    // Geçerli bir URL'ye dönüştür
    let url = linkUrl;
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }
    
    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    setLinkUrl('');
    setShowLinkMenu(false);
  };

  // Görsel ekleme
  const addImage = () => {
    if (!imageUrl) return;

    editor?.chain().focus().setImage({ src: imageUrl }).run();
    setImageUrl('');
    setShowImageMenu(false);
  };

  if (!isMounted) {
    return null;
  }

  if (!editor) {
    return <div>Editör yükleniyor...</div>;
  }

  return (
    <div className="border border-input rounded-md overflow-hidden">
      {/* Toolbar */}
      <div className="bg-muted p-2 flex flex-wrap gap-1 border-b">
        {/* Metin Biçimlendirme */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-accent ${editor.isActive('bold') ? 'bg-accent' : ''}`}
          title="Kalın"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-accent ${editor.isActive('italic') ? 'bg-accent' : ''}`}
          title="İtalik"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-2 rounded hover:bg-accent ${editor.isActive('code') ? 'bg-accent' : ''}`}
          title="Kod"
        >
          <Code className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-border mx-1 self-center"></div>

        {/* Başlıklar */}
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-accent ${editor.isActive('heading', { level: 1 }) ? 'bg-accent' : ''}`}
          title="Başlık 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-accent ${editor.isActive('heading', { level: 2 }) ? 'bg-accent' : ''}`}
          title="Başlık 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded hover:bg-accent ${editor.isActive('heading', { level: 3 }) ? 'bg-accent' : ''}`}
          title="Başlık 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-border mx-1 self-center"></div>

        {/* Paragraf Biçimlendirme */}
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`p-2 rounded hover:bg-accent ${editor.isActive('paragraph') ? 'bg-accent' : ''}`}
          title="Paragraf"
        >
          <Pilcrow className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-accent ${editor.isActive('bulletList') ? 'bg-accent' : ''}`}
          title="Madde İşaretli Liste"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-accent ${editor.isActive('orderedList') ? 'bg-accent' : ''}`}
          title="Numaralandırılmış Liste"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-accent ${editor.isActive('blockquote') ? 'bg-accent' : ''}`}
          title="Alıntı"
        >
          <Quote className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-border mx-1 self-center"></div>

        {/* Hizalama */}
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 rounded hover:bg-accent ${editor.isActive({ textAlign: 'left' }) ? 'bg-accent' : ''}`}
          title="Sola Hizala"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 rounded hover:bg-accent ${editor.isActive({ textAlign: 'center' }) ? 'bg-accent' : ''}`}
          title="Ortala"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 rounded hover:bg-accent ${editor.isActive({ textAlign: 'right' }) ? 'bg-accent' : ''}`}
          title="Sağa Hizala"
        >
          <AlignRight className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-border mx-1 self-center"></div>

        {/* Ek Özellikler */}
        <div className="relative">
          <button
            onClick={() => setShowLinkMenu(!showLinkMenu)}
            className={`p-2 rounded hover:bg-accent ${editor.isActive('link') ? 'bg-accent' : ''}`}
            title="Link Ekle"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          
          {showLinkMenu && (
            <div className="absolute top-full left-0 mt-1 bg-card border rounded-md p-2 z-10 w-64">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="URL girin"
                  className="flex-1 px-2 py-1 bg-background border border-input rounded-md text-sm"
                  onKeyDown={(e) => e.key === 'Enter' && setLink()}
                />
                <button
                  onClick={setLink}
                  className="px-2 py-1 bg-primary text-primary-foreground rounded-md text-sm"
                >
                  Ekle
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowImageMenu(!showImageMenu)}
            className={`p-2 rounded hover:bg-accent`}
            title="Görsel Ekle"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
          
          {showImageMenu && (
            <div className="absolute top-full left-0 mt-1 bg-card border rounded-md p-2 z-10 w-64">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Görsel URL'si girin"
                  className="flex-1 px-2 py-1 bg-background border border-input rounded-md text-sm"
                  onKeyDown={(e) => e.key === 'Enter' && addImage()}
                />
                <button
                  onClick={addImage}
                  className="px-2 py-1 bg-primary text-primary-foreground rounded-md text-sm"
                >
                  Ekle
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-border mx-1 self-center"></div>

        {/* Geri Al / İleri Al */}
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className={`p-2 rounded hover:bg-accent ${!editor.can().undo() ? 'opacity-50' : ''}`}
          title="Geri Al"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className={`p-2 rounded hover:bg-accent ${!editor.can().redo() ? 'opacity-50' : ''}`}
          title="İleri Al"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Editör İçeriği */}
      <EditorContent editor={editor} className="prose max-w-none p-4 min-h-[300px]" />
    </div>
  );
}