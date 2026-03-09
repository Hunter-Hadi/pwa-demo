import Dexie, { type Table } from 'dexie';
import type { Habit, Log, Todo } from './schema';

export class LifeSyncDB extends Dexie {
  habits!: Table<Habit>;
  logs!: Table<Log>;
  todos!: Table<Todo>;

  constructor() {
    super('LifeSyncDB');
    this.version(1).stores({
      habits: '++id, title, created_at, archived',
      logs: '++id, habit_id, date, [habit_id+date]', // 复合索引用于快速查询某习惯某天是否已打卡
      todos: '++id, title, created_at, completed'
    });
  }
}

export const db = new LifeSyncDB();
