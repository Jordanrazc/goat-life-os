import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useHabits } from '@/hooks/useHabits';
import { useCategories } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import RadarChart from '@/components/RadarChart';
import StatsCard from '@/components/StatsCard';
import HabitCard from '@/components/HabitCard';
import CategoryCard from '@/components/CategoryCard';
import ClassificationBanner from '@/components/ClassificationBanner';
import ProgressRing from '@/components/ProgressRing';
import { LogOut, Target, Calendar, Flame, TrendingUp, Plus, Settings } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { habits, toggleHabit, isLoading: habitsLoading } = useHabits();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const today = format(new Date(), 'EEEE, MMMM d');

  // Calculate stats
  const stats = useMemo(() => {
    const todayHabits = habits.filter(h => h.frequency === 'daily');
    const completed = todayHabits.filter(h => h.todayCompleted).length;
    const total = todayHabits.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;

    const streaks = habits.filter(h => (h.streak || 0) > 0);
    const maxStreak = streaks.length > 0 ? Math.max(...streaks.map(h => h.streak || 0)) : 0;

    return {
      completed,
      total,
      percentage,
      maxStreak,
      averageLevel: categories.length > 0 
        ? categories.reduce((acc, c) => acc + c.level, 0) / categories.length 
        : 7.0,
    };
  }, [habits, categories]);

  // Prepare radar chart data
  const radarData = useMemo(() => {
    return categories.map(cat => ({
      category: cat.name.split(' ')[0], // Use first word for readability
      level: cat.level,
      fullMark: 10,
    }));
  }, [categories]);

  // Filter habits by category
  const filteredHabits = useMemo(() => {
    if (!selectedCategory) return habits;
    return habits.filter(h => h.categoryId === selectedCategory);
  }, [habits, selectedCategory]);

  // Calculate category stats
  const getCategoryStats = (categoryId: string) => {
    const categoryHabits = habits.filter(h => h.categoryId === categoryId && h.frequency === 'daily');
    return {
      completed: categoryHabits.filter(h => h.todayCompleted).length,
      total: categoryHabits.length,
    };
  };

  const isLoading = habitsLoading || categoriesLoading;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Target className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg">10/10 GOAT</h1>
              <p className="text-xs text-muted-foreground">{today}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={signOut}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 py-6 space-y-6">
        {/* Classification Banner */}
        <ClassificationBanner percentage={stats.percentage} />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            <>
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </>
          ) : (
            <>
              <StatsCard
                title="Today"
                value={`${stats.completed}/${stats.total}`}
                subtitle="habits done"
                icon={Calendar}
                variant={stats.percentage >= 80 ? 'success' : stats.percentage >= 50 ? 'warning' : 'danger'}
              />
              <StatsCard
                title="Average Level"
                value={stats.averageLevel.toFixed(1)}
                subtitle="across categories"
                icon={TrendingUp}
                variant="primary"
              />
              <StatsCard
                title="Best Streak"
                value={stats.maxStreak}
                subtitle="consecutive days"
                icon={Flame}
                variant={stats.maxStreak > 7 ? 'success' : 'default'}
              />
              <div className="glass-card rounded-xl p-4 flex items-center justify-center">
                <ProgressRing percentage={stats.percentage} size={80} />
              </div>
            </>
          )}
        </div>

        {/* Radar Chart Section */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Life Balance</h2>
          {isLoading ? (
            <div className="flex items-center justify-center h-80">
              <Skeleton className="w-80 h-80 rounded-full" />
            </div>
          ) : radarData.length > 0 ? (
            <RadarChart data={radarData} size="lg" />
          ) : (
            <div className="flex items-center justify-center h-80 text-muted-foreground">
              <p>No categories yet</p>
            </div>
          )}
        </div>

        {/* Categories Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Categories</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className={!selectedCategory ? 'bg-muted' : ''}
            >
              All
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
              <>
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Skeleton key={i} className="h-28 rounded-xl" />
                ))}
              </>
            ) : (
              categories.map(category => {
                const catStats = getCategoryStats(category.id);
                return (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    completedToday={catStats.completed}
                    totalToday={catStats.total}
                    onClick={() => setSelectedCategory(
                      selectedCategory === category.id ? null : category.id
                    )}
                  />
                );
              })
            )}
          </div>
        </div>

        {/* Habits List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              {selectedCategory 
                ? `${categories.find(c => c.id === selectedCategory)?.name} Habits`
                : "Today's Habits"
              }
            </h2>
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Habit
            </Button>
          </div>
          <div className="space-y-2">
            {isLoading ? (
              <>
                {[1, 2, 3, 4, 5].map(i => (
                  <Skeleton key={i} className="h-20 rounded-xl" />
                ))}
              </>
            ) : filteredHabits.length > 0 ? (
              filteredHabits.map(habit => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onToggle={toggleHabit}
                />
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>No habits yet. Add your first habit to get started!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
