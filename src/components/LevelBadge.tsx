import { cn } from '@/lib/utils';

interface LevelBadgeProps {
  level: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const LevelBadge = ({ level, showLabel = true, size = 'md', animated = false }: LevelBadgeProps) => {
  const getClassification = (level: number) => {
    if (level >= 8) return { label: 'GOD', class: 'bg-success/20 text-success border-success/30' };
    if (level >= 5) return { label: 'Sólido', class: 'bg-warning/20 text-warning border-warning/30' };
    return { label: 'Flojo', class: 'bg-destructive/20 text-destructive border-destructive/30' };
  };

  const classification = getClassification(level);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          'font-mono font-bold',
          size === 'sm' && 'text-lg',
          size === 'md' && 'text-2xl',
          size === 'lg' && 'text-3xl',
          animated && 'animate-level-up'
        )}
      >
        {level.toFixed(1)}
      </span>
      {showLabel && (
        <span
          className={cn(
            'rounded-full border font-semibold uppercase tracking-wider',
            sizeClasses[size],
            classification.class
          )}
        >
          {classification.label}
        </span>
      )}
    </div>
  );
};

export default LevelBadge;
