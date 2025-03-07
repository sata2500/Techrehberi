// src/components/admin/ContentCalendar.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Calendar, Plus, FileText } from 'lucide-react';

// Takvim için tip tanımlamaları
type CalendarEvent = {
  id: string;
  title: string;
  date: Date;
  status: 'draft' | 'scheduled' | 'published';
  type: 'post' | 'content';
};

interface ContentCalendarProps {
  events?: CalendarEvent[];
  isLoading?: boolean;
}

const ContentCalendar: React.FC<ContentCalendarProps> = ({ 
  events = [], 
  isLoading = false 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<'month' | 'week'>('month');

  // Ay adlarını al
  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  // Gün adlarını al
  const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

  // Ay içindeki günleri al
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Ayın ilk gününün hangi gün olduğunu al (0 = Pazar, 1 = Pazartesi, vs.)
  const getFirstDayOfMonth = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    // Pazartesi'yi haftanın ilk günü olarak ayarla (0 = Pazartesi, 1 = Salı, vs.)
    return firstDay === 0 ? 6 : firstDay - 1;
  };

  // Şu anki ay ve yıl
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Ay içindeki gün sayısı
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);

  // Ayın ilk gününün hangi gün olduğu
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

  // Önceki aya geç
  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  // Sonraki aya geç
  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Bugünün tarihini kontrol et
  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  // Belirli bir gün için etkinlikleri getir
  const getEventsForDay = (day: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentMonth &&
        eventDate.getFullYear() === currentYear
      );
    });
  };

  // Yükleniyor durumu
  if (isLoading) {
    return (
      <div className="bg-card border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">İçerik Takvimi</h3>
        </div>
        <div className="h-96 bg-muted/30 animate-pulse rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-lg p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">İçerik Takvimi</h3>
        </div>
        
        <div className="flex items-center justify-between w-full sm:w-auto gap-2">
          <div className="flex-1 sm:flex-initial flex items-center gap-2">
            <button
              onClick={prevMonth}
              className="p-1 rounded-md hover:bg-accent"
              aria-label="Önceki ay"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <span className="text-sm font-medium">
              {monthNames[currentMonth]} {currentYear}
            </span>
            
            <button
              onClick={nextMonth}
              className="p-1 rounded-md hover:bg-accent"
              aria-label="Sonraki ay"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="bg-accent rounded-md flex text-sm">
            <button
              onClick={() => setCurrentView('month')}
              className={`px-3 py-1.5 rounded-md ${currentView === 'month' ? 'bg-primary text-primary-foreground' : ''}`}
            >
              Ay
            </button>
            <button
              onClick={() => setCurrentView('week')}
              className={`px-3 py-1.5 rounded-md ${currentView === 'week' ? 'bg-primary text-primary-foreground' : ''}`}
            >
              Hafta
            </button>
          </div>
          
          <Link 
            href="/admin/posts/create"
            className="px-2 py-1 bg-primary text-primary-foreground rounded-md text-sm flex items-center gap-1 hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni</span>
          </Link>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <div className="min-w-[768px]">
          {/* Gün isimleri */}
          <div className="grid grid-cols-7 mb-2">
            {dayNames.map((day, index) => (
              <div 
                key={index} 
                className="text-center py-2 text-sm font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>
          
          {/* Takvim günleri */}
          <div className="grid grid-cols-7 gap-1">
            {/* Önceki ayın boş günleri */}
            {Array.from({ length: firstDayOfMonth }).map((_, index) => (
              <div key={`empty-${index}`} className="h-24 border border-muted/30 rounded-md bg-muted/10 p-1"></div>
            ))}
            
            {/* Ayın günleri */}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const dayEvents = getEventsForDay(day);
              
              return (
                <div 
                  key={day} 
                  className={`h-24 border rounded-md p-1 ${
                    isToday(day) 
                      ? 'border-primary/50 bg-primary/5' 
                      : 'border-border hover:border-primary/30 hover:bg-muted/10'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className={`text-xs font-medium ${isToday(day) ? 'text-primary' : ''}`}>
                      {day}
                    </span>
                    
                    {dayEvents.length > 0 && (
                      <span className="text-xs px-1.5 py-0.5 bg-primary/10 rounded-md text-primary">
                        {dayEvents.length}
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-1 space-y-1 overflow-y-auto max-h-16">
                    {dayEvents.map((event) => (
                      <Link 
                        key={event.id}
                        href={`/admin/posts/edit/${event.id}`}
                        className={`
                          block text-xs truncate px-1.5 py-0.5 rounded 
                          ${event.status === 'published'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : event.status === 'scheduled'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400'
                          }
                        `}
                      >
                        {event.title}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Gösterge */}
      <div className="flex flex-wrap items-center gap-4 mt-6 justify-end">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-xs text-muted-foreground">Yayında</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-xs text-muted-foreground">Planlanmış</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <span className="text-xs text-muted-foreground">Taslak</span>
        </div>
      </div>
    </div>
  );
};

export default ContentCalendar;