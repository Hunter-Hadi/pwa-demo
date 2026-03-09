import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../db/db';
import { format } from 'date-fns';
import { cn } from '../../../lib/utils';
import { Trophy } from 'lucide-react';

export function StatsCard() {
  const today = format(new Date(), 'yyyy-MM-dd');
  
  const stats = useLiveQuery(async () => {
    // 1. 获取所有活跃习惯
    const activeHabits = await db.habits
      .filter(h => h.archived !== 1)
      .toArray();
    
    const totalHabits = activeHabits.length;
    
    if (totalHabits === 0) return { completed: 0, total: 0, percentage: 0 };

    // 2. 获取今日打卡记录
    // 查询 logs 表中 date 为 today 的记录
    const logs = await db.logs
      .where('date')
      .equals(today)
      .toArray();
      
    // 过滤掉那些对应的习惯已经被归档或者删除的情况
    const validLogs = logs.filter(log => activeHabits.some(h => h.id === log.habit_id));
    
    const completed = validLogs.length;
    const percentage = Math.round((completed / totalHabits) * 100);
    
    return { completed, total: totalHabits, percentage };
  }, []);

  if (!stats) return null;

  return (
    <div className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl p-6 text-white shadow-lg mb-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/3 -translate-x-1/3 blur-xl" />

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <h2 className="text-indigo-100 text-sm font-medium mb-1">Daily Progress</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">{stats.completed}</span>
            <span className="text-indigo-200 text-lg">/ {stats.total}</span>
          </div>
          <p className="text-indigo-200 text-sm mt-2 font-medium">
            {stats.percentage === 100 
              ? "All done! You're crushing it! 🎉" 
              : stats.percentage >= 50 
                ? "Halfway there, keep going! 💪" 
                : "Let's get started! 🚀"}
          </p>
        </div>
        
        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-inner">
           <Trophy className={cn("w-8 h-8 transition-colors", stats.percentage === 100 ? "text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.5)]" : "text-white")} />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6 h-2 bg-black/20 rounded-full overflow-hidden">
        <div 
          className="h-full bg-white/90 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,255,255,0.5)]"
          style={{ width: `${stats.percentage}%` }}
        />
      </div>
    </div>
  );
}
