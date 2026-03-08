# PWA 关键知识点与学习路径 (LifeSync Project)

本文档旨在通过 `LifeSync` 项目，系统地学习 Progressive Web App (PWA) 的核心技术。内容包含知识点详解、最佳实践及代码示例。

## 1. 基础配置 (App Manifest & Installability)

### 核心概念
Web App Manifest 是一个 JSON 文件，告诉浏览器关于你的 Web 应用的信息，以及它在用户设备上应该如何表现（例如图标、启动画面、全屏模式等）。

### 关键字段详解
*   **`name`**: 应用的全名，用于启动画面和应用列表。
*   **`short_name`**: 应用的短名称，用于主屏幕图标下方（建议不超过 12 个字符）。
*   **`start_url`**: 应用启动时的 URL（通常是 `/` 或 `/index.html`）。
*   **`display`**: 显示模式。
    *   `standalone`: 像原生应用一样全屏运行（最常用）。
    *   `minimal-ui`: 全屏但保留简单的浏览器导航条。
    *   `browser`: 普通网页模式。
*   **`background_color`**: 启动画面的背景色。
*   **`theme_color`**: 浏览器工具栏的颜色。
*   **`icons`**: 应用图标数组，必须包含至少 `192x192` 和 `512x512` 两种尺寸。

### Demo 代码 (`public/manifest.json`)
```json
{
  "name": "LifeSync - 习惯追踪",
  "short_name": "LifeSync",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 学习任务
1.  在 `index.html` 中引入 manifest：`<link rel="manifest" href="/manifest.json" />`。
2.  使用 [Manifest Generator](https://www.simicart.com/manifest-generator.html/) 生成不同尺寸的图标。
3.  在 Chrome DevTools -> Application -> Manifest 面板中验证配置。

---

## 2. 核心引擎 (Service Worker)

### 核心概念
Service Worker 是运行在浏览器后台的脚本，独立于网页。它无法直接访问 DOM，但可以拦截网络请求、管理缓存、接收推送通知。它是 PWA 的核心。

### 生命周期 (Lifecycle)
1.  **Registration (注册)**: 在主线程（UI 线程）告诉浏览器 SW 文件的位置。
2.  **Installation (安装)**: SW 文件下载并首次运行。通常在此阶段预缓存静态资源（App Shell）。如果安装失败，SW 将被废弃。
3.  **Activation (激活)**: 安装成功后，SW 等待激活。通常在此阶段清理旧缓存。
4.  **Fetch (拦截)**: 激活后，SW 开始拦截页面的网络请求。

### Demo 代码

#### 主线程注册 (`src/main.tsx`)
```javascript
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
```

#### Service Worker 文件 (`public/sw.js` - 基础版)
```javascript
const CACHE_NAME = 'lifesync-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/logo.png'
];

// Install: 预缓存
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate: 清理旧缓存
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

---

## 3. 缓存策略 (Cache Strategies)

这是 PWA 最重要的部分，决定了应用在离线时的表现。

### 5 种核心策略 (必背)

1.  **Cache Only (仅缓存)**
    *   **场景**: 静态资源（Logo, UI 骨架）。
    *   **逻辑**: 直接查缓存，没有就失败。

2.  **Network Only (仅网络)**
    *   **场景**: 非关键实时数据（如：分析埋点，即时聊天）。
    *   **逻辑**: 直接发请求，不查缓存。

3.  **Cache First (缓存优先)**
    *   **场景**: 长期不变的资源（字体、图片库）。
    *   **逻辑**: 先查缓存 -> 有则返回 -> 无则请求网络并写入缓存。
    *   **代码示例**:
    ```javascript
    self.addEventListener('fetch', (event) => {
      event.respondWith(
        caches.match(event.request).then((response) => {
          return response || fetch(event.request);
        })
      );
    });
    ```

