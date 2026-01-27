# 技术栈文档

## 一、技术栈概览

本项目采用现代化的前端技术栈，注重开发效率、类型安全和用户体验。

---

## 二、核心技术

### 1. 前端框架与构建工具

| 技术       | 版本   | 用途说明                                             |
| ---------- | ------ | ---------------------------------------------------- |
| React      | 18.3.1 | 核心 UI 框架，提供组件化开发能力                     |
| Vite       | 5.4.2  | 现代化构建工具，提供快速的开发服务器和优化的生产构建 |
| TypeScript | 5.5.3  | 类型系统，提供静态类型检查，提高代码质量和开发体验   |
| React DOM  | 18.3.1 | React 的 DOM 渲染器                                  |

**选择理由**：

- React 生态成熟，组件复用性强
- Vite 提供极快的热更新体验
- TypeScript 增强代码可维护性和重构安全性

---

### 2. 样式方案

| 技术                 | 版本   | 用途说明                            |
| -------------------- | ------ | ----------------------------------- |
| Tailwind CSS         | v4     | 原子化 CSS 框架，快速构建响应式界面 |
| @tailwindcss/postcss | 最新版 | Tailwind CSS v4 的 PostCSS 插件     |

**选择理由**：

- Tailwind v4 简化配置，无需 tailwind.config.js
- 使用 `@import "tailwindcss"` 引入
- 原子类快速实现 UI，无需编写额外 CSS
- 响应式设计开箱即用

---

### 3. 状态管理

| 技术    | 版本（待安装） | 用途说明                           |
| ------- | -------------- | ---------------------------------- |
| Zustand | 最新版         | 轻量级状态管理库，管理全局应用状态 |

**选择理由**：

- API 简洁，学习成本低
- 无需大量样板代码
- 支持 TypeScript
- 适合中小型项目的状态管理需求

**应用场景**：

- 投递记录列表数据
- 筛选和排序状态
- UI 交互状态（如弹窗、编辑模式等）

---

### 4. 数据库与数据持久化

| 技术      | 版本   | 用途说明                                    |
| --------- | ------ | ------------------------------------------- |
| IndexedDB | 原生   | 浏览器内置 NoSQL 数据库，提供本地数据持久化 |
| idb       | 最新版 | IndexedDB 的轻量级 Promise 封装库，简化 API |

**选择理由**：

- 纯前端方案，无需后端服务器
- 数据存储在用户本地浏览器，离线可用
- 支持复杂查询、索引和事务
- 适合个人工具类应用，无额外配置和费用
- `idb` 库提供类型友好的 Promise API，开发体验好

**数据库设计**：

- 数据库名称：`ApplyLogDB`
- 对象仓库（Object Store）：`applications`
- 索引字段：`applyDate`、`companyLevel`、`result`
- 字段详见 project-document.md 第四部分

---

### 5. 路由管理

| 技术         | 版本（待安装） | 用途说明         |
| ------------ | -------------- | ---------------- |
| React Router | 最新版         | React 标准路由库 |

**选择理由**：

- React 生态最成熟的路由方案
- 支持嵌套路由、动态路由
- 提供导航守卫等高级功能

**路由规划**：

- `/` - 投递记录表页面（主页）
- `/calendar` - 日程表页面（预留）

---

### 6. UI 组件与交互

| 技术         | 版本    | 用途说明                          |
| ------------ | ------- | --------------------------------- |
| lucide-react | 0.344.0 | 现代化图标库，提供丰富的 SVG 图标 |

**选择理由**：

- 已集成在项目中
- 图标丰富，风格现代
- 支持 Tree-shaking

**自建组件**：
基于 Tailwind CSS 自建以下核心组件：

- ApplicationCard - 投递记录卡片
- ApplicationForm - 新增/编辑表单
- FilterBar - 筛选栏
- Modal - 通用弹窗组件
- ConfirmDialog - 确认对话框
- Navbar - 导航栏

---

### 7. 工具库

| 技术     | 版本（待安装） | 用途说明         |
| -------- | -------------- | ---------------- |
| date-fns | 最新版         | 日期格式化和处理 |
| clsx     | 最新版         | 条件类名组合工具 |

**选择理由**：

- date-fns：轻量级，支持树摇，函数式 API
- clsx：简化动态类名拼接逻辑

---

### 8. 代码质量与规范

| 技术                        | 版本   | 用途说明             |
| --------------------------- | ------ | -------------------- |
| ESLint                      | 9.9.1  | JavaScript 代码检查  |
| eslint-plugin-react-hooks   | 5.1.0  | React Hooks 规则检查 |
| eslint-plugin-react-refresh | 0.4.11 | React 快速刷新规则   |
| typescript-eslint           | 8.3.0  | TypeScript 规则集    |

**配置说明**：

- 已配置 ESLint 规则
- 强制 React Hooks 使用规范
- TypeScript 严格模式

---

## 三、项目结构规划

```
src/
├── components/          # 可复用组件
│   ├── ApplicationCard.tsx
│   ├── ApplicationForm.tsx
│   ├── FilterBar.tsx
│   ├── Modal.tsx
│   ├── ConfirmDialog.tsx
│   └── Navbar.tsx
├── pages/              # 页面组件
│   ├── ApplicationsPage.tsx
│   └── CalendarPage.tsx
├── store/              # Zustand 状态管理
│   └── applicationStore.ts
├── lib/                # 工具函数和配置
│   ├── db.ts          # IndexedDB 数据库配置和操作封装
│   ├── types.ts       # TypeScript 类型定义
│   └── utils.ts       # 通用工具函数
├── App.tsx             # 根组件（路由配置）
├── main.tsx            # 应用入口
└── index.css           # 全局样式
```

---

## 四、开发工具链

### 开发命令

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run lint` - 运行代码检查
- `npm run typecheck` - TypeScript 类型检查
- `npm run preview` - 预览生产构建

### 浏览器支持

- Chrome/Edge（最新版）
- Firefox（最新版）
- Safari（最新版）

---

## 五、环境变量配置

本项目使用 IndexedDB 作为本地存储，无需配置后端服务相关的环境变量。

如需添加其他配置，可在 `.env` 文件中设置：

```
# 示例：应用标题
VITE_APP_TITLE=实习投递追踪系统
```

---

## 六、待安装依赖

基于当前 package.json，需要额外安装以下依赖：

```bash
npm install zustand react-router-dom date-fns clsx idb uuid
npm install -D @types/uuid
```

**依赖说明**：

- `idb`：IndexedDB 的 Promise 封装库
- `uuid`：用于生成投递记录的唯一标识符

---

## 七、技术栈优势总结

1. **开发效率**：Vite + React + Tailwind 提供极速开发体验
2. **类型安全**：TypeScript 全面覆盖，减少运行时错误
3. **状态管理**：Zustand 轻量简洁，易于维护
4. **数据持久化**：IndexedDB 提供本地存储能力，离线可用，无需后端服务器
5. **可扩展性**：清晰的项目结构，易于后续功能迭代
6. **性能优化**：Vite 的按需编译和树摇优化，确保最优加载速度
7. **零依赖成本**：无需外部数据库服务，部署简单，完全免费

---

## 八、技术选型原则

1. **简洁优先**：避免过度工程化，选择轻量级方案
2. **生态成熟**：优先选择社区活跃、文档完善的技术
3. **类型安全**：全面使用 TypeScript
4. **开发体验**：注重快速迭代和调试便利性
5. **生产就绪**：所有技术栈均可用于生产环境
