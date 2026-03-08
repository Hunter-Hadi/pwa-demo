# 项目开发 AI 指南 (AI Development Guide)

这份文档是专门为 AI 助手（如 Trea, GitHub Copilot, ChatGPT 等）准备的。当你在这个项目中工作时，请务必遵守以下规则和上下文。

---

## 1. 项目上下文 (Context)
*   **项目名称**: LifeSync (个人习惯追踪与待办管理)
*   **核心目标**: 练习 PWA (Progressive Web App) 的全套技术栈。
*   **当前阶段**: **迭代 1 (MVP - 进行中)** -> 迭代 2 (PWA Core) -> 迭代 3 (Sync) -> 迭代 4 (Push)
*   **关键特性**: 离线优先 (Offline-First)、移动端优先 (Mobile-First)、本地数据存储 (IndexedDB)。

## 2. 技术栈规范 (Tech Stack)
*   **Frontend**: React 18 + TypeScript + Vite
*   **Styling**: Tailwind CSS + `clsx` + `tailwind-merge` (禁止写 CSS Module 或 styled-components)
*   **Database**: Dexie.js (IndexedDB wrapper)
*   **PWA**: Workbox (`vite-plugin-pwa`)
*   **Icons**: Lucide React
*   **Date**: date-fns

## 3. 编码原则 (Coding Standards)

### 3.1 离线优先 (Offline-First Logic)
*   **Always read from DB**: 任何数据展示必须优先读取 IndexedDB (`useLiveQuery`)，而不是等待网络请求。
*   **Optimistic UI**: 用户操作（如打卡）应立即反映在界面上，后台异步处理存储。
*   **Error Handling**: 网络错误不是异常，是常态。必须处理 `navigator.onLine === false` 的情况。

### 3.2 移动端优先 (Mobile-First CSS)
*   默认编写移动端样式（无前缀）。
*   桌面端样式使用 `md:` 或 `lg:` 前缀覆盖。
*   禁止使用固定像素宽度（如 `w-[375px]`），应使用百分比或 `max-w`。
*   交互区域（Button/Link）必须满足 **44x44px** 最小点击区域。

### 3.3 TypeScript 严格模式
*   禁止使用 `any`。必须定义 Interface (e.g., `Habit`, `Log`)。
*   Props 必须定义类型。
*   API 响应必须定义类型。

### 3.4 组件设计
*   **Presentational vs Container**: 尽量分离 UI 展示组件和逻辑组件。
*   **Hooks**: 复杂逻辑（如数据库操作、Sync 逻辑）必须封装在 `src/hooks/` 下。

## 4. 目录结构约定 (File Structure)
```
src/
  ├── components/       # UI 组件 (e.g., Button, Card)
  ├── features/         # 业务功能模块 (e.g., habits, todos)
  │   ├── components/   # 业务组件 (HabitList)
  │   ├── hooks/        # 业务 Hooks (useHabits)
  │   └── types.ts      # 业务类型定义
  ├── db/               # Dexie 数据库配置 (schema.ts, db.ts)
  ├── lib/              # 工具函数 (utils.ts)
  ├── sw/               # Service Worker 相关逻辑
  └── App.tsx
```

## 5. 工作流指令 (Workflow Instructions)
当用户要求你开发某个功能时：
1.  **Check Plan**: 首先读取 `docs/Iteration_Plan.md` 确认当前迭代目标。
2.  **Check Schema**: 检查 `src/db/schema.ts` 是否支持新功能，若不支持，先修改 Schema。
3.  **Implement**: 编写代码，遵循上述编码原则。
4.  **Verify**: 提示用户如何验证（例如："请断网测试打卡功能"）。

## 6. 迭代验证与同步 (Iteration Verification & Sync)
*   **Verify After Iteration**: 每次迭代完成后，必须打开开发环境网址进行实际验证。
    *   **必须截图**: 使用 `RunCommand` 或 `OpenPreview` 确认无报错且 UI 正常后，在 `docs/Verification_Log.md` 中记录验证时间和状态（由于 AI 无法粘贴图片，需提示用户或记录已通过验证的文字描述）。
    *   **修复报错**: 如果发现报错（如 500/404/Console Error），必须立即修复，直到控制台无错误且功能正常。
*   **Sync Documentation**: 迭代完成后，必须同步更新以下文档：
    1.  `rule.md`: 更新当前阶段和已完成任务。
    2.  `docs/Iteration_Plan.md`: 标记任务完成状态。
    3.  `docs/Interview_Guide.md`: 记录本迭代的核心知识点、解决的问题（PWA 相关）及 Demo 代码，用于面试复习。
    4.  `docs/Verification_Log.md`: 添加本迭代的验证记录。
*   **Rule Backup**: 每次更新 `rule.md` 后，必须将其完整复制一份到 `docs/AI_RULES.md`，保持同步。

---

**System Prompt Suggestion**:
"You are an expert PWA developer working on the LifeSync project. Your goal is to build a robust, offline-capable application. Always prioritize local database operations and mobile responsiveness."
