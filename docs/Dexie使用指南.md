# Dexie.js 使用指南

Dexie.js 是 IndexedDB 的一个轻量级封装库，提供了更易用的 Promise API 和类似 SQL 的查询语法。本项目使用它来实现离线优先的数据持久化。

## 1. 核心概念

### Schema 定义
在 `src/db/db.ts` 中定义数据库的版本和表结构。

```typescript
// src/db/db.ts
import Dexie, { type EntityTable } from 'dexie';

// 定义接口
export interface Habit {
  id: number;
  title: string;
  frequency: 'daily' | 'weekly';
  archived: number; // 0: active, 1: archived
  created_at: number;
}

// 初始化数据库
const db = new Dexie('LifeSyncDB') as Dexie & {
  habits: EntityTable<Habit, 'id'>;
};

// 定义表和索引
// 注意：仅需列出要在 where 子句中使用的字段
db.version(1).stores({
  habits: '++id, title, created_at, archived', // ++id 自增主键
});

export { db };
```

### 响应式查询 (`useLiveQuery`)
使用 `dexie-react-hooks` 提供的 `useLiveQuery` Hook，可以自动订阅数据库变更。当数据发生变化时，组件会自动重新渲染。

```typescript
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';

const MyComponent = () => {
  // 实时查询所有未归档的习惯
  const habits = useLiveQuery(
    () => db.habits.where('archived').equals(0).toArray()
  );

  if (!habits) return <div>Loading...</div>;

  return (
    <ul>
      {habits.map(habit => (
        <li key={habit.id}>{habit.title}</li>
      ))}
    </ul>
  );
};
```

## 2. CRUD 操作示例

所有的数据库写操作都通过 `db.table_name` 进行。

### 创建 (Create)
```typescript
await db.habits.add({
  title: '晨跑',
  frequency: 'daily',
  archived: 0,
  created_at: Date.now(),
});
```

### 读取 (Read)
```typescript
// 单个查询
const habit = await db.habits.get(1);

// 条件查询
const activeHabits = await db.habits
  .where('archived').equals(0)
  .toArray();

// 复杂查询 (复合索引)
const logs = await db.logs
  .where('[habit_id+date]')
  .equals([1, '2023-10-01'])
  .first();
```

### 更新 (Update)
```typescript
// 更新指定字段
await db.habits.update(1, {
  title: '夜跑',
  updated_at: Date.now()
});
```

### 删除 (Delete)
```typescript
// 删除单条记录
await db.habits.delete(1);

// 批量删除
await db.logs.where('habit_id').equals(1).delete();
```

## 3. 最佳实践
1.  **离线优先**: 任何数据展示必须优先读取 IndexedDB (`useLiveQuery`)，而不是等待网络请求。
2.  **异步处理**: 所有的写操作（add, update, delete）都是异步的，建议使用 `async/await`。
3.  **索引优化**: 频繁查询的字段必须在 `stores` 中定义索引。
4.  **错误处理**: 虽然 IndexedDB 操作相对稳定，但在生产环境中建议包裹 `try-catch`。

## 4. 常见问题
- **版本迁移**: 如果修改了 Schema (例如新增字段)，必须增加版本号 `db.version(2).stores(...)`。
- **类型安全**: 始终使用 TypeScript 接口定义表结构，确保类型提示和检查。
