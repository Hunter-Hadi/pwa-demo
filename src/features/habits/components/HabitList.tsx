import { useState, useEffect } from 'react';
import { useHabits } from '../hooks/useHabits';
import { format } from 'date-fns';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../db/db';
import { Plus, Check, Trash2 } from 'lucide-react';
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

  if (!habits) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="space-y-4">
      <header className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Today's Habits</h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
        >
          <Plus size={24} />
        </button>
      </header>

      {isAdding && (
        <form onSubmit={handleAdd} className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
          <input
            type="text"
            value={newHabitTitle}
            onChange={(e) => setNewHabitTitle(e.target.value)}
            placeholder="New habit name..."
            className="w-full p-2 border border-gray-300 rounded-md mb-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button 
              type="button" 
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add
            </button>
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
                "flex items-center p-4 bg-white rounded-xl shadow-sm border transition-all",
                isCompleted ? "border-green-200 bg-green-50" : "border-gray-100"
              )}
            >
              <button
                onClick={() => toggleHabit(habit.id!, today)}
                className={clsx(
                  "flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center mr-4 transition-colors",
                  isCompleted 
                    ? "bg-green-500 border-green-500 text-white" 
                    : "border-gray-300 hover:border-blue-400"
                )}
              >
                {isCompleted && <Check size={16} />}
              </button>
              
              <div className="flex-grow">
                <h3 className={clsx(
                  "font-medium text-lg",
                  isCompleted ? "text-gray-500 line-through" : "text-gray-800"
                )}>
                  {habit.title}
                </h3>
                <p className="text-xs text-gray-400">Daily</p>
              </div>

              <button 
                onClick={() => deleteHabit(habit.id!)}
                className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                aria-label="Delete habit"
              >
                <Trash2 size={16} />
              </button>
            </div>
          );
        })}
        
        {habits.length === 0 && !isAdding && (
          <div className="text-center py-10 text-gray-400">
            <p>No habits yet. Start by adding one!</p>
          </div>
        )}
      </div>
    </div>
  );
}
