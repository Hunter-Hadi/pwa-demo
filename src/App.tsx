import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HabitList } from './features/habits/components/HabitList';
import { TodoList } from './features/todos/components/TodoList';
import { OfflineToast } from './components/OfflineToast';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HabitList />} />
          <Route path="/todos" element={<TodoList />} />
          <Route path="/stats" element={<div className="p-4">Stats Coming Soon</div>} />
          <Route path="/settings" element={<div className="p-4">Settings Coming Soon</div>} />
        </Routes>
        <OfflineToast />
      </Layout>
    </Router>
  );
}

export default App;
