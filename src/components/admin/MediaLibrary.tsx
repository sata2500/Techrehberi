// src/components/admin/MediaLibrary.tsx
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { 
  X, 
  Upload, 
  Trash, 
  Search, 
  Filter, 
  Loader, 
  Image as ImageIcon,
  MoreVertical,
  FolderPlus,
  FileEdit,
  Copy,
  Check
} from 'lucide-react';

// Medya öğesi tipi
interface MediaItem {
  id: string;
  url: string;
  name: string;
  type: string;
  size: number;
  createdAt: string;
  folder?: string;
  dimensions?: {
    width: number;
    height: number;
  };
}

// MediaLibrary bileşeni için props
interface MediaLibraryProps {
  onSelect?: (media: MediaItem) => void;
  onClose?: () => void;
  isModal?: boolean;
  maxSelection?: number;
  selectedMedia?: string[];
  onMultiSelect?: (mediaItems: MediaItem[]) => void;
  allowedTypes?: string[];
}

export default function MediaLibrary({
  onSelect,
  onClose,
  isModal = true,
  maxSelection = 1,
  selectedMedia = [],
  onMultiSelect,
  allowedTypes = ['image/*']
}: MediaLibraryProps) {
  // State tanımlamaları
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>(selectedMedia);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [showDropzone, setShowDropzone] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  
  // Örnek medya klasörleri
  const folders = [
    { id: 'blog-images', name: 'Blog Görselleri' },
    { id: 'category-images', name: 'Kategori Görselleri' },
    { id: 'user-uploads', name: 'Kullanıcı Yüklemeleri' },
    { id: 'site-assets', name: 'Site Görselleri' }
  ];
  
  // Örnek medya öğeleri - gerçek uygulamada Firebase'den gelecek
  useEffect(() => {
    const fetchMedia = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Sahte API çağrısı
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Örnek medya öğeleri
        const mockMedia: MediaItem[] = Array.from({ length: 20 }).map((_, index) => ({
          id: `media-${index + 1}`,
          url: `/assets/images/media/image-${(index % 10) + 1}.jpg`,
          name: `image-${index + 1}.jpg`,
          type: 'image/jpeg',
          size: Math.floor(Math.random() * 1000000) + 100000, // Random size between 100KB-1MB
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
          folder: index % 4 === 0 ? 'blog-images' : 
                  index % 4 === 1 ? 'category-images' : 
                  index % 4 === 2 ? 'user-uploads' : 'site-assets',
          dimensions: {
            width: 800,
            height: 600
          }
        }));
        
        // Klasör filtreleme
        const filteredMedia = currentFolder 
          ? mockMedia.filter(item => item.folder === currentFolder)
          : mockMedia;
        
        setMediaItems(filteredMedia);
      } catch (err) {
        console.error('Medya yüklenirken hata:', err);
        setError('Medya öğeleri yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMedia();
  }, [currentFolder]);
  
  // Arama sonuçları
  const filteredMedia = mediaItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Seçim işleme
  const handleSelect = useCallback((media: MediaItem) => {
    if (maxSelection === 1) {
      // Tekli seçim
      setSelectedItems([media.id]);
      onSelect && onSelect(media);
    } else {
      // Çoklu seçim
      setSelectedItems(prev => {
        const isSelected = prev.includes(media.id);
        
        if (isSelected) {
          // Seçimi kaldır
          return prev.filter(id => id !== media.id);
        } else if (prev.length < maxSelection) {
          // Seçime ekle (maksimum sınırını aşmadıysa)
          return [...prev, media.id];
        }
        
        return prev;
      });
    }
  }, [maxSelection, onSelect]);
  
  // Çoklu seçimi onayla
  const confirmMultiSelection = useCallback(() => {
    if (onMultiSelect && selectedItems.length > 0) {
      const selectedMediaItems = mediaItems.filter(item => selectedItems.includes(item.id));
      onMultiSelect(selectedMediaItems);
    }
  }, [mediaItems, onMultiSelect, selectedItems]);
  
  // Dosya yükleme
  const handleFileUpload = useCallback((files: FileList) => {
    Array.from(files).forEach(file => {
      // Dosya tipi kontrolü
      const isAllowed = allowedTypes.some(type => {
        if (type.endsWith('/*')) {
          const mainType = type.split('/')[0];
          return file.type.startsWith(`${mainType}/`);
        }
        return type === file.type;
      });
      
      if (!isAllowed) {
        setError(`"${file.type}" tipi desteklenmiyor. İzin verilen tipler: ${allowedTypes.join(', ')}`);
        return;
      }
      
      // Yükleme başlat
      const uploadId = `upload-${Date.now()}-${file.name}`;
      setUploadProgress(prev => ({ ...prev, [uploadId]: 1 }));
      
      // Yükleme simülasyonu
      const simulateUpload = () => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.floor(Math.random() * 20) + 5;
          
          if (progress >= 100) {
            clearInterval(interval);
            progress = 100;
            
            // Yükleme tamamlandı, medya listesini güncelle
            setTimeout(() => {
              const newMedia: MediaItem = {
                id: `media-new-${Date.now()}`,
                url: URL.createObjectURL(file),
                name: file.name,
                type: file.type,
                size: file.size,
                createdAt: new Date().toISOString(),
                folder: currentFolder || 'user-uploads',
                dimensions: file.type.startsWith('image/') ? { width: 800, height: 600 } : undefined
              };
              
              setMediaItems(prev => [newMedia, ...prev]);
              setUploadProgress(prev => {
                const { [uploadId]: _, ...rest } = prev;
                return rest;
              });
            }, 500);
          }
          
          setUploadProgress(prev => ({ ...prev, [uploadId]: progress }));
        }, 200);
      };
      
      simulateUpload();
    });
  }, [allowedTypes, currentFolder]);
  
  // Sürükle bırak olayları
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    
    if (e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  }, [handleFileUpload]);
  
  // Medya silme
  const handleDelete = useCallback((mediaId: string) => {
    if (confirm('Bu medya öğesini silmek istediğinizden emin misiniz?')) {
      // Gerçek uygulamada Firebase'den silme işlemi yapılacak
      setMediaItems(prev => prev.filter(item => item.id !== mediaId));
      
      // Seçili öğeler listesinden de kaldır
      setSelectedItems(prev => prev.filter(id => id !== mediaId));
      
      // Detay görünümü açıksa kapat
      if (selectedItem?.id === mediaId) {
        setSelectedItem(null);
      }
    }
  }, [selectedItem]);
  
  // Dosya boyutu formatı
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  // Medya öğesi detaylarını göster
  const showMediaDetails = (media: MediaItem) => {
    setSelectedItem(media);
  };
  
  return (
    <div 
      className={`${isModal ? 'fixed inset-0 bg-black/50 flex items-center justify-center z-50' : 'w-full'}`}
      onClick={isModal ? onClose : undefined}
    >
      <div 
        className={`bg-background rounded-lg overflow-hidden flex flex-col ${
          isModal ? 'w-[900px] max-w-[90vw] max-h-[80vh]' : 'w-full h-full'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Başlık Çubuğu */}
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">Medya Kütüphanesi</h3>
          {isModal && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-accent rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        {/* Ana İçerik */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 min-h-0">
          {/* Kenar Çubuğu */}
          <div className="border-r p-4 md:col-span-1 overflow-y-auto">
            {/* Arama ve Filtreler */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Medya ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              </div>
            </div>
            
            {/* Yeni Yükleme */}
            <div className="mb-4">
              <button
                onClick={() => setShowDropzone(prev => !prev)}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>Yeni Medya Yükle</span>
              </button>
            </div>
            
            {/* Dropzone */}
            {showDropzone && (
              <div 
                className={`border-2 border-dashed rounded-md p-4 mb-4 text-center transition-colors ${
                  dragging ? 'border-primary bg-primary/5' : 'border-muted'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground mt-2 mb-2">
                  Dosyaları sürükleyip bırakın veya tıklayarak seçin
                </p>
                
                <label className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90 transition-colors text-sm inline-block">
                  <input
                    type="file"
                    className="hidden"
                    accept={allowedTypes.join(',')}
                    multiple
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                  />
                  <span>Dosya Seç</span>
                </label>
                
                <p className="text-xs text-muted-foreground mt-2">
                  İzin verilen tipler: {allowedTypes.join(', ')}
                </p>
              </div>
            )}
            
            {/* Yükleme Durumu */}
            {Object.keys(uploadProgress).length > 0 && (
              <div className="mb-4 space-y-2">
                <p className="text-sm font-medium">Yükleniyor...</p>
                {Object.entries(uploadProgress).map(([id, progress]) => (
                  <div key={id} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="truncate">{id.split('-').slice(2).join('-')}</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Klasörler */}
            <div>
              <h4 className="text-sm font-medium mb-2">Klasörler</h4>
              
              <div className="space-y-1">
                <button
                  onClick={() => setCurrentFolder(null)}
                  className={`w-full text-left px-2 py-1.5 rounded-md text-sm ${
                    currentFolder === null ? 'bg-accent font-medium' : 'hover:bg-accent/50'
                  }`}
                >
                  Tüm Medya
                </button>
                
                {folders.map(folder => (
                  <button
                    key={folder.id}
                    onClick={() => setCurrentFolder(folder.id)}
                    className={`w-full text-left px-2 py-1.5 rounded-md text-sm ${
                      currentFolder === folder.id ? 'bg-accent font-medium' : 'hover:bg-accent/50'
                    }`}
                  >
                    {folder.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Medya Listesi */}
          <div className="p-4 md:col-span-3 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <Loader className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-red-500 mb-2">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="text-sm text-primary hover:underline"
                >
                  Tekrar Dene
                </button>
              </div>
            ) : filteredMedia.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-muted-foreground mb-2">Hiç medya bulunamadı</p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-sm text-primary hover:underline"
                  >
                    Aramayı Temizle
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Görünüm ve Seçim Bilgisi */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setView('grid')}
                      className={`p-1 rounded-md ${view === 'grid' ? 'bg-accent' : 'hover:bg-accent/50'}`}
                      title="Izgara Görünümü"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                      </svg>
                    </button>
                    <button
                      onClick={() => setView('list')}
                      className={`p-1 rounded-md ${view === 'list' ? 'bg-accent' : 'hover:bg-accent/50'}`}
                      title="Liste Görünümü"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="8" y1="6" x2="21" y2="6"></line>
                        <line x1="8" y1="12" x2="21" y2="12"></line>
                        <line x1="8" y1="18" x2="21" y2="18"></line>
                        <line x1="3" y1="6" x2="3.01" y2="6"></line>
                        <line x1="3" y1="12" x2="3.01" y2="12"></line>
                        <line x1="3" y1="18" x2="3.01" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    {filteredMedia.length} öğe {searchTerm && `"${searchTerm}" için`} {currentFolder && folders.find(f => f.id === currentFolder)?.name && `${folders.find(f => f.id === currentFolder)?.name} klasöründe`}
                  </div>
                </div>
                
                {/* Izgara/Liste Görünümü */}
                {view === 'grid' ? (
                  // Izgara Görünümü
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredMedia.map(media => (
                      <div
                        key={media.id}
                        className={`relative border rounded-md overflow-hidden group cursor-pointer ${
                          selectedItems.includes(media.id) ? 'border-primary ring-2 ring-primary/20' : 'hover:border-primary/50'
                        }`}
                        onClick={() => handleSelect(media)}
                        onDoubleClick={() => showMediaDetails(media)}
                      >
                        <div className="aspect-square relative bg-muted">
                          {media.type.startsWith('image/') ? (
                            <Image
                              src={media.url}
                              alt={media.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full">
                              <ImageIcon className="w-8 h-8 text-muted-foreground" />
                              <span className="text-xs mt-1">{media.type.split('/')[1]}</span>
                            </div>
                          )}
                          
                          {/* Seçim İşareti */}
                          {selectedItems.includes(media.id) && (
                            <div className="absolute top-2 right-2 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            </div>
                          )}
                          
                          {/* İşlem Menüsü */}
                          <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  showMediaDetails(media);
                                }}
                                className="p-1 bg-background/80 backdrop-blur-sm rounded-md hover:bg-accent"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-2">
                          <p className="text-xs font-medium truncate" title={media.name}>
                            {media.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(media.size)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Liste Görünümü
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium">Ad</th>
                          <th className="px-4 py-2 text-left font-medium">Tür</th>
                          <th className="px-4 py-2 text-left font-medium">Boyut</th>
                          <th className="px-4 py-2 text-left font-medium">Klasör</th>
                          <th className="px-4 py-2 text-left font-medium">Tarih</th>
                          <th className="px-4 py-2 text-center font-medium">İşlemler</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMedia.map(media => (
                          <tr 
                            key={media.id}
                            className={`border-t hover:bg-accent/20 ${
                              selectedItems.includes(media.id) ? 'bg-primary/5' : ''
                            }`}
                            onClick={() => handleSelect(media)}
                          >
                            <td className="px-4 py-2">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-muted rounded-md overflow-hidden flex-shrink-0">
                                  {media.type.startsWith('image/') ? (
                                    <Image
                                      src={media.url}
                                      alt={media.name}
                                      width={32}
                                      height={32}
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <ImageIcon className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                  )}
                                </div>
                                <span className="truncate max-w-[150px]" title={media.name}>{media.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-2">{media.type.split('/')[1]}</td>
                            <td className="px-4 py-2">{formatFileSize(media.size)}</td>
                            <td className="px-4 py-2">{folders.find(f => f.id === media.folder)?.name || '-'}</td>
                            <td className="px-4 py-2">{new Date(media.createdAt).toLocaleDateString()}</td>
                            <td className="px-4 py-2 text-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  showMediaDetails(media);
                                }}
                                className="p-1 hover:bg-accent rounded-md"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Alt Çubuk */}
        {isModal && maxSelection > 1 && (
          <div className="p-4 border-t flex items-center justify-between">
            <div className="text-sm">
              {selectedItems.length} öğe seçildi {maxSelection > 0 && `(maksimum ${maxSelection})`}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedItems([])}
                className="px-3 py-1 text-sm bg-accent hover:bg-accent/80 rounded-md transition-colors"
              >
                Seçimi Temizle
              </button>
              
              <button
                onClick={confirmMultiSelection}
                disabled={selectedItems.length === 0}
                className="px-3 py-1 text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Seçimi Onayla
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Medya Detayları */}
      {selectedItem && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="bg-background rounded-lg w-[500px] max-w-[90vw] max-h-[80vh] overflow-hidden flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold truncate">{selectedItem.name}</h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 hover:bg-accent rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto">
              {/* Önizleme */}
              <div className="mb-4 bg-muted/50 border rounded-md p-2 flex items-center justify-center">
                {selectedItem.type.startsWith('image/') ? (
                  <div className="relative aspect-[4/3] w-full">
                    <Image
                      src={selectedItem.url}
                      alt={selectedItem.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center">
                    <ImageIcon className="w-16 h-16 text-muted-foreground" />
                    <span className="mt-2 text-muted-foreground">{selectedItem.type}</span>
                  </div>
                )}
              </div>
              
              {/* Detaylar */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Dosya Bilgileri</h4>
                  <div className="bg-muted/30 rounded-md p-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">Dosya Adı:</div>
                      <div className="font-medium truncate">{selectedItem.name}</div>
                      
                      <div className="text-muted-foreground">Dosya Tipi:</div>
                      <div>{selectedItem.type}</div>
                      
                      <div className="text-muted-foreground">Boyut:</div>
                      <div>{formatFileSize(selectedItem.size)}</div>
                      
                      <div className="text-muted-foreground">Klasör:</div>
                      <div>{folders.find(f => f.id === selectedItem.folder)?.name || '-'}</div>
                      
                      <div className="text-muted-foreground">Yükleme Tarihi:</div>
                      <div>{new Date(selectedItem.createdAt).toLocaleString()}</div>
                      
                      {selectedItem.dimensions && (
                        <>
                          <div className="text-muted-foreground">Boyutlar:</div>
                          <div>{selectedItem.dimensions.width} × {selectedItem.dimensions.height} px</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* URL ve Yollar */}
                <div>
                  <h4 className="text-sm font-medium mb-2">URL</h4>
                  <div className="flex items-center bg-muted/30 rounded-md overflow-hidden p-1">
                    <input
                      type="text"
                      value={selectedItem.url}
                      readOnly
                      className="flex-1 bg-transparent px-2 py-1 focus:outline-none text-sm"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedItem.url);
                      }}
                      className="p-1 hover:bg-accent rounded-md flex-shrink-0"
                      title="URL'yi Kopyala"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* İşlemler */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      // Düzenleme işlemleri
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-accent hover:bg-accent/80 rounded-md transition-colors text-sm"
                  >
                    <FileEdit className="w-4 h-4" />
                    <span>Düzenle</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      handleDelete(selectedItem.id);
                      setSelectedItem(null);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 rounded-md transition-colors text-sm"
                  >
                    <Trash className="w-4 h-4" />
                    <span>Sil</span>
                  </button>
                  
                  {onSelect && (
                    <button
                      onClick={() => {
                        onSelect(selectedItem);
                        setSelectedItem(null);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors text-sm ml-auto"
                    >
                      <Check className="w-4 h-4" />
                      <span>Seç ve Kullan</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}