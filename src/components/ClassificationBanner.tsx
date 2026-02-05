import { cn } from '@/lib/utils';
import { Flame, TrendingUp, Crown } from 'lucide-react';

interface ClassificationBannerProps {
  percentage: number;
  className?: string;
}

const ClassificationBanner = ({ percentage, className }: ClassificationBannerProps) => {
  const getClassification = () => {
    if (percentage >= 80) {
      return {
        label: 'GOD MODE',
        icon: Crown,
        gradient: 'from-success/20 to-success/5',
        textColor: 'text-success',
        borderColor: 'border-success/30',
        description: 'Absolute dominance. Keep this energy.',
      };
    }
    if (percentage >= 50) {
      return {
        label: 'SÓLIDO',
        icon: TrendingUp,
        gradient: 'from-warning/20 to-warning/5',
        textColor: 'text-warning',
        borderColor: 'border-warning/30',
        description: 'Good progress. Push for GOD status.',
      };
    }
    return {
      label: 'FLOJO',
      icon: Flame,
      gradient: 'from-destructive/20 to-destructive/5',
      textColor: 'text-destructive',
      borderColor: 'border-destructive/30',
      description: 'Time to lock in. You got this.',
    };
  };

  const classification = getClassification();
  const Icon = classification.icon;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border p-4',
        `bg-gradient-to-r ${classification.gradient}`,
        classification.borderColor,
        className
      )}
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            'p-3 rounded-xl',
            `bg-gradient-to-br ${classification.gradient}`
          )}
        >
          <Icon className={cn('w-6 h-6', classification.textColor)} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={cn('text-lg font-bold tracking-wider', classification.textColor)}>
              {classification.label}
            </span>
            <span className="font-mono text-2xl font-bold text-foreground">
              {Math.round(percentage)}%
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {classification.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClassificationBanner;
