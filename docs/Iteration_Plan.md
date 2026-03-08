# LifeSync 项目实战计划 (Iteration Plan)

**项目名称**: LifeSync (个人生活同步助手)
**核心价值**: 离线优先的习惯养成与待办管理工具。无论网络状况如何，始终可用。
**技术栈**: React 18 + TypeScript + Vite + Tailwind CSS + Dexie.js (IndexedDB) + Workbox (PWA).

---

## 迭代概览 (Roadmap)

| 阶段 | 目标 | 关键特性 | 预计周期 |
| :--- | :--- | :--- | :--- |
| **迭代 1 (MVP)** | **单机可用** | 基础 CRUD、本地数据库、响应式 UI | 1 周 |
| **迭代 2 (PWA Core)** | **离线访问** | Manifest 配置、App Shell 缓存、Service Worker | 3-5 天 |
| **迭代 3 (Sync)** | **多端同步** | 后台同步 (Background Sync)、Node.js 后端 | 1 周 |
| **迭代 4 (Push)** | **用户触达** | 推送通知 (Web Push)、VAPID Keys | 3-5 天 |

---

## 迭代 1：Web App 基础 (MVP) 详细计划

**目标**: 构建一个功能完整的单页应用 (SPA)，数据完全存储在浏览器本地 (IndexedDB)，不依赖任何后端服务。

### 1. 功能清单 (Features)
*   **习惯管理**:
    *   [x] 创建新习惯 (名称、图标、频率)。
    *   [x] 每日打卡 (点击完成/取消)。
    *   [x] 查看历史打卡记录 (日历视图 - 基础列表)。
    *   [x] 删除习惯。
*   **待办事项**:
    *   [ ] 快速添加 Todo (Next Iteration)。
    *   [ ] 勾选完成/未完成 (Next Iteration)。
*   **数据统计**:
    *   [ ] 首页展示今日完成率 (例如: "3/5 Completed") (Next Iteration)。

### 2. 技术架构 (Architecture)
*   **状态管理**: 使用 `Dexie.js` + `useLiveQuery` (React Hooks) 实现响应式数据流。
    *   *优势*: 数据库变更自动触发组件重渲染，无需 Redux/Zustand。
*   **UI 框架**: Tailwind CSS (Mobile-first 设计)。
*   **路由**: React Router v6 (虽然是单页，但为了后续扩展，建议使用)。

### 3. 数据库设计 (Schema)
我们使用 `Dexie.js` 定义两个核心表：

```typescript
// src/db/schema.ts

export interface Habit {
  id?: number;          // 自增主键
  title: string;        // 习惯名称
  icon: string;         // Emoji 或图标名
  frequency: 'daily';   // 目前仅支持每日
  created_at: number;   // 时间戳
  archived: 0 | 1;      // 软删除标记
}

export interface Log {
  id?: number;
  habit_id: number;     // 外键 -> Habit.id
  date: string;         // 格式 "YYYY-MM-DD" (作为索引)
  status: 1 | 0;        // 1: 完成, 0: 未完成 (默认不存0，只存1)
  timestamp: number;    // 打卡具体时间
}

// Dexie Store Definition
// habits: '++id, title'
// logs: '++id, habit_id, date, [habit_id+date]'
```

### 4. 组件划分 (Components)
*   `Layout`: 包含顶部导航栏 (Header) 和底部标签栏 (BottomNav - 用于移动端切换 "Habits", "Todos", "Stats")。
*   `HabitList`: 首页列表容器。
*   `HabitItem`: 单个习惯卡片，包含打卡按钮。
*   `AddHabitModal`: 底部弹出的添加习惯表单。
*   `CalendarView`: 用于查看某个习惯的历史记录。
*   `StatsCard`: 首页顶部的统计概览。

### 5. 开发步骤 (Step-by-Step)

#### Step 1: 项目初始化
1.  创建项目: `npm create vite@latest lifesync -- --template react-ts`
2.  安装依赖:
    ```bash
    npm install dexie dexie-react-hooks react-router-dom lucide-react clsx tailwind-merge date-fns
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p
    ```
3.  配置 Tailwind: 修改 `tailwind.config.js`，设置 `content` 路径。

#### Step 2: 数据库层实现
1.  创建 `src/db.ts`。
2.  定义 `LifeSyncDB` 类。
3.  导出全局 `db` 实例。
4.  编写 `useHabits` hook，封装 `db.habits.add`, `db.habits.toArray` 等操作。

#### Step 3: UI 骨架搭建
1.  实现 `App.tsx` 中的路由结构。
2.  创建 `Layout` 组件，实现响应式布局（桌面端居中，移动端全屏）。
3.  使用 Tailwind 编写一个简单的 Header 和 BottomNav。

#### Step 4: 核心业务逻辑
1.  **添加习惯**: 实现 `AddHabitModal`，调用 `db.habits.add`。
2.  **列表展示**: 使用 `useLiveQuery` 查询 `db.habits`，渲染 `HabitList`。
3.  **打卡逻辑**:
    *   点击打卡 -> 查询 `db.logs` 是否已有今日记录。
    *   无 -> `db.logs.add({ habit_id, date: today, status: 1 })`。
    *   有 -> `db.logs.delete(logId)` (取消打卡)。
    *   *注意*: 需要处理乐观更新 (Optimistic UI) 或利用 LiveQuery 的自动更新。

#### Step 5: 验证与测试
1.  在 Chrome 移动端模拟器中测试布局。
2.  刷新页面，确认添加的习惯和打卡记录依然存在（验证 IndexedDB 持久化）。
3.  尝试删除数据，确认级联逻辑（如果删除了习惯，相关的 logs 也可以保留或软删除）。

---

## 迭代 2 预告 (PWA Core)
*   生成 `manifest.json`。
*   引入 `vite-plugin-pwa`。
*   配置 Workbox 策略：
    *   JS/CSS: StaleWhileRevalidate
    *   Images: CacheFirst
    *   API (如有): NetworkFirst
