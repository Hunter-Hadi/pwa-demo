import { useState, useEffect } from 'react';
import { useHabits } from '../hooks/useHabits';
import { format } from 'date-fns';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../db/db';
import { Plus, Check, Trash2, Trophy } from 'lucide-react';
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

  if (!habits) return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Today's Goals</h2>
          <p className="text-sm text-gray-500">{format(today, 'EEEE, MMMM do')}</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl hover:scale-105 transition-all active:scale-95"
        >
          <Plus size={24} />
        </button>
      </header>

      {/* Progress Card */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg shadow-indigo-200">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-indigo-100 text-sm font-medium">Daily Progress</p>
            <h3 className="text-3xl font-bold mt-1">
              {habits.length > 0 ? Math.round((completedHabitIds.size / habits.length) * 100) : 0}%
            </h3>
          </div>
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
            <Trophy className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="w-full bg-black/20 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-white h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${habits.length > 0 ? (completedHabitIds.size / habits.length) * 100 : 0}%` }}
          />
        </div>
        <p className="text-xs text-indigo-100 mt-3">
          {completedHabitIds.size} of {habits.length} habits completed
        </p>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="animate-in slide-in-from-top-4 fade-in duration-200">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <input
              type="text"
              value={newHabitTitle}
              onChange={(e) => setNewHabitTitle(e.target.value)}
              placeholder="What do you want to achieve?"
              className="w-full text-lg font-medium placeholder:text-gray-300 border-none focus:ring-0 p-0 mb-4 text-gray-900"
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-6 py-2 text-sm font-medium bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
              >
                Create
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="grid gap-3">
        {habits.map(habit => {
          const isCompleted = completedHabitIds.has(habit.id!);
          
          return (
            <div 
              key={habit.id} 
              className={clsx(
                "group relative flex items-center p-4 bg-white rounded-2xl shadow-sm border transition-all duration-300",
                isCompleted 
                  ? "border-green-100 bg-green-50/50" 
                  : "border-gray-100 hover:border-gray-200 hover:shadow-md"
              )}
            >
              <button
                onClick={() => toggleHabit(habit.id!, today)}
                className={clsx(
                  "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center mr-4 transition-all duration-300",
                  isCompleted 
                    ? "bg-green-500 text-white shadow-green-200 shadow-md scale-100" 
                    : "bg-gray-100 text-gray-300 hover:bg-blue-100 hover:text-blue-500 scale-95"
                )}
              >
                <Check size={24} className={clsx("transition-transform duration-300", isCompleted ? "scale-100" : "scale-0")} />
              </button>
              
              <div className="flex-grow min-w-0">
                <h3 className={clsx(
                  "font-semibold text-lg truncate transition-all duration-300",
                  isCompleted ? "text-gray-400 line-through decoration-gray-300" : "text-gray-900"
                )}>
                  {habit.title}
                </h3>
                <p className="text-xs text-gray-400 font-medium tracking-wide">DAILY GOAL</p>
              </div>

              <button 
                onClick={() => deleteHabit(habit.id!)}
                className="absolute right-4 opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                aria-label="Delete habit"
              >
                <Trash2 size={18} />
              </button>
            </div>
          );
        })}
        
        {habits.length === 0 && !isAdding && (
          <div className="text-center py-12">
            <div className="inline-flex justify-center items-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Trophy className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No habits yet</h3>
            <p className="text-gray-500 text-sm max-w-xs mx-auto">
              Start small by adding just one habit you want to stick to.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
