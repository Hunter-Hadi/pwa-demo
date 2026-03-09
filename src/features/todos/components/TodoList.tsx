import { useState } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import { useTodos } from '../hooks/useTodos';
import { cn } from '../../../lib/utils';

export function TodoList() {
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos();
  const [newTodo, setNewTodo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    addTodo(newTodo);
    setNewTodo('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-slate-800">Todos</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
        />
        <button
          type="submit"
          disabled={!newTodo.trim()}
          className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <Plus className="w-6 h-6" />
        </button>
      </form>

      <div className="space-y-3">
        {todos?.map((todo) => (
          <div
            key={todo.id}
            className={cn(
              "flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-slate-100 transition-all group",
              todo.completed ? "bg-slate-50/50" : "hover:shadow-md hover:border-indigo-100"
            )}
          >
            <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => toggleTodo(todo.id!, todo.completed)}>
              <div
                className={cn(
                  "flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200",
                  todo.completed
                    ? "bg-indigo-500 border-indigo-500 text-white scale-100"
                    : "border-slate-300 text-transparent hover:border-indigo-400 group-hover:scale-105"
                )}
              >
                <Check className="w-4 h-4" strokeWidth={3} />
              </div>
              <span
                className={cn(
                  "text-base transition-all duration-200",
                  todo.completed ? "text-slate-400 line-through decoration-slate-300" : "text-slate-700 font-medium"
                )}
              >
                {todo.title}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteTodo(todo.id!);
              }}
              className="text-slate-300 hover:text-red-500 p-2 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Delete todo"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
        {todos?.length === 0 && (
          <div className="text-center py-16 flex flex-col items-center justify-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-slate-300" />
             </div>
            <p className="text-lg font-medium text-slate-500">No tasks yet</p>
            <p className="text-sm">Add a task above to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
