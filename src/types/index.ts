// 10/10 GOAT Life System - Type Definitions

export interface Category {
  id: string;
  name: string;
  subtitle: string;
  color: string;
  icon: string;
  level: number;
  userId: string;
}

export interface Habit {
  id: string;
  name: string;
  categoryId: string;
  isKey: boolean;
  frequency: 'daily' | 'weekly';
  userId: string;
  createdAt: string;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string;
  completed: boolean;
  userId: string;
}

export interface DailyStats {
  date: string;
  totalHabits: number;
  completedHabits: number;
  percentage: number;
  classification: 'flojo' | 'solido' | 'god';
}

export interface WeeklySummary {
  weekStart: string;
  weekEnd: string;
  totalHabits: number;
  completedHabits: number;
  percentage: number;
  streakDays: number;
  categoryBreakdown: CategoryStats[];
}

export interface CategoryStats {
  categoryId: string;
  categoryName: string;
  level: number;
  completedHabits: number;
  totalHabits: number;
  percentage: number;
}

export interface Goal12Week {
  id: string;
  title: string;
  categoryId: string;
  startDate: string;
  endDate: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  weeklyTargets: number[];
  userId: string;
}

export interface LevelHistory {
  id: string;
  categoryId: string;
  level: number;
  date: string;
  userId: string;
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
  createdAt: string;
}

export interface HabitWithCategory extends Habit {
  category: Category;
  todayCompleted?: boolean;
  streak?: number;
}
