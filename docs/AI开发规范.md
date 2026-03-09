# LifeSync AI 开发规范

## 上下文与技术栈
- **目标**: PWA 习惯/待办追踪。离线优先，web端优先。
- **阶段**: MVP (进行中) -> PWA Core -> Sync -> Push。
- **技术栈**: React 18+TS+Vite, Tailwind+clsx, Dexie.js (IndexedDB), Workbox, Lucide, date-fns。
- **禁止**: CSS Modules, styled-components, `any`。

## 编码标准
1. **离线优先**:
   - **读**: 仅限 `useLiveQuery` (Dexie)。UI 不等待网络。
   - **写**: 乐观 UI 更新。后台同步。
   - **错误**: 处理 `!navigator.onLine`。
2. **web端优先**:
   - **CSS**: 默认web端样式 (无前缀)。桌面端覆盖 (`md:`)。
   - **布局**: % 或 `max-w`，禁止固定像素宽度。
   - **触控**: 最小 44x44px 点击区域。


## 目录结构
- `src/features/`: 业务模块 (组件, hooks, 类型)。
- `src/db/`: Dexie 模式/配置。
- `src/sw/`: Service Worker。

## 工作流
1. **检查**: 读取 `docs/Iteration_Plan.md` & `src/db/schema.ts`。
2. **实现**: 遵循上述标准。
3. **验证**: 测试离线/web端。修复控制台错误。
4. **文档**:
   - 更新 `rule.md` & `docs/迭代计划.md`。
   - 记录 PWA 知识点至 `docs/面试指南.md`。
   - 记录验证至 `docs/验证日志.md`。
   - **同步**: 复制更新后的 `rule.md` 内容至 `docs/AI开发规范.md`。