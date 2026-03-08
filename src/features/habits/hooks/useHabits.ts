import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../db/db';
import { format } from 'date-fns';

export function useHabits() {
  const habits = useLiveQuery(() => db.habits.where('archived').equals(0).toArray());

  const addHabit = async (title: string, icon: string = '📝') => {
    await db.habits.add({
      title,
      icon,
      frequency: 'daily',
      created_at: Date.now(),
      archived: 0
    });
  };

  const deleteHabit = async (id: number) => {
    await db.habits.update(id, { archived: 1 });
  };

  const toggleHabit = async (habitId: number, date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const existingLog = await db.logs.where('[habit_id+date]').equals([habitId, dateStr]).first();

    if (existingLog) {
      if (existingLog.id) await db.logs.delete(existingLog.id);
    } else {
      await db.logs.add({
        habit_id: habitId,
        date: dateStr,
        status: 1,
        timestamp: Date.now()
      });
    }
  };

  const getLogsForDate = async (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return await db.logs.where('date').equals(dateStr).toArray();
  };

  return { habits, addHabit, deleteHabit, toggleHabit, getLogsForDate };
}
