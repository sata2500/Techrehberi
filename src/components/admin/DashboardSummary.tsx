// src/components/admin/DashboardSummary.tsx
import React from 'react';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye,
  MessageSquare,
  Clock,
  BookOpen
} from 'lucide-react';

interface SummaryItemProps {
  title: string;
  value: string | number;
  change?: number;
  period?: string;
  icon: React.ReactNode;
}

const SummaryItem: React.FC<SummaryItemProps> = ({ 
  title, 
  value, 
  change, 
  period = "son 30 gün", 
  icon 
}) => {
  // Trend ikonunu belirle
  const renderTrendIcon = () => {
    if (!change) return null;
    if (change > 0) return <TrendingUp className="w-3 h-3 text-green-500" />;
    if (change < 0) return <TrendingDown className="w-3 h-3 text-red-500" />;
    return null;
  };

  // Trend rengini belirle
  const getTrendColor = () => {
    if (!change) return "text-gray-500";
    return change > 0 ? "text-green-500" : "text-red-500";
  };

  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium">{title}</p>
          <div className="flex items-center gap-1.5 text-xs">
            {change !== undefined && (
              <span className={`flex items-center gap-0.5 ${getTrendColor()}`}>
                {renderTrendIcon()}
                <span>{Math.abs(change)}%</span>
              </span>
            )}
            <span className="text-muted-foreground">{period}</span>
          </div>
        </div>
      </div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
};

interface DashboardSummaryProps {
  data: {
    activeUsers?: number;
    userGrowth?: number;
    pageViews?: number;
    viewsGrowth?: number;
    avgTimeOnSite?: string;
    timeGrowth?: number;
    totalContent?: number;
    contentGrowth?: number;
    comments?: number;
    commentsGrowth?: number;
  };
  title?: string;
  isLoading?: boolean;
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({ 
  data, 
  title = "Site Performansı", 
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="space-y-6">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-muted/50 rounded-full animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-muted/50 rounded-full w-24 animate-pulse"></div>
                  <div className="h-2 bg-muted/50 rounded-full w-16 animate-pulse"></div>
                </div>
              </div>
              <div className="h-5 bg-muted/50 rounded-full w-12 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      
      <div className="space-y-1">
        <SummaryItem 
          title="Aktif Kullanıcılar" 
          value={data.activeUsers?.toLocaleString() || '0'} 
          change={data.userGrowth}
          icon={<Users className="w-4 h-4 text-blue-500" />}
        />
        
        <SummaryItem 
          title="Sayfa Görüntülenme" 
          value={data.pageViews?.toLocaleString() || '0'} 
          change={data.viewsGrowth}
          icon={<Eye className="w-4 h-4 text-green-500" />}
        />
        
        <SummaryItem 
          title="Ort. Oturum Süresi" 
          value={data.avgTimeOnSite || '0:00'} 
          change={data.timeGrowth}
          icon={<Clock className="w-4 h-4 text-purple-500" />}
        />
        
        <SummaryItem 
          title="Toplam İçerik" 
          value={data.totalContent?.toLocaleString() || '0'} 
          change={data.contentGrowth}
          icon={<BookOpen className="w-4 h-4 text-amber-500" />}
        />
        
        <SummaryItem 
          title="Yorumlar" 
          value={data.comments?.toLocaleString() || '0'} 
          change={data.commentsGrowth}
          period="son 7 gün"
          icon={<MessageSquare className="w-4 h-4 text-red-500" />}
        />
      </div>
    </div>
  );
};

export default DashboardSummary;