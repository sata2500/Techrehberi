// src/components/admin/ContentCreators.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FileText, Users, TrendingUp, BarChart2, Eye } from 'lucide-react';

// İçerik oluşturucu tipi
interface ContentCreator {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  postCount: number;
  viewCount: number;
  growth: number;
  lastActive: string;
}

interface ContentCreatorsProps {
  creators: ContentCreator[];
  title?: string;
  isLoading?: boolean;
  limit?: number;
}

const ContentCreators: React.FC<ContentCreatorsProps> = ({ 
  creators, 
  title = "İçerik Oluşturucular", 
  isLoading = false,
  limit = 5
}) => {
  // En aktif oluşturucuları sırala
  const sortedCreators = [...creators]
    .sort((a, b) => b.postCount - a.postCount || b.viewCount - a.viewCount)
    .slice(0, limit);
    
  if (isLoading) {
    return (
      <div className="bg-card border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted/50 rounded-full animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-muted/50 rounded-full w-24 animate-pulse"></div>
                  <div className="h-2 bg-muted/50 rounded-full w-16 animate-pulse"></div>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <div className="h-3 bg-muted/50 rounded-full w-16 animate-pulse"></div>
                <div className="h-2 bg-muted/50 rounded-full w-12 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (creators.length === 0) {
    return (
      <div className="bg-card border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        
        <div className="py-8 text-center text-muted-foreground">
          <BarChart2 className="w-12 h-12 mx-auto mb-2 text-muted" />
          <p>Henüz içerik oluşturucu bulunmuyor</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        
        <Link
          href="/admin/users"
          className="text-xs text-primary hover:underline"
        >
          Tümünü görüntüle
        </Link>
      </div>
      
      <div className="space-y-4">
        {sortedCreators.map((creator) => (
          <div key={creator.id} className="flex items-center justify-between py-3 border-b last:border-0">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted">
                {creator.avatar ? (
                  <Image
                    src={creator.avatar}
                    alt={creator.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-medium">
                    {creator.name.charAt(0)}
                  </div>
                )}
              </div>
              
              <div>
                <p className="text-sm font-medium">{creator.name}</p>
                <p className="text-xs text-muted-foreground">{creator.role}</p>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1">
                <FileText className="w-3 h-3 text-muted-foreground" />
                <span className="text-sm font-medium">{creator.postCount} yazı</span>
              </div>
              
              <div className="flex items-center text-xs text-muted-foreground">
                <Eye className="w-3 h-3 mr-1" />
                {creator.viewCount.toLocaleString()} görüntülenme
                
                {creator.growth !== 0 && (
                  <span className={`ml-2 flex items-center ${creator.growth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    <TrendingUp className="w-3 h-3 mr-0.5" />
                    {creator.growth}%
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentCreators;