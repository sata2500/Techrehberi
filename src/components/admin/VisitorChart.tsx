// src/components/admin/VisitorChart.tsx
import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { ViewsData } from '@/types/dashboard';

interface VisitorChartProps {
  data: ViewsData[];
  title?: string;
  isLoading?: boolean;
  period?: 'week' | 'month' | 'year';
  showControls?: boolean;
}

const VisitorChart: React.FC<VisitorChartProps> = ({ 
  data, 
  title = 'Site Trafiği', 
  isLoading = false,
  period = 'week',
  showControls = true
}) => {
  const [chartType, setChartType] = useState<'line' | 'area'>('area');
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>(period);

  // Seçilen periyoda göre verileri filtrele
  const getFilteredData = () => {
    if (selectedPeriod === 'week') {
      return data.slice(-7); // Son 7 gün
    } else if (selectedPeriod === 'month') {
      return data.slice(-30); // Son 30 gün
    }
    return data; // Tüm veriler (yıl için)
  };

  const filteredData = getFilteredData();

  // Verileri formatlama (1000 -> 1K)
  const formatYAxis = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  // Tarih formatını değiştirme
  const formatXAxis = (value: string) => {
    const date = new Date(value);
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
  };

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

  return (
    <div className="bg-card border rounded-lg p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="text-lg font-semibold">{title}</h3>
        
        {showControls && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-accent rounded-md flex text-sm">
              <button
                onClick={() => setSelectedPeriod('week')}
                className={`px-3 py-1.5 rounded-md ${selectedPeriod === 'week' ? 'bg-primary text-primary-foreground' : ''}`}
              >
                Hafta
              </button>
              <button
                onClick={() => setSelectedPeriod('month')}
                className={`px-3 py-1.5 rounded-md ${selectedPeriod === 'month' ? 'bg-primary text-primary-foreground' : ''}`}
              >
                Ay
              </button>
              <button
                onClick={() => setSelectedPeriod('year')}
                className={`px-3 py-1.5 rounded-md ${selectedPeriod === 'year' ? 'bg-primary text-primary-foreground' : ''}`}
              >
                Yıl
              </button>
            </div>
            
            <div className="bg-accent rounded-md flex text-sm">
              <button
                onClick={() => setChartType('line')}
                className={`px-3 py-1.5 rounded-md ${chartType === 'line' ? 'bg-primary text-primary-foreground' : ''}`}
              >
                Çizgi
              </button>
              <button
                onClick={() => setChartType('area')}
                className={`px-3 py-1.5 rounded-md ${chartType === 'area' ? 'bg-primary text-primary-foreground' : ''}`}
              >
                Alan
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart
              data={filteredData}
              margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#888" opacity={0.2} />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatXAxis}
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                tickFormatter={formatYAxis}
                axisLine={false} 
                tickLine={false} 
                width={40}
                tick={{ fontSize: 12 }} 
              />
              <Tooltip 
                formatter={(value: number) => [`${value} görüntülenme`, 'Görüntülenme']}
                labelFormatter={(label) => new Date(label).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="views" 
                name="Görüntülenme"
                stroke="var(--primary)" 
                strokeWidth={2}
                dot={{ r: 3, strokeWidth: 2, fill: 'var(--background)' }}
                activeDot={{ r: 6, strokeWidth: 2, fill: 'var(--background)' }}
              />
            </LineChart>
          ) : (
            <AreaChart
              data={filteredData}
              margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#888" opacity={0.2} />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatXAxis}
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                tickFormatter={formatYAxis}
                axisLine={false} 
                tickLine={false} 
                width={40}
                tick={{ fontSize: 12 }} 
              />
              <Tooltip 
                formatter={(value: number) => [`${value} görüntülenme`, 'Görüntülenme']}
                labelFormatter={(label) => new Date(label).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
              />
              <Legend />
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="views" 
                name="Görüntülenme"
                stroke="var(--primary)" 
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorViews)"
                dot={{ r: 3, strokeWidth: 2, fill: 'var(--background)' }}
                activeDot={{ r: 6, strokeWidth: 2, fill: 'var(--background)' }}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default VisitorChart;