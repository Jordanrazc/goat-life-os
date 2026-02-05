import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { HabitWithCategory, Category } from '@/types';
import { CATEGORIES, SEED_HABITS, LEVEL_CONFIG } from '@/lib/constants';
import { format } from 'date-fns';
import { toast } from 'sonner';

export const useHabits = () => {
  const { user } = useAuth();
  const [habits, setHabits] = useState<HabitWithCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHabits = useCallback(async () => {
    if (!user) {
      setHabits([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const today = format(new Date(), 'yyyy-MM-dd');

      // Fetch habits with categories
      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select(`
          *,
          categories(*),
          habit_logs(*)
        `)
        .eq('user_id', user.id);

      if (habitsError) throw habitsError;

      if (!habitsData || habitsData.length === 0) {
        // Seed habits for new users
        await seedUserData(user.id);
        fetchHabits();
        return;
      }

      // Map habits with today's completion status
      const mappedHabits: HabitWithCategory[] = habitsData.map((habit) => {
        const todayLog = habit.habit_logs?.find((log) => log.date === today);
        const categoryData = habit.categories as any;
        return {
          id: habit.id,
          name: habit.name,
          categoryId: habit.category_id,
          isKey: habit.is_key,
          frequency: habit.frequency as 'daily' | 'weekly',
          userId: habit.user_id,
          createdAt: habit.created_at,
          category: {
            id: categoryData?.id || '',
            name: categoryData?.name || '',
            subtitle: categoryData?.subtitle || '',
            color: categoryData?.color || '',
            icon: categoryData?.icon || '',
            level: categoryData?.level || 7.0,
            userId: categoryData?.user_id || '',
          },
          todayCompleted: todayLog?.completed || false,
          streak: 0, // TODO: Calculate streak
        };
      });

      setHabits(mappedHabits);
    } catch (error) {
      console.error('Error fetching habits:', error);
      toast.error('Failed to load habits');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const seedUserData = async (userId: string) => {
    try {
      // Create categories
      const categoryInserts = CATEGORIES.map(cat => ({
        name: cat.name,
        subtitle: cat.subtitle,
        color: cat.color,
        icon: cat.icon,
        level: LEVEL_CONFIG.BASE_LEVEL,
        user_id: userId,
      }));

      const { data: insertedCategories, error: catError } = await supabase
        .from('categories')
        .insert(categoryInserts)
        .select();

      if (catError) throw catError;
      if (!insertedCategories) throw new Error('No categories inserted');

      // Create category ID mapping
      const categoryMap: Record<string, string> = {};
      CATEGORIES.forEach((cat, index) => {
        categoryMap[cat.id] = insertedCategories[index].id;
      });

      // Create habits
      const habitInserts = SEED_HABITS.map(habit => ({
        name: habit.name,
        category_id: categoryMap[habit.categoryId],
        is_key: habit.isKey,
        frequency: habit.frequency,
        user_id: userId,
      }));

      const { error: habitsError } = await supabase
        .from('habits')
        .insert(habitInserts);

      if (habitsError) throw habitsError;

      toast.success('Welcome! Your habits have been set up.');
    } catch (error) {
      console.error('Error seeding data:', error);
    }
  };

  const toggleHabit = async (habitId: string, completed: boolean) => {
    if (!user) return;

    const today = format(new Date(), 'yyyy-MM-dd');

    try {
      // Optimistic update
      setHabits(prev =>
        prev.map(h =>
          h.id === habitId ? { ...h, todayCompleted: completed } : h
        )
      );

      // Check if log exists
      const { data: existingLog } = await supabase
        .from('habit_logs')
        .select()
        .eq('habit_id', habitId)
        .eq('date', today)
        .maybeSingle();

      if (existingLog) {
        // Update existing log
        await supabase
          .from('habit_logs')
          .update({ completed })
          .eq('id', existingLog.id);
      } else {
        // Create new log
        await supabase
          .from('habit_logs')
          .insert({
            habit_id: habitId,
            date: today,
            completed,
            user_id: user.id,
          });
      }

      // Update category level if key habit
      const habit = habits.find(h => h.id === habitId);
      if (habit?.isKey) {
        await updateCategoryLevel(habit.categoryId, completed);
      }
    } catch (error) {
      console.error('Error toggling habit:', error);
      // Revert optimistic update
      setHabits(prev =>
        prev.map(h =>
          h.id === habitId ? { ...h, todayCompleted: !completed } : h
        )
      );
      toast.error('Failed to update habit');
    }
  };

  const updateCategoryLevel = async (categoryId: string, completed: boolean) => {
    const category = habits.find(h => h.categoryId === categoryId)?.category;
    if (!category) return;

    let newLevel = category.level;
    if (completed) {
      // Increase level slowly for completed habits
      newLevel = Math.min(LEVEL_CONFIG.MAX_LEVEL, newLevel + 0.05);
    } else {
      // Decrease for missed key habits
      newLevel = Math.max(LEVEL_CONFIG.MIN_LEVEL, newLevel - LEVEL_CONFIG.KEY_HABIT_PENALTY);
    }

    try {
      await supabase
        .from('categories')
        .update({ level: newLevel })
        .eq('id', categoryId);
    } catch (error) {
      console.error('Error updating category level:', error);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  return {
    habits,
    isLoading,
    toggleHabit,
    refetch: fetchHabits,
  };
};
