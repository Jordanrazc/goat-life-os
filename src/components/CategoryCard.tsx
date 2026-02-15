import { cn } from '@/lib/utils';
import { Category } from '@/types';
import LevelBadge from './LevelBadge';
import { Brain, Dumbbell, Rocket, Video, Target, Sparkles, Heart, Zap, Sun, BookOpen, Music, Palette, Globe, Shield, Coffee, Star, Flame, Crown, Gem, Eye, Compass } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain, Dumbbell, Rocket, Video, Target, Sparkles, Heart, Zap, Sun,
  BookOpen, Music, Palette, Globe, Shield, Coffee, Star, Flame, Crown, Gem, Eye, Compass,
};

interface CategoryCardProps {
  category: Category;
  completedToday?: number;
  totalToday?: number;
  onClick?: () => void;
}

const CategoryCard = ({ category, completedToday = 0, totalToday = 0, onClick }: CategoryCardProps) => {
  const Icon = iconMap[category.icon] || Target;
  const percentage = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;

  return (
    <div
      onClick={onClick}
      className={cn(
        'glass-card rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-lg group',
        'border-l-4'
      )}
      style={{
        borderLeftColor: `hsl(var(--${category.color}))`,
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-lg transition-transform duration-300 group-hover:scale-110"
            style={{
              backgroundColor: `hsl(var(--${category.color}) / 0.15)`,
            }}
          >
            <Icon
              className="w-5 h-5"
              style={{ color: `hsl(var(--${category.color}))` }}
            />
          </div>
          <div>
            <h3 className="font-semibold">{category.name}</h3>
            {category.subtitle && (
              <p className="text-xs text-muted-foreground">{category.subtitle}</p>
            )}
          </div>
        </div>
        <LevelBadge level={category.level} size="sm" showLabel={false} />
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Today</span>
          <span>{completedToday}/{totalToday}</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${percentage}%`,
              backgroundColor: `hsl(var(--${category.color}))`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
