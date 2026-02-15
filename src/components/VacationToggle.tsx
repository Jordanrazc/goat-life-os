import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Palmtree } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const VacationToggle = () => {
  const { user } = useAuth();
  const [isActive, setIsActive] = useState(false);
  const [daysUsed, setDaysUsed] = useState(0);
  const maxDays = 15;

  const fetchVacation = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('vacation_mode')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
    if (data) {
      setIsActive(data.is_active);
      setDaysUsed(data.days_used);
    }
  }, [user]);

  useEffect(() => { fetchVacation(); }, [fetchVacation]);

  const toggleVacation = async () => {
    if (!user) return;
    const newState = !isActive;

    if (newState && daysUsed >= maxDays) {
      toast.error('Has usado todos tus días de vacaciones');
      return;
    }

    try {
      const { data: existing } = await supabase
        .from('vacation_mode')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        await supabase.from('vacation_mode').update({
          is_active: newState,
          start_date: newState ? new Date().toISOString().split('T')[0] : null,
        }).eq('id', existing.id);
      } else {
        await supabase.from('vacation_mode').insert({
          user_id: user.id,
          is_active: newState,
          start_date: newState ? new Date().toISOString().split('T')[0] : null,
        });
      }

      setIsActive(newState);
      toast.success(newState ? 'Modo vacaciones activado (-0.05/día)' : 'Modo vacaciones desactivado');
    } catch (error) {
      console.error(error);
      toast.error('Error al cambiar modo vacaciones');
    }
  };

  return (
    <Button
      variant={isActive ? 'default' : 'outline'}
      size="sm"
      onClick={toggleVacation}
      className={cn('gap-2', isActive && 'bg-warning text-warning-foreground hover:bg-warning/90')}
    >
      <Palmtree className="w-4 h-4" />
      {isActive ? `Vacaciones (${daysUsed}/${maxDays})` : 'Vacaciones'}
    </Button>
  );
};

export default VacationToggle;
