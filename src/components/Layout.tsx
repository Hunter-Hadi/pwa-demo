import { Link, useLocation } from 'react-router-dom';
import { Calendar, CheckSquare, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-24 md:pb-0 font-sans">
      {/* Mobile Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-20 px-4 py-3 md:hidden border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            LifeSync
          </h1>
          <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
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
    { path: '/stats', label: 'Stats', icon: Calendar },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-200 md:hidden z-50 pb-safe">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className="relative flex flex-col items-center justify-center w-full h-full"
            >
              {isActive && (
                <span className="absolute top-0 w-8 h-1 bg-blue-600 rounded-b-full transition-all duration-300" />
              )}
              <Icon 
                className={cn(
                  "w-6 h-6 mb-1 transition-all duration-200",
                  isActive ? "text-blue-600 -translate-y-0.5" : "text-gray-400 group-hover:text-gray-600"
                )} 
              />
              <span className={cn(
                "text-[10px] font-medium transition-colors duration-200",
                isActive ? "text-blue-600" : "text-gray-400"
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
