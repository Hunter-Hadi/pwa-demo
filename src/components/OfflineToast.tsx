import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';
import { clsx } from 'clsx';

export function OfflineToast() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setShow(true);
      setTimeout(() => setShow(false), 3000); // Online message shows briefly
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShow(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!show && !isOffline) return null;

  return (
    <div 
      className={clsx(
        "fixed bottom-20 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 transform px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-medium",
        isOffline 
          ? "bg-slate-800 text-white translate-y-0 opacity-100" 
          : show 
            ? "bg-emerald-500 text-white translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
      )}
    >
      {isOffline ? (
        <>
          <WifiOff size={16} />
          <span>You are offline. Changes saved locally.</span>
        </>
      ) : (
        <span>Back online!</span>
      )}
    </div>
  );
}
