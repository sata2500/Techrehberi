// src/components/admin/TrendingTopics.tsx
import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  BarChart2,
  Tag,
  FileText
} from 'lucide-react';
import { TopicTrend } from '@/types/dashboard';

interface TrendingTopicsProps {
  topics: TopicTrend[];
  title?: string;
  isLoading?: boolean;
}

const TrendingTopics: React.FC<TrendingTopicsProps> = ({ 
  topics, 
  title = 'Trend Konular', 
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2 flex-1">
                <div className="w-8 h-8 bg-muted/50 rounded-full animate-pulse"></div>
                <div className="space-y-2">
                  <div className="w-32 h-3 bg-muted/50 rounded-full animate-pulse"></div>
                  <div className="w-20 h-2 bg-muted/50 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="w-16 h-4 bg-muted/50 rounded-full animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (topics.length === 0) {
    return (
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="py-8 text-center text-muted-foreground">
          <BarChart2 className="w-12 h-12 mx-auto mb-2 text-muted" />
          <p>Henüz trend veri bulunmuyor</p>
        </div>
      </div>
    );
  }

  // Trend yönünü ve rengini belirle
  const getTrendIcon = (trend: number) => {
    if (trend === 0) return <Minus className="w-4 h-4" />;
    return trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };
  
  const getTrendColor = (trend: number) => {
    if (trend === 0) return "text-muted-foreground";
    return trend > 0 ? "text-green-500" : "text-red-500";
  };

  return (
    <div className="bg-card border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-primary" />
          <span>{title}</span>
        </div>
      </h3>
      
      <div className="space-y-4">
        {topics.map((topic, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between border-b last:border-0 pb-3 last:pb-0"
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              
              <div>
                <p className="font-medium line-clamp-1">{topic.topic}</p>
                <p className="text-xs text-muted-foreground">
                  {topic.count} içerik
                </p>
              </div>
            </div>
            
            <div className={`flex items-center gap-1 ${getTrendColor(topic.trend)}`}>
              {getTrendIcon(topic.trend)}
              <span className="text-sm font-medium">{Math.abs(topic.trend)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingTopics;