import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Brain, Dumbbell, Rocket, Video, Target, Sparkles, Heart, Zap, Sun, Plus, Pencil, Trash2, BookOpen, Music, Palette, Globe, Shield, Coffee, Star, Flame, Crown, Gem, Eye, Compass } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Category } from '@/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const AVAILABLE_ICONS = [
  { name: 'Brain', component: Brain },
  { name: 'Dumbbell', component: Dumbbell },
  { name: 'Rocket', component: Rocket },
  { name: 'Video', component: Video },
  { name: 'Target', component: Target },
  { name: 'Sparkles', component: Sparkles },
  { name: 'Heart', component: Heart },
  { name: 'Zap', component: Zap },
  { name: 'Sun', component: Sun },
  { name: 'BookOpen', component: BookOpen },
  { name: 'Music', component: Music },
  { name: 'Palette', component: Palette },
  { name: 'Globe', component: Globe },
  { name: 'Shield', component: Shield },
  { name: 'Coffee', component: Coffee },
  { name: 'Star', component: Star },
  { name: 'Flame', component: Flame },
  { name: 'Crown', component: Crown },
  { name: 'Gem', component: Gem },
  { name: 'Eye', component: Eye },
  { name: 'Compass', component: Compass },
];

const CATEGORY_COLORS = [
  { name: 'category-intelecto', label: 'Azul' },
  { name: 'category-fisico', label: 'Verde' },
  { name: 'category-proyecto', label: 'Morado' },
  { name: 'category-contenido', label: 'Rosa' },
  { name: 'category-disciplina', label: 'Naranja' },
  { name: 'category-estilo', label: 'Magenta' },
  { name: 'category-relaciones', label: 'Rojo' },
  { name: 'category-aura', label: 'Teal' },
  { name: 'category-espiritualidad', label: 'Lavanda' },
];

interface ManageCategoryDialogProps {
  category?: Category;
  mode: 'add' | 'edit';
  onSuccess: () => void;
  trigger?: React.ReactNode;
}

const ManageCategoryDialog = ({ category, mode, onSuccess, trigger }: ManageCategoryDialogProps) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(category?.name || '');
  const [subtitle, setSubtitle] = useState(category?.subtitle || '');
  const [icon, setIcon] = useState(category?.icon || 'Target');
  const [color, setColor] = useState(category?.color || 'category-intelecto');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!user || !name.trim()) return;
    setLoading(true);

    try {
      if (mode === 'add') {
        const { error } = await supabase.from('categories').insert({
          name: name.trim(),
          subtitle: subtitle.trim() || null,
          icon,
          color,
          user_id: user.id,
          level: 7.0,
        });
        if (error) throw error;
        toast.success('Categoría creada');
      } else if (category) {
        const { error } = await supabase.from('categories').update({
          name: name.trim(),
          subtitle: subtitle.trim() || null,
          icon,
          color,
        }).eq('id', category.id);
        if (error) throw error;
        toast.success('Categoría actualizada');
      }
      setOpen(false);
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error('Error al guardar categoría');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!category) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('categories').delete().eq('id', category.id);
      if (error) throw error;
      toast.success('Categoría eliminada');
      setOpen(false);
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error('Error al eliminar. Elimina primero los hábitos asociados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (v && category) { setName(category.name); setSubtitle(category.subtitle); setIcon(category.icon); setColor(category.color); } }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant={mode === 'add' ? 'default' : 'ghost'} className="gap-2">
            {mode === 'add' ? <><Plus className="w-4 h-4" /> Categoría</> : <Pencil className="w-4 h-4" />}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Nueva Categoría' : 'Editar Categoría'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Nombre</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Finanzas" />
          </div>
          <div>
            <Label>Subtítulo (opcional)</Label>
            <Input value={subtitle} onChange={e => setSubtitle(e.target.value)} placeholder="Ej: Meta 2027" />
          </div>
          <div>
            <Label>Icono</Label>
            <div className="grid grid-cols-7 gap-2 mt-1">
              {AVAILABLE_ICONS.map(({ name: iconName, component: IconComp }) => (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => setIcon(iconName)}
                  className={cn(
                    'p-2 rounded-lg border transition-all',
                    icon === iconName ? 'border-primary bg-primary/20' : 'border-border hover:border-primary/50'
                  )}
                >
                  <IconComp className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>Color</Label>
            <div className="flex gap-2 mt-1 flex-wrap">
              {CATEGORY_COLORS.map(c => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setColor(c.name)}
                  className={cn(
                    'w-8 h-8 rounded-full border-2 transition-all',
                    color === c.name ? 'border-foreground scale-110' : 'border-transparent'
                  )}
                  style={{ backgroundColor: `hsl(var(--${c.name}))` }}
                  title={c.label}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button onClick={handleSubmit} disabled={loading || !name.trim()} className="flex-1">
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

export default ManageCategoryDialog;
