import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Category, HabitWithCategory } from '@/types';
import { toast } from 'sonner';

interface ManageHabitDialogProps {
  habit?: HabitWithCategory;
  categories: Category[];
  mode: 'add' | 'edit';
  onSuccess: () => void;
  trigger?: React.ReactNode;
}

const ManageHabitDialog = ({ habit, categories, mode, onSuccess, trigger }: ManageHabitDialogProps) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(habit?.name || '');
  const [categoryId, setCategoryId] = useState(habit?.categoryId || '');
  const [isKey, setIsKey] = useState(habit?.isKey || false);
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>(habit?.frequency || 'daily');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!user || !name.trim() || !categoryId) return;
    setLoading(true);
    try {
      if (mode === 'add') {
        const { error } = await supabase.from('habits').insert({
          name: name.trim(),
          category_id: categoryId,
          is_key: isKey,
          frequency,
          user_id: user.id,
        });
        if (error) throw error;
        toast.success('Hábito creado');
      } else if (habit) {
        const { error } = await supabase.from('habits').update({
          name: name.trim(),
          category_id: categoryId,
          is_key: isKey,
          frequency,
        }).eq('id', habit.id);
        if (error) throw error;
        toast.success('Hábito actualizado');
      }
      setOpen(false);
      setName(''); setCategoryId(''); setIsKey(false); setFrequency('daily');
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error('Error al guardar hábito');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!habit) return;
    setLoading(true);
    try {
      await supabase.from('habit_logs').delete().eq('habit_id', habit.id);
      const { error } = await supabase.from('habits').delete().eq('id', habit.id);
      if (error) throw error;
      toast.success('Hábito eliminado');
      setOpen(false);
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error('Error al eliminar hábito');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (v && habit) { setName(habit.name); setCategoryId(habit.categoryId); setIsKey(habit.isKey); setFrequency(habit.frequency); } }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" className="gap-2">
            {mode === 'add' ? <><Plus className="w-4 h-4" /> Hábito</> : <Pencil className="w-4 h-4" />}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Nuevo Hábito' : 'Editar Hábito'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Nombre</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Leer 30 min" />
          </div>
          <div>
            <Label>Categoría</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger><SelectValue placeholder="Seleccionar categoría" /></SelectTrigger>
              <SelectContent>
                {categories.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label>Frecuencia</Label>
            <Select value={frequency} onValueChange={v => setFrequency(v as 'daily' | 'weekly')}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Diario</SelectItem>
                <SelectItem value="weekly">Semanal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label>Hábito clave (afecta nivel)</Label>
            <Switch checked={isKey} onCheckedChange={setIsKey} />
          </div>
          <div className="flex gap-2 pt-2">
            <Button onClick={handleSubmit} disabled={loading || !name.trim() || !categoryId} className="flex-1">
              {loading ? 'Guardando...' : mode === 'add' ? 'Crear' : 'Guardar'}
            </Button>
            {mode === 'edit' && (
              <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManageHabitDialog;
