import { Check, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HabitWithCategory } from '@/types';

interface HabitCardProps {
  habit: HabitWithCategory;
  onToggle: (habitId: string, completed: boolean) => void;
  isLoading?: boolean;
}

const HabitCard = ({ habit, onToggle, isLoading }: HabitCardProps) => {
  const handleClick = () => {
    if (!isLoading) {
      onToggle(habit.id, !habit.todayCompleted);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'habit-card p-4 cursor-pointer select-none',
        habit.todayCompleted && 'completed bg-success/5',
        isLoading && 'opacity-50 pointer-events-none'
      )}
    >
      <div className="flex items-center gap-3">
        {/* Completion indicator */}
        <div
          className={cn(
            'w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300',
            habit.todayCompleted
              ? 'bg-success border-success'
              : 'border-muted-foreground/30 hover:border-primary/50'
          )}
        >
          {habit.todayCompleted && (
            <Check className="w-4 h-4 text-success-foreground" />
          )}
        </div>

        {/* Habit info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'font-medium transition-all duration-300',
                habit.todayCompleted && 'line-through text-muted-foreground'
              )}
            >
              {habit.name}
            </span>
            {habit.isKey && (
              <Star className="w-3.5 h-3.5 text-warning fill-warning" />
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: `hsl(var(--${habit.category.color}) / 0.15)`,
                color: `hsl(var(--${habit.category.color}))`,
              }}
            >
              {habit.category.name}
            </span>
            <span className="text-xs text-muted-foreground capitalize">
              {habit.frequency}
            </span>
          </div>
        </div>

        {/* Streak */}
        {habit.streak && habit.streak > 0 && (
          <div className="text-right">
            <span className="font-mono text-lg font-bold text-primary">
              {habit.streak}
            </span>
            <span className="text-xs text-muted-foreground block">streak</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitCard;
