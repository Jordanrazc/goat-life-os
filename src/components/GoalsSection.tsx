import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Plus, Trash2, Target, Minus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Category } from '@/types';
import { toast } from 'sonner';
import { differenceInDays } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

interface Goal {
  id: string;
  title: string;
  category_id: string;
  target_value: number;
  current_value: number;
  unit: string;
  start_date: string;
  end_date: string;
}

interface GoalsSectionProps {
  categories: Category[];
  isLoading: boolean;
}

const GoalsSection = ({ categories, isLoading }: GoalsSectionProps) => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [goalsLoading, setGoalsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [unit, setUnit] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [endDate, setEndDate] = useState('');
  const [customAmount, setCustomAmount] = useState('');

  const fetchGoals = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('goals_12_week')
        .select('*')
        .eq('user_id', user.id);
      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setGoalsLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchGoals(); }, [fetchGoals]);

  const createGoal = async () => {
    if (!user || !title || !targetValue || !unit || !endDate) return;
    try {
      const { error } = await supabase.from('goals_12_week').insert({
        title,
        target_value: parseFloat(targetValue),
        current_value: 0,
        unit,
        category_id: categoryId || categories[0]?.id,
        start_date: new Date().toISOString().split('T')[0],
        end_date: endDate,
        user_id: user.id,
      });
      if (error) throw error;
      toast.success('Meta creada');
      setDialogOpen(false);
      setTitle(''); setTargetValue(''); setUnit(''); setEndDate('');
      fetchGoals();
    } catch (error) {
      console.error(error);
      toast.error('Error al crear meta');
    }
  };

  const updateGoalValue = async (goalId: string, delta: number) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;
    const newValue = Math.max(0, goal.current_value + delta);
    setGoals(prev => prev.map(g => g.id === goalId ? { ...g, current_value: newValue } : g));
    try {
      await supabase.from('goals_12_week').update({ current_value: newValue }).eq('id', goalId);
    } catch (error) {
      console.error(error);
      fetchGoals();
    }
  };

  const deleteGoal = async (goalId: string) => {
    try {
      await supabase.from('goals_12_week').delete().eq('id', goalId);
      toast.success('Meta eliminada');
      fetchGoals();
    } catch (error) {
      console.error(error);
      toast.error('Error al eliminar');
    }
  };

  if (isLoading || goalsLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Metas / Objetivos</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2"><Plus className="w-4 h-4" /> Meta</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Nueva Meta</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Título</Label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ej: Ganar peso" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Valor objetivo</Label>
                  <Input type="number" value={targetValue} onChange={e => setTargetValue(e.target.value)} placeholder="10" />
                </div>
                <div>
                  <Label>Unidad</Label>
                  <Input value={unit} onChange={e => setUnit(e.target.value)} placeholder="kg, $, horas" />
                </div>
              </div>
              <div>
                <Label>Categoría</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    {categories.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Fecha límite</Label>
                <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
              </div>
              <Button onClick={createGoal} disabled={!title || !targetValue || !unit || !endDate} className="w-full">
                Crear Meta
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {goals.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Target className="w-10 h-10 mx-auto mb-2 opacity-50" />
          <p>Sin metas aún. ¡Agrega tu primera meta!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map(goal => {
            const percentage = goal.target_value > 0 ? Math.min(100, (goal.current_value / goal.target_value) * 100) : 0;
            const daysLeft = differenceInDays(new Date(goal.end_date), new Date());
            const cat = categories.find(c => c.id === goal.category_id);

            return (
              <div key={goal.id} className="glass-card rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{goal.title}</h3>
                    {cat && <span className="text-xs text-muted-foreground">{cat.name}</span>}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteGoal(goal.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono">{goal.current_value}</span>
                  <span className="text-muted-foreground">/ {goal.target_value} {goal.unit}</span>
                  <span className="ml-auto text-sm font-semibold text-primary">{percentage.toFixed(0)}%</span>
                </div>
                <Progress value={percentage} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {daysLeft > 0 ? `${daysLeft} días restantes` : daysLeft === 0 ? 'Último día' : 'Meta vencida'}
                </p>
                {/* Quick buttons */}
                <div className="flex flex-wrap gap-1.5">
                  {[-100, -10, -1].map(v => (
                    <Button key={v} variant="outline" size="sm" className="h-8 text-xs" onClick={() => updateGoalValue(goal.id, v)}>
                      {v}
                    </Button>
                  ))}
                  {[1, 10, 100].map(v => (
                    <Button key={v} variant="outline" size="sm" className="h-8 text-xs" onClick={() => updateGoalValue(goal.id, v)}>
                      +{v}
                    </Button>
                  ))}
                  <div className="flex items-center gap-1 ml-auto">
                    <Input
                      type="number"
                      className="h-8 w-20 text-xs"
                      placeholder="Cant."
                      value={customAmount}
                      onChange={e => setCustomAmount(e.target.value)}
                    />
                    <Button variant="secondary" size="sm" className="h-8 text-xs" onClick={() => {
                      const val = parseFloat(customAmount);
                      if (!isNaN(val)) { updateGoalValue(goal.id, val); setCustomAmount(''); }
                    }}>
                      Aplicar
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GoalsSection;
