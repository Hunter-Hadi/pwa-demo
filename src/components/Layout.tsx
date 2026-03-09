import { Link, useLocation } from 'react-router-dom';
import { Calendar, CheckSquare, Settings, ListTodo } from 'lucide-react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 md:pb-0 font-sans">
      {/* Mobile Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-20 px-4 py-3 md:hidden border-b border-slate-100">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            LifeSync
          </h1>
          <div className="w-8 h-8 bg-slate-200 rounded-full overflow-hidden border border-slate-200">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-3xl mx-auto p-4 md:py-8 w-full">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

function BottomNav() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Habits', icon: CheckSquare },
    { path: '/todos', label: 'Todos', icon: ListTodo },
    { path: '/stats', label: 'Stats', icon: Calendar },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 md:hidden z-50 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className="relative flex flex-col items-center justify-center w-full h-full active:scale-95 transition-transform duration-100"
            >
              {isActive && (
                <span className="absolute top-0 w-8 h-1 bg-indigo-600 rounded-b-full shadow-sm shadow-indigo-200" />
              )}
              <Icon 
                className={cn(
                  "w-6 h-6 mb-1 transition-all duration-300",
                  isActive ? "text-indigo-600 -translate-y-0.5" : "text-slate-400"
                )} 
              />
              <span className={cn(
                "text-[10px] font-medium transition-colors duration-300",
                isActive ? "text-indigo-600" : "text-slate-400"
              )}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
