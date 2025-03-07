// src/components/admin/DashboardChart.tsx
import React, { FC } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TrafficData {
  date: string;
  views: number;
}

interface DashboardChartProps {
  data: TrafficData[];
  title?: string;
}

const DashboardChart: FC<DashboardChartProps> = ({ data, title = 'Haftalık Trafik' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-muted/30 rounded-md">
        <p className="text-muted-foreground">Henüz veri bulunmuyor</p>
      </div>
    );
  }
  
  return (
    <div className="h-64">
      <h3 className="text-base font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            className="text-xs text-muted-foreground" 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            className="text-xs text-muted-foreground"
          />
          <Tooltip 
            formatter={(value: number) => [`${value} görüntülenme`, 'Görüntülenme']}
            labelFormatter={(label) => `Tarih: ${label}`}
            contentStyle={{ 
              borderRadius: '0.375rem', 
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
              border: '1px solid var(--border)'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="views" 
            stroke="var(--primary)" 
            strokeWidth={2}
            dot={{ 
              stroke: 'var(--primary)', 
              strokeWidth: 2, 
              r: 4, 
              fill: 'var(--background)' 
            }}
            activeDot={{ 
              stroke: 'var(--primary)', 
              strokeWidth: 2, 
              r: 6, 
              fill: 'var(--background)' 
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DashboardChart;