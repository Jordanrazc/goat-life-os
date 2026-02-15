import { useState, useEffect, useCallback } from 'react';
import { Trophy, Flame, TrendingUp, Target, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: string;
  unlocked_at: string;
}

// Define all possible achievements
const ACHIEVEMENT_DEFS = [
  { name: 'Primera Racha 3', description: 'Completa 3 días seguidos', icon: 'Flame', type: 'streak', threshold: 3 },
  { name: 'Racha de Fuego 7', description: '7 días de racha', icon: 'Flame', type: 'streak', threshold: 7 },
  { name: 'Imparable 30', description: '30 días de racha', icon: 'Flame', type: 'streak', threshold: 30 },
  { name: 'Nivel 8', description: 'Alcanza nivel 8 en una categoría', icon: 'TrendingUp', type: 'level', threshold: 8 },
  { name: 'Nivel 9', description: 'Alcanza nivel 9 en una categoría', icon: 'TrendingUp', type: 'level', threshold: 9 },
  { name: 'Nivel Máximo', description: 'Alcanza nivel 10 en una categoría', icon: 'Trophy', type: 'level', threshold: 10 },
  { name: 'Primera Meta', description: 'Completa tu primera meta', icon: 'Target', type: 'goal', threshold: 1 },
  { name: 'GOD Mode', description: 'Logra 80%+ de completado diario', icon: 'Trophy', type: 'streak', threshold: 0 },
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Trophy, Flame, TrendingUp, Target,
};

const AchievementsSection = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAchievements = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('unlocked_at', { ascending: false });
      if (error) throw error;
      setAchievements(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchAchievements(); }, [fetchAchievements]);

  if (loading) {
    return <div className="space-y-2">
      <Skeleton className="h-8 w-32" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[1,2,3,4].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}
      </div>
    </div>;
  }

  const unlockedNames = new Set(achievements.map(a => a.name));

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-warning" /> Logros
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {ACHIEVEMENT_DEFS.map(def => {
          const unlocked = unlockedNames.has(def.name);
          const Icon = iconMap[def.icon] || Trophy;
          return (
            <div
              key={def.name}
              className={cn(
                'glass-card rounded-xl p-3 text-center transition-all',
                unlocked ? 'border-warning/50' : 'opacity-40'
              )}
            >
              <div className={cn(
                'w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2',
                unlocked ? 'bg-warning/20' : 'bg-muted'
              )}>
                {unlocked ? <Icon className="w-5 h-5 text-warning" /> : <Lock className="w-4 h-4 text-muted-foreground" />}
              </div>
              <p className="text-xs font-semibold">{def.name}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{def.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AchievementsSection;
