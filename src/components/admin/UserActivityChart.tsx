// src/components/admin/UserActivityChart.tsx
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
  LineChart,
  Line
} from 'recharts';
import { UserActivity } from '@/types/dashboard';

interface UserActivityChartProps {
  data: UserActivity[];
  title?: string;
  isLoading?: boolean;
  period?: 'week' | 'month';
  showControls?: boolean;
}

const UserActivityChart: React.FC<UserActivityChartProps> = ({
  data,
  title = 'Kullanıcı Aktivitesi',
  isLoading = false,
  period = 'week',
  showControls = true
}) => {
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>(period);

  // Seçilen periyoda göre verileri filtrele
  const getFilteredData = () => {
    if (selectedPeriod === 'week') {
      return data.slice(-7); // Son 7 gün
    }
    return data; // Tüm veriler (ay için)
  };

  const filteredData = getFilteredData();

  // Tarih formatını değiştirme
  const formatXAxis = (value: string) => {
    const date = new Date(value);
    return date.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' });
  };

  if (isLoading) {
    return (
      <div className="bg-card border rounded-lg p-6 h-80">
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
      <div className="bg-card border rounded-lg p-6 h-80">
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
            </div>
            
            <div className="bg-accent rounded-md flex text-sm">
              <button
                onClick={() => setChartType('bar')}
                className={`px-3 py-1.5 rounded-md ${chartType === 'bar' ? 'bg-primary text-primary-foreground' : ''}`}
              >
                Sütun
              </button>
              <button
                onClick={() => setChartType('line')}
                className={`px-3 py-1.5 rounded-md ${chartType === 'line' ? 'bg-primary text-primary-foreground' : ''}`}
              >
                Çizgi
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart
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
                axisLine={false} 
                tickLine={false} 
                width={40}
                tick={{ fontSize: 12 }} 
              />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  const label = name === 'newUsers' ? 'Yeni Kullanıcı' : 'Aktif Kullanıcı';
                  return [`${value} kullanıcı`, label];
                }}
                labelFormatter={(label) => new Date(label).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
              />
              <Legend />
              <Bar
                dataKey="newUsers"
                name="Yeni Kullanıcı"
                fill="#3b82f6"
                barSize={20}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="activeUsers"
                name="Aktif Kullanıcı"
                fill="#10b981"
                barSize={20}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          ) : (
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
                axisLine={false} 
                tickLine={false} 
                width={40}
                tick={{ fontSize: 12 }} 
              />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  const label = name === 'newUsers' ? 'Yeni Kullanıcı' : 'Aktif Kullanıcı';
                  return [`${value} kullanıcı`, label];
                }}
                labelFormatter={(label) => new Date(label).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="newUsers"
                name="Yeni Kullanıcı"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 3, strokeWidth: 2, fill: 'var(--background)' }}
                activeDot={{ r: 6, strokeWidth: 2, fill: 'var(--background)' }}
              />
              <Line
                type="monotone"
                dataKey="activeUsers"
                name="Aktif Kullanıcı"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 3, strokeWidth: 2, fill: 'var(--background)' }}
                activeDot={{ r: 6, strokeWidth: 2, fill: 'var(--background)' }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserActivityChart;