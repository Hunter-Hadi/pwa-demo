# 面试通关指南 (Interview Guide)

本文档旨在帮助开发者通过 LifeSync 项目，系统复习 PWA 相关知识点，应对面试挑战。每个迭代完成后，我们将更新此文档，总结核心技术、解决方案及常见面试题。

---

## 迭代 1: Web App 基础 (MVP)

### 1. 核心任务与解决的问题
本迭代构建了一个“单机可用”的 Web App，主要解决了以下问题，为后续升级 PWA 打下基础：

*   **问题 A: 数据如何完全离线存储？**
    *   **背景**: 传统 Web App 依赖服务器数据库，断网即瘫痪。LocalStorage 容量小且同步阻塞 UI。
    *   **解决**: 引入 **IndexedDB** (通过 Dexie.js 封装)。实现了 GB 级别的本地存储，且读写操作全部异步，不阻塞主线程渲染。
    *   **价值**: 这是 PWA "Offline First" (离线优先) 的数据层基石。

*   **问题 B: 本地数据变化如何实时驱动 UI 更新？**
    *   **背景**: IndexedDB 是被动存储，数据变了 UI 不会自动刷新（不像 Redux/State）。
    *   **解决**: 使用 **LiveQuery** 模式 (`dexie-react-hooks`)。
    *   **价值**: 实现了类似 Vue/MobX 的响应式体验，但数据源是数据库。用户打卡后，无需手动操作 DOM 或维护额外的 React State，列表自动更新。

*   **问题 C: 移动端体验如何接近原生 App？**
    *   **背景**: 桌面端网页在手机上字太小、点击区域难点。
    *   **解决**: 采用 **Mobile-First** CSS 策略 (Tailwind)。
    *   **价值**: 确保点击区域 >44px，布局自适应，为后续 "Add to Home Screen" 提供原生级的 UI 体验。

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
