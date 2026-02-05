import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Target, Sparkles, ArrowRight, Brain, Dumbbell, Rocket, Flame } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse-glow w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
          <Target className="w-8 h-8 text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Target className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">10/10 GOAT</span>
          </div>
          <Button onClick={() => navigate('/auth')} variant="outline">
            Sign In
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-4 pt-16 pb-24">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Your Life Operating System
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Track habits.{' '}
            <span className="text-gradient-primary">Build the life</span>{' '}
            you want.
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            A personal habit tracker and life operating system that helps you track daily habits, 
            12-week goals, and level up every dimension of your life on a 1–10 scale.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" onClick={() => navigate('/auth')} className="gap-2 px-8">
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/auth')}>
              Demo Account
            </Button>
          </div>
        </div>

        {/* Feature Icons */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { icon: Brain, label: 'Intelecto', color: 'category-intelecto' },
            { icon: Dumbbell, label: 'Físico', color: 'category-fisico' },
            { icon: Rocket, label: 'Proyecto', color: 'category-proyecto' },
            { icon: Flame, label: 'Disciplina', color: 'category-disciplina' },
          ].map(({ icon: Icon, label, color }) => (
            <div
              key={label}
              className="glass-card rounded-xl p-6 text-center group hover:scale-105 transition-transform duration-300"
            >
              <div
                className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: `hsl(var(--${color}) / 0.15)` }}
              >
                <Icon
                  className="w-6 h-6"
                  style={{ color: `hsl(var(--${color}))` }}
                />
              </div>
              <p className="font-medium">{label}</p>
            </div>
          ))}
        </div>

        {/* Stats Preview */}
        <div className="mt-16 glass-card rounded-2xl p-8 max-w-2xl mx-auto">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-3xl md:text-4xl font-bold font-mono text-primary">9</p>
              <p className="text-sm text-muted-foreground mt-1">Life Categories</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold font-mono text-success">7.0</p>
              <p className="text-sm text-muted-foreground mt-1">Starting Level</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold font-mono text-accent">10</p>
              <p className="text-sm text-muted-foreground mt-1">GOAT Status</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Built for personal excellence. Become a 10/10 in every dimension.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
