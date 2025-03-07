// src/components/admin/DashboardStats.tsx
import React from 'react';
import { 
  FileText, 
  Eye, 
  Users, 
  FolderOpen, 
  TrendingUp, 
  TrendingDown,
  Minus
} from 'lucide-react';
import { DashboardStats } from '@/types/dashboard';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  isLoading?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendLabel,
  isLoading = false
}) => {
  // Trend yönünü ve rengini belirle
  const getTrendIcon = () => {
    if (trend === undefined || trend === 0) return <Minus className="w-4 h-4" />;
    return trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };
  
  const getTrendColor = () => {
    if (trend === undefined || trend === 0) return "text-gray-500";
    return trend > 0 ? "text-green-500" : "text-red-500";
  };

  return (
    <div className="bg-card border rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          {isLoading ? (
            <div className="h-8 w-16 bg-muted animate-pulse rounded mt-1"></div>
          ) : (
            <h4 className="text-2xl font-bold">{value}</h4>
          )}
        </div>
        <div className="rounded-full bg-primary/10 p-3">
          {icon}
        </div>
      </div>
      
      {trend !== undefined && (
        <div className="mt-4 flex items-center text-xs">
          <span className={`flex items-center gap-1 ${getTrendColor()}`}>
            {getTrendIcon()}
            <span>{Math.abs(trend)}%</span>
          </span>
          <span className="ml-1.5 text-muted-foreground">{trendLabel || 'son 7 günde'}</span>
        </div>
      )}
    </div>
  );
};

interface DashboardStatsGridProps {
  stats: DashboardStats;
  isLoading?: boolean;
}

const DashboardStatsGrid: React.FC<DashboardStatsGridProps> = ({ stats, isLoading = false }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Toplam Yazı"
        value={stats.totalPosts}
        icon={<FileText className="w-5 h-5 text-primary" />}
        isLoading={isLoading}
      />
      
      <StatsCard
        title="Yayında"
        value={stats.publishedPosts}
        icon={<Eye className="w-5 h-5 text-green-600 dark:text-green-400" />}
        isLoading={isLoading}
      />
      
      <StatsCard
        title="Kategoriler"
        value={stats.totalCategories}
        icon={<FolderOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
        isLoading={isLoading}
      />
      
      <StatsCard
        title="Görüntülenme"
        value={stats.totalViews.toLocaleString()}
        icon={<Eye className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
        trend={stats.viewsTrend}
        isLoading={isLoading}
      />
    </div>
  );
};

export default DashboardStatsGrid;