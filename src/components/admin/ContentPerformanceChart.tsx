// src/components/admin/ContentPerformanceChart.tsx
import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell
} from 'recharts';
import { CategoryData } from '@/types/dashboard';

interface ContentPerformanceChartProps {
  data: CategoryData[];
  title?: string;
  isLoading?: boolean;
}

const COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
  '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6',
  '#f97316', '#d946ef'
];

const ContentPerformanceChart: React.FC<ContentPerformanceChartProps> = ({ 
  data, 
  title = 'Kategori Dağılımı', 
  isLoading = false 
}) => {
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');

  if (isLoading) {
    return (
      <div className="bg-card border rounded-lg p-6 h-96">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="h-full w-full bg-muted/30 animate-pulse rounded flex items-center justify-center">
          <p className="text-muted-foreground">Veriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-card border rounded-lg p-6 h-96">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="h-full w-full bg-muted/30 rounded flex items-center justify-center">
          <p className="text-muted-foreground">Henüz veri bulunmuyor</p>
        </div>
      </div>
    );
  }

  // İçerik aşırı dolduğunda aralara boşluk ekle
  const getBarSize = () => {
    return data.length > 10 ? 30 : 40;
  };

  return (
    <div className="bg-card border rounded-lg p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="text-lg font-semibold">{title}</h3>
        
        <div className="bg-accent rounded-md flex text-sm">
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-1.5 rounded-md ${chartType === 'bar' ? 'bg-primary text-primary-foreground' : ''}`}
          >
            Sütun
          </button>
          <button
            onClick={() => setChartType('pie')}
            className={`px-3 py-1.5 rounded-md ${chartType === 'pie' ? 'bg-primary text-primary-foreground' : ''}`}
          >
            Pasta
          </button>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#888" opacity={0.2} />
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                dataKey="name"
                type="category"
                axisLine={false}
                tickLine={false}
                width={120}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value: number, name: string) => [`${value} yazı`, 'Yazı Sayısı']}
              />
              <Legend />
              <Bar
                dataKey="count"
                name="Yazı Sayısı"
                fill="var(--primary)"
                barSize={getBarSize()}
                radius={[0, 4, 4, 0]}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={2}
                dataKey="count"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number, name: string, props: any) => {
                  return [`${value} yazı (${props.payload.percentage}%)`, props.payload.name];
                }}
              />
              <Legend />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ContentPerformanceChart;