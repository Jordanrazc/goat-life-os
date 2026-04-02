import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Category } from '@/types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, subMonths, addMonths, isSameDay, isToday, isFuture } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface HabitCalendarProps {
  categories: Category[];
}

interface DayData {
  date: Date;
  categoryCompletion: { categoryId: string; color: string; completed: number; total: number }[];
  totalCompleted: number;
  totalHabits: number;
}

const DAYS_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const HabitCalendar = ({ categories }: HabitCalendarProps) => {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthData, setMonthData] = useState<Record<string, DayData>>({});
  const [isLoading, setIsLoading] = useState(true);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = getDay(monthStart);

  useEffect(() => {
    if (!user || categories.length === 0) return;

    const fetchMonthData = async () => {
      setIsLoading(true);
      try {
        const startDate = format(monthStart, 'yyyy-MM-dd');
        const endDate = format(monthEnd, 'yyyy-MM-dd');

        // Fetch all habits
        const { data: habits } = await supabase
          .from('habits')
          .select('id, category_id, frequency')
          .eq('user_id', user.id);

        if (!habits || habits.length === 0) {
          setIsLoading(false);
          return;
        }

        // Fetch logs for the month
        const { data: logs } = await supabase
          .from('habit_logs')
          .select('habit_id, date, completed')
          .eq('user_id', user.id)
          .gte('date', startDate)
          .lte('date', endDate);

        // Build day data
        const dataMap: Record<string, DayData> = {};
        const dailyHabits = habits.filter(h => h.frequency === 'daily');

        for (const day of daysInMonth) {
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayLogs = (logs || []).filter(l => l.date === dateStr);

          // Group by category
          const catMap: Record<string, { completed: number; total: number; color: string }> = {};

          for (const habit of dailyHabits) {
            const cat = categories.find(c => c.id === habit.category_id);
            if (!cat) continue;

            if (!catMap[cat.id]) {
              catMap[cat.id] = { completed: 0, total: 0, color: cat.color };
            }
            catMap[cat.id].total++;

            const log = dayLogs.find(l => l.habit_id === habit.id);
            if (log?.completed) {
              catMap[cat.id].completed++;
            }
          }

          const categoryCompletion = Object.entries(catMap).map(([categoryId, data]) => ({
            categoryId,
            ...data,
          }));

          dataMap[dateStr] = {
            date: day,
            categoryCompletion,
            totalCompleted: categoryCompletion.reduce((s, c) => s + c.completed, 0),
            totalHabits: categoryCompletion.reduce((s, c) => s + c.total, 0),
          };
        }

        setMonthData(dataMap);
      } catch (error) {
        console.error('Error fetching calendar data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMonthData();
  }, [user, currentMonth, categories]);

  const monthLabel = format(currentMonth, 'MMMM yyyy', { locale: es });

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Calendario de Hábitos</h2>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCurrentMonth(prev => subMonths(prev, 1))}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium capitalize min-w-[140px] text-center">{monthLabel}</span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full rounded-lg" />
      ) : (
        <>
          {/* Day labels */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAYS_LABELS.map(d => (
              <div key={d} className="text-center text-xs text-muted-foreground font-medium py-1">{d}</div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for offset */}
            {Array.from({ length: startDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {daysInMonth.map(day => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const data = monthData[dateStr];
              const future = isFuture(day) && !isToday(day);
              const today = isToday(day);

              return (
                <div key={dateStr} className="aspect-square flex items-center justify-center relative">
                  <DayCell
                    day={day.getDate()}
                    data={data}
                    isToday={today}
                    isFuture={future}
                  />
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-border/50">
            {categories.slice(0, 6).map(cat => (
              <div key={cat.id} className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: `hsl(var(--${cat.color}))` }}
                />
                <span className="text-xs text-muted-foreground">{cat.name.split(' ')[0]}</span>
              </div>
            ))}
            {categories.length > 6 && (
              <span className="text-xs text-muted-foreground">+{categories.length - 6} más</span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

interface DayCellProps {
  day: number;
  data?: DayData;
  isToday: boolean;
  isFuture: boolean;
}

const DayCell = ({ day, data, isToday, isFuture }: DayCellProps) => {
  const size = 36;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  if (isFuture || !data || data.totalHabits === 0) {
    return (
      <div className={`w-9 h-9 flex items-center justify-center rounded-full text-xs
        ${isFuture ? 'text-muted-foreground/30' : 'text-muted-foreground/60'}
        ${isToday ? 'ring-2 ring-primary/50' : ''}
      `}>
        {day}
      </div>
    );
  }

  // Build arcs per category
  const segments = data.categoryCompletion.filter(c => c.total > 0);
  const totalSegments = segments.length;
  const segmentAngle = 360 / totalSegments;

  // Overall completion ratio
  const overallRatio = data.totalHabits > 0 ? data.totalCompleted / data.totalHabits : 0;

  return (
    <div className={`relative w-9 h-9 flex items-center justify-center ${isToday ? 'scale-110' : ''}`}>
      <svg width={size} height={size} className="absolute inset-0 -rotate-90">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          opacity={0.3}
        />

        {/* Category segments */}
        {segments.map((seg, i) => {
          const segLength = circumference / totalSegments;
          const filledLength = segLength * (seg.completed / seg.total);
          const offset = circumference - (segLength * i);

          return (
            <circle
              key={seg.categoryId}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={`hsl(var(--${seg.color}))`}
              strokeWidth={strokeWidth}
              strokeDasharray={`${filledLength} ${circumference - filledLength}`}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          );
        })}
      </svg>

      <span className={`relative z-10 text-xs font-medium
        ${overallRatio >= 0.8 ? 'text-success' : overallRatio >= 0.5 ? 'text-foreground' : 'text-muted-foreground'}
        ${isToday ? 'font-bold text-primary' : ''}
      `}>
        {day}
      </span>
    </div>
  );
};

export default HabitCalendar;
