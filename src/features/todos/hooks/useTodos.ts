import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../db/db';

export function useTodos() {
  const todos = useLiveQuery(() => db.todos.orderBy('created_at').reverse().toArray());

  const addTodo = async (title: string) => {
    await db.todos.add({
      title,
      completed: 0,
      created_at: Date.now()
    });
  };

  const toggleTodo = async (id: number, currentStatus: 0 | 1) => {
    await db.todos.update(id, { completed: currentStatus === 1 ? 0 : 1 });
  };

  const deleteTodo = async (id: number) => {
    await db.todos.delete(id);
  };

  return { todos, addTodo, toggleTodo, deleteTodo };
}
