import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, ClipboardList } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

const TasksSection = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState('');

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const addTask = async () => {
    if (!user || !newTask.trim()) return;
    try {
      const { error } = await supabase.from('tasks').insert({
        title: newTask.trim(),
        user_id: user.id,
      });
      if (error) throw error;
      setNewTask('');
      fetchTasks();
    } catch (error) {
      console.error(error);
      toast.error('Error al agregar tarea');
    }
  };

  const toggleTask = async (taskId: string, completed: boolean) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed } : t));
    try {
      await supabase.from('tasks').update({ completed }).eq('id', taskId);
    } catch (error) {
      console.error(error);
      fetchTasks();
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await supabase.from('tasks').delete().eq('id', taskId);
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <div className="space-y-2">
      <Skeleton className="h-8 w-32" />
      {[1,2,3].map(i => <Skeleton key={i} className="h-12 rounded-xl" />)}
    </div>;
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <ClipboardList className="w-5 h-5" /> Tareas
        <span className="text-xs text-muted-foreground font-normal">(no afectan estadísticas)</span>
      </h2>
      <div className="flex gap-2 mb-3">
        <Input
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          placeholder="Nueva tarea..."
          onKeyDown={e => e.key === 'Enter' && addTask()}
        />
        <Button size="icon" onClick={addTask} disabled={!newTask.trim()}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <div className="space-y-1.5">
        {tasks.map(task => (
          <div key={task.id} className="glass-card rounded-lg px-3 py-2 flex items-center gap-3">
            <Checkbox
              checked={task.completed}
              onCheckedChange={(checked) => toggleTask(task.id, !!checked)}
            />
            <span className={task.completed ? 'line-through text-muted-foreground flex-1' : 'flex-1'}>
              {task.title}
            </span>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteTask(task.id)}>
              <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
            </Button>
          </div>
        ))}
        {tasks.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-4">Sin tareas pendientes</p>
        )}
      </div>
    </div>
  );
};

export default TasksSection;
