# LifeSync UI 设计规范 (Design Specification)

本文档基于主流习惯追踪应用 (如 Streaks, Habitica, TickTick) 的设计语言，为 LifeSync 定义了一套现代化、移动端优先的 UI 系统。

## 1. 设计理念 (Design Philosophy)
*   **Clean & Focused (极简专注)**: 移除多余装饰，让用户聚焦于“今天的任务”。
*   **Gamified Feedback (游戏化反馈)**: 打卡不仅是记录，更要有满足感（微动画、颜色变化）。
*   **Thumb-Friendly (拇指友好)**: 核心交互区域（打卡、导航、添加）全部位于屏幕下半部分。

## 2. 色彩系统 (Color System)

采用 Tailwind CSS 默认色板，定义语义化颜色：

| 语义 | 颜色代号 | Tailwind Class | 用途 |
| :--- | :--- | :--- | :--- |
| **Primary** | Indigo-600 | `bg-indigo-600` | 品牌主色，主按钮，激活状态 |
| **Secondary** | Violet-500 | `text-violet-500` | 渐变辅助色，图标点缀 |
| **Success** | Emerald-500 | `bg-emerald-500` | 完成状态，打卡成功反馈 |
| **Surface** | White | `bg-white` | 卡片背景，底部导航栏 |
| **Background** | Slate-50 | `bg-slate-50` | 全局页面背景 |
| **Text Main** | Slate-900 | `text-slate-900` | 标题，正文 |
| **Text Muted** | Slate-400 | `text-slate-400` | 次要信息，未选中状态 |

## 3. 核心界面布局 (Core Layouts)

### 3.1 首页 (Home / Dashboard)
*   **Header (顶部)**:
    *   左侧: "Good Morning" (根据时间变化) + 日期。
    *   右侧: 用户头像 (Avatar) 或 设置入口。
*   **Hero Section (进度概览)**:
    *   一个醒目的**环形进度条 (Circular Progress)** 或 **周视图 (Weekly Strip)**。
    *   展示今日完成率 (e.g., "3/5 habits done")。
*   **Habit List (习惯列表)**:
    *   垂直卡片流。
    *   每个卡片高度 `72px` ~ `80px`。
    *   **交互**:
        *   左侧: 习惯图标 (Emoji 或 Icon) + 背景色块。
        *   中间: 标题 + 连续打卡天数 (Streak Fire 🔥)。
        *   右侧: 巨大的打卡按钮 (Checkbox)。

### 3.2 底部导航 (Bottom Navigation)
*   悬浮式 (Floating) 或 沉浸式 (Blur)。
*   3 个核心 Tab:
    1.  **Today** (首页)
    2.  **Stats** (统计)
    3.  **Settings** (设置)
*   **FAB (Floating Action Button)**:
    *   在导航栏上方居中，或右下角悬浮。
    *   用于 "快速添加习惯"。

## 4. 组件规范 (Component Specs)

### Card (卡片)
```css
.card {
  @apply bg-white rounded-2xl shadow-sm border border-slate-100;
  /* 点击反馈 */
  @apply active:scale-[0.98] transition-transform duration-100;
}
```

### Button (按钮)
```css
.btn-primary {
  @apply bg-indigo-600 text-white font-semibold py-3 px-6 rounded-xl;
  @apply shadow-lg shadow-indigo-200;
  @apply active:bg-indigo-700;
}
```

### Checkbox (打卡交互)
*   **未完成**: 灰色圆环 `border-2 border-slate-300`。
*   **完成**: 绿色实心圆 `bg-emerald-500` + 白色对勾图标 + **弹跳动画 (Bounce)**。

## 5. 待办事项 (To-Do)
*   在完成设计确认后，我们将按照此规范重构 `Layout.tsx` 和 `HabitList.tsx`。
*   引入 `framer-motion` (可选) 或使用 Tailwind `animate-` 类来实现微交互。

---

**是否批准此设计方案？** 确认后我将开始编码。