4.  **Network First (网络优先)**
    *   **场景**: 经常变动的内容（新闻列表、即时股价）。
    *   **逻辑**: 先请求网络 -> 成功则返回并更新缓存 -> 失败（离线）则返回缓存。
    *   **代码示例**:
    ```javascript
    self.addEventListener('fetch', (event) => {
      event.respondWith(
        fetch(event.request).catch(() => {
          return caches.match(event.request);
        })
      );
    });
    ```

5.  **Stale-While-Revalidate (SWR - 验证失效)**
    *   **场景**: 绝大多数动态内容（用户头像、文章列表）。
    *   **逻辑**: 立即返回缓存（快）-> 同时发起网络请求 -> 更新缓存（下次用新的）。
    *   **Workbox 实现**:
    ```javascript
    import { registerRoute } from 'workbox-routing';
    import { StaleWhileRevalidate } from 'workbox-strategies';

    registerRoute(
      ({request}) => request.destination === 'script' || request.destination === 'style',
      new StaleWhileRevalidate()
    );
    ```

---

## 4. 数据持久化 (IndexedDB & Dexie.js)

### 为什么不用 LocalStorage?
*   LocalStorage 是**同步阻塞**的，大数据量会卡死 UI。
*   容量限制（通常 5MB）。
*   只能存字符串，不适合复杂对象查询。

### IndexedDB 优势
*   **异步**非阻塞。
*   容量大（GB 级别）。
*   支持索引、事务、二进制存储。

### Dexie.js 实战 (LifeSync 核心)
Dexie 是 IndexedDB 的封装库，让 API 变得像 SQL 一样简单。

#### 初始化 DB (`src/db/db.ts`)
```typescript
import Dexie, { Table } from 'dexie';

export interface Habit {
  id?: number;
  title: string;
  created_at: Date;
  frequency: 'daily' | 'weekly';
}

export interface Log {
  id?: number;
  habit_id: number;
  date: string; // YYYY-MM-DD
  status: 'completed' | 'skipped';
  synced: 0 | 1; // 0: 未同步, 1: 已同步
}

export class LifeSyncDB extends Dexie {
  habits!: Table<Habit>;
  logs!: Table<Log>;

  constructor() {
    super('LifeSyncDB');
    this.version(1).stores({
      habits: '++id, title, created_at',
      logs: '++id, habit_id, date, status, [habit_id+date], synced' // 复合索引
    });
  }
}

export const db = new LifeSyncDB();
```

#### 使用 DB (`src/hooks/useHabits.ts`)
```typescript
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';

export function useHabits() {
  // 实时响应式查询：当 DB 变化时自动更新 UI
  const habits = useLiveQuery(() => db.habits.toArray());
  
  const addHabit = async (title: string) => {
    await db.habits.add({
      title,
      created_at: new Date(),
      frequency: 'daily'
    });
  };

  return { habits, addHabit };
}
```

---

## 5. 进阶：后台同步 (Background Sync)

### 场景
用户在地铁断网时打卡 -> 数据存入 IndexedDB -> 标记 `synced: 0` -> 注册后台同步任务 -> 恢复网络 -> SW 自动触发同步请求。

### 实现步骤
1.  **注册 Sync**:
    ```javascript
    // 在主线程
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      navigator.serviceWorker.ready.then(reg => {
        return reg.sync.register('sync-logs');
      });
    }
    ```
2.  **监听 Sync**:
    ```javascript
    // 在 sw.js
    self.addEventListener('sync', (event) => {
      if (event.tag === 'sync-logs') {
        event.waitUntil(syncLogsToServer());
      }
    });

    async function syncLogsToServer() {
      // 1. 读取 IndexedDB 中 synced=0 的记录
      // 2. 发送 POST 请求给服务器
      // 3. 成功后更新 IndexedDB 状态为 synced=1
    }
    ```

---

## 6. 学习资源推荐
1.  **MDN PWA Docs**: 权威基础文档。
2.  **Google Developers (Web.dev)**: PWA 最佳实践与案例。
3.  **Workbox 官方文档**: 必读，生产环境必备工具。
4.  **Dexie.js 官方文档**: 数据库操作指南。
