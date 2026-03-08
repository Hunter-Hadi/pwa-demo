# 面试通关指南 (Interview Guide)

本文档旨在帮助开发者通过 LifeSync 项目，系统复习 PWA 相关知识点，应对面试挑战。每个迭代完成后，我们将更新此文档，总结核心技术、解决方案及常见面试题。

---

## 迭代 1: Web App 基础 (MVP)

### 1. 核心任务
*   构建 React + TypeScript + Vite 项目骨架。
*   集成 Tailwind CSS 实现移动端优先布局。
*   使用 Dexie.js (IndexedDB) 实现完全离线的数据存储。

### 2. 关键知识点 (Key Concepts)

#### 2.1 为什么选择 IndexedDB 而不是 LocalStorage?
*   **知识点**: 浏览器存储方案对比。
*   **面试回答**: 
    *   **容量**: LocalStorage 通常限制 5MB，IndexedDB 可达数百 MB 甚至 GB。
    *   **性能**: LocalStorage 是**同步阻塞**的，大数据读写会卡顿 UI；IndexedDB 是**异步**的。
    *   **查询能力**: IndexedDB 支持索引和游标，适合结构化数据查询（如“查询某天的打卡记录”）；LocalStorage 只能存字符串。

#### 2.2 React 响应式数据流与 IndexedDB
*   **知识点**: 如何让 DB 变化驱动 UI 更新？
*   **解决方案**: 使用 `dexie-react-hooks` 的 `useLiveQuery`。
*   **Demo 代码**:
    ```typescript
    // 传统方式（需要手动 useEffect + 状态同步）
    const [habits, setHabits] = useState([]);
    useEffect(() => {
      db.habits.toArray().then(setHabits);
    }, [dbChangeDependency]); // 很难维护依赖

    // Dexie 方式 (自动监听)
    const habits = useLiveQuery(() => db.habits.toArray());
    ```

#### 2.3 移动端优先 (Mobile First) 适配
*   **知识点**: 如何处理不同屏幕尺寸？
*   **解决方案**: Tailwind CSS 的断点系统。
*   **代码示例**: `<div className="pb-20 md:pb-0">` (移动端底部留白给导航栏，桌面端不需要)。

### 3. 常见问题与踩坑 (Common Pitfalls)
*   **问题**: Tailwind CSS 样式未生效。
    *   **原因**: PostCSS 配置问题（Tailwind v4 插件变更）或 `content` 路径未包含所有文件。
    *   **解决**: 安装 `@tailwindcss/postcss` 并更新 `postcss.config.js`。
*   **问题**: 页面刷新后数据丢失？
    *   **排查**: 检查是否误用了 `useLiveQuery` 的依赖数组，或者 DB 初始化逻辑有误。确保 `db.ts` 是单例模式导出。

---

## 迭代 2: PWA Core (Coming Soon...)
*   Manifest 配置
*   Service Worker 缓存策略
*   安装引导 (A2HS)
