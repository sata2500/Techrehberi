// src/components/admin/QuickActions.tsx
import React from 'react';
import Link from 'next/link';
import { 
  FileText, 
  FolderOpen, 
  Image, 
  Settings, 
  Users, 
  BarChart2,
  Plus,
  Upload,
  Search
} from 'lucide-react';

interface ActionButtonProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  color?: string;
  onClick?: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ 
  href, 
  icon, 
  label, 
  color = "bg-primary", 
  onClick 
}) => {
  const button = (
    <div 
      className={`${color} text-white p-4 rounded-lg transition-transform hover:scale-105 flex flex-col items-center justify-center h-full cursor-pointer`}
      onClick={onClick}
    >
      <div className="mb-2">{icon}</div>
      <span className="text-sm font-medium text-center">{label}</span>
    </div>
  );

  if (onClick) return button;

  return (
    <Link href={href} className="block h-full">
      {button}
    </Link>
  );
};

interface QuickActionsProps {
  title?: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({ 
  title = "Hızlı İşlemler" 
}) => {
  return (
    <div className="bg-card border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-6">{title}</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <ActionButton 
          href="/admin/posts/create" 
          icon={<FileText className="w-6 h-6" />} 
          label="Yeni Blog Yazısı" 
          color="bg-primary"
        />
        
        <ActionButton 
          href="/admin/categories/create" 
          icon={<FolderOpen className="w-6 h-6" />} 
          label="Yeni Kategori" 
          color="bg-blue-500"
        />
        
        <ActionButton 
          href="/admin/media" 
          icon={<Image className="w-6 h-6" />} 
          label="Medya Kütüphanesi"
          color="bg-purple-500" 
        />
        
        <ActionButton 
          href="/admin/users" 
          icon={<Users className="w-6 h-6" />} 
          label="Kullanıcılar" 
          color="bg-green-500"
        />
        
        <ActionButton 
          href="/admin/settings" 
          icon={<Settings className="w-6 h-6" />} 
          label="Site Ayarları" 
          color="bg-amber-500"
        />
        
        <ActionButton 
          href="/admin/content-calendar" 
          icon={<BarChart2 className="w-6 h-6" />} 
          label="İçerik Planı" 
          color="bg-red-500"
        />
        
        <ActionButton 
          href="#" 
          icon={<Upload className="w-6 h-6" />} 
          label="İçerik Yükle" 
          color="bg-indigo-500"
          onClick={() => alert('İçerik yükleme özelliği henüz eklenmedi!')}
        />
        
        <ActionButton 
          href="/admin/search" 
          icon={<Search className="w-6 h-6" />} 
          label="Gelişmiş Arama" 
          color="bg-teal-500"
        />
      </div>
    </div>
  );
};

export default QuickActions;