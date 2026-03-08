import { useState, useEffect } from 'react';
import { useHabits } from '../hooks/useHabits';
import { format } from 'date-fns';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../db/db';
import { Plus, Check, Trash2, Trophy, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

export function HabitList() {
  const { habits, addHabit, toggleHabit, deleteHabit } = useHabits();
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');

  // 实时查询今天的打卡记录
  const todayLogs = useLiveQuery(
    () => db.logs.where('date').equals(todayStr).toArray(),
    [todayStr]
  );

  const completedHabitIds = new Set(todayLogs?.map(log => log.habit_id));

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabitTitle.trim()) {
      await addHabit(newHabitTitle);
      setNewHabitTitle('');
      setIsAdding(false);
    }
  };

  if (!habits) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Today's Goals</h2>
          <p className="text-sm text-slate-500 font-medium">{format(today, 'EEEE, MMMM do')}</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-xl hover:scale-105 transition-all active:scale-95"
        >
          <Plus size={24} />
        </button>
      </header>

      {/* Progress Card */}
      <div className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles size={120} />
        </div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-indigo-100 text-sm font-medium mb-1">Daily Progress</p>
              <h3 className="text-4xl font-bold tracking-tight">
                {habits.length > 0 ? Math.round((completedHabitIds.size / habits.length) * 100) : 0}%
              </h3>
            </div>
            <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm border border-white/10">
              <Trophy className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <div className="w-full bg-black/20 rounded-full h-2.5 overflow-hidden backdrop-blur-sm">
            <div 
              className="bg-white h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(255,255,255,0.5)]"
              style={{ width: `${habits.length > 0 ? (completedHabitIds.size / habits.length) * 100 : 0}%` }}
            />
          </div>
          <p className="text-xs text-indigo-100 mt-3 font-medium flex items-center gap-1">
            <Check size={12} />
            {completedHabitIds.size} of {habits.length} habits completed
          </p>
        </div>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="bg-white rounded-2xl p-5 shadow-lg shadow-slate-200/50 border border-slate-100">
            <input
              type="text"
              value={newHabitTitle}
              onChange={(e) => setNewHabitTitle(e.target.value)}
              placeholder="What do you want to achieve?"
              className="w-full text-lg font-medium placeholder:text-slate-300 border-none focus:ring-0 p-0 mb-6 text-slate-900 bg-transparent"
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setIsAdding(false)}
                className="px-5 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-6 py-2.5 text-sm font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 hover:shadow-lg active:scale-95"
              >
                Create Goal
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="grid gap-3 pb-4">
        {habits.map(habit => {
          const isCompleted = completedHabitIds.has(habit.id!);
          
          return (
            <div 
              key={habit.id} 
              className={clsx(
                "group relative flex items-center p-4 bg-white rounded-2xl border transition-all duration-300",
                isCompleted 
                  ? "border-emerald-100 bg-emerald-50/30 shadow-none" 
                  : "border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100 hover:-translate-y-0.5"
              )}
            >
              <button
                onClick={() => toggleHabit(habit.id!, today)}
                className={clsx(
                  "flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center mr-4 transition-all duration-300 animate-bounce-click",
                  isCompleted 
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200" 
                    : "bg-slate-100 text-slate-300 hover:bg-indigo-50 hover:text-indigo-500"
                )}
              >
                <Check 
                  size={28} 
                  strokeWidth={3}
                  className={clsx(
                    "transition-all duration-300", 
                    isCompleted ? "scale-100 opacity-100" : "scale-50 opacity-0"
                  )} 
                />
              </button>
              
              <div className="flex-grow min-w-0 py-1">
                <h3 className={clsx(
                  "font-bold text-lg truncate transition-all duration-300 mb-0.5",
                  isCompleted ? "text-slate-400 line-through decoration-slate-300" : "text-slate-800"
                )}>
                  {habit.title}
                </h3>
                <div className="flex items-center gap-2">
                  <span className={clsx(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                    isCompleted ? "bg-emerald-100 text-emerald-600" : "bg-indigo-50 text-indigo-600"
                  )}>
                    Daily
                  </span>
                  <span className="text-xs text-slate-400 font-medium">🔥 3 days streak</span>
                </div>
              </div>

              <button 
                onClick={() => deleteHabit(habit.id!)}
                className="absolute right-4 opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                aria-label="Delete habit"
              >
                <Trash2 size={18} />
              </button>
            </div>
          );
        })}
        
        {habits.length === 0 && !isAdding && (
          <div className="text-center py-16 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex justify-center items-center w-20 h-20 bg-indigo-50 rounded-full mb-6 ring-8 ring-indigo-50/50">
              <Trophy className="w-10 h-10 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Start your journey</h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
              Small habits lead to big changes. Add your first goal today.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
