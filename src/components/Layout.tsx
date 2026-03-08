import { Link, useLocation } from 'react-router-dom';
import { Calendar, CheckSquare, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20 md:pb-0">
      <header className="bg-white shadow-sm sticky top-0 z-10 px-4 py-3 md:hidden">
        <h1 className="text-xl font-bold text-blue-600">LifeSync</h1>
      </header>

      <main className="max-w-3xl mx-auto p-4 md:py-8">
        {children}
      </main>

      <BottomNav />
    </div>
  );
}

function BottomNav() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Habits', icon: CheckSquare },
    { path: '/stats', label: 'Stats', icon: Calendar },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ path, label, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full text-sm",
              location.pathname === path 
                ? "text-blue-600 font-medium" 
                : "text-gray-500 hover:text-gray-900"
            )}
          >
            <Icon className="w-6 h-6 mb-1" />
            <span className="text-xs">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
