<!-- filepath: /Users/raven/code/Apply_Record/ApplyLog/memory-bank/implementation-plan.md -->

# 实施计划

本文档详细描述实习投递追踪系统的开发步骤，每一步都包含具体的实现说明和验证测试。

---

## 阶段一：项目初始化与基础配置

### 步骤 1.1：初始化 Vite + React + TypeScript 项目

**操作说明**：

1. 使用 Vite 创建新项目：`npm create vite@latest . -- --template react-ts`
2. 进入项目目录，安装基础依赖：`npm install`
3. 启动开发服务器：`npm run dev`

**验证测试**：

- 运行 `npm run dev`，浏览器访问 `http://localhost:5173`
- 页面应显示 Vite + React 默认欢迎页面
- 终端无报错信息

---

### 步骤 1.2：配置 Tailwind CSS

**操作说明**：

1. 安装 Tailwind 及相关依赖：`npm install -D tailwindcss postcss autoprefixer`
2. 初始化配置文件：`npx tailwindcss init -p`
3. 在 `tailwind.config.js` 中配置 `content` 路径：`["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]`
4. 在 `src/index.css` 中添加 Tailwind 指令：
   - `@tailwind base;`
   - `@tailwind components;`
   - `@tailwind utilities;`

**验证测试**：

- 在 `App.tsx` 中添加一个带 Tailwind 类的元素，如：`<div className="text-red-500 text-2xl">Tailwind 测试</div>`
- 页面应显示红色大号文字
- 修改类名为 `text-blue-500`，热更新后文字变蓝

---

### 步骤 1.3：安装项目所需依赖

**操作说明**：

1. 安装运行时依赖：`npm install zustand react-router-dom date-fns clsx idb uuid lucide-react`
2. 安装开发依赖：`npm install -D @types/uuid`

**验证测试**：

- 运行 `npm list zustand react-router-dom date-fns clsx idb uuid lucide-react`
- 所有包均应显示已安装的版本号
- 运行 `npm run build`，构建成功无报错

---

### 步骤 1.4：创建项目目录结构

**操作说明**：
在 `src/` 目录下创建以下文件夹和空文件：

```
src/
├── components/
│   └── .gitkeep
├── pages/
│   └── .gitkeep
├── store/
│   └── .gitkeep
├── lib/
│   └── .gitkeep
```

**验证测试**：

- 检查目录结构是否正确创建
- 运行 `npm run dev`，项目正常启动无报错

---

## 阶段二：类型定义与数据库层

### 步骤 2.1：定义 TypeScript 类型

**操作说明**：
创建 `src/lib/types.ts` 文件，定义以下类型：

1. `Application` 接口：包含所有投递记录字段（id, companyName, jobName, city, companyLevel, applyChannel, applyLink, applyDate, processStatus, record, result, remark, createdAt, updatedAt）
2. `CompanyLevel` 类型：`'大厂' | '中厂' | '小厂' | '国企' | '外企'`
3. `ApplyChannel` 类型：`'官网' | '内推' | '邮箱' | '其他'`
4. `ApplicationResult` 类型：`'offer' | '一面挂' | '二面挂' | '三面挂' | 'hr挂' | null`

**验证测试**：

- 运行 `npm run typecheck`（或 `npx tsc --noEmit`）
- 无 TypeScript 编译错误
- 在其他文件中导入类型，IDE 应提供正确的类型提示

---

### 步骤 2.2：初始化 IndexedDB 数据库配置

**操作说明**：
创建 `src/lib/db.ts` 文件：

1. 使用 `idb` 库的 `openDB` 函数初始化数据库
2. 数据库名称：`ApplyLogDB`，版本：`1`
3. 创建对象仓库 `applications`，keyPath 为 `id`
4. 创建索引：`applyDate`、`companyLevel`、`result`

**验证测试**：

- 在 `main.tsx` 中临时调用数据库初始化函数
- 打开浏览器开发者工具 → Application → IndexedDB
- 应能看到 `ApplyLogDB` 数据库和 `applications` 对象仓库
- 检查索引是否正确创建

---

### 步骤 2.3：实现数据库 CRUD 操作函数

**操作说明**：
在 `src/lib/db.ts` 中添加以下函数：

1. `addApplication(data: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>)` - 新增记录
2. `updateApplication(id: string, data: Partial<Application>)` - 更新记录
3. `deleteApplication(id: string)` - 删除记录
4. `getApplication(id: string)` - 获取单条记录
5. `getAllApplications()` - 获取所有记录

**验证测试**：

- 在浏览器控制台中手动调用 `addApplication` 添加一条测试数据
- 调用 `getAllApplications`，应返回包含刚添加记录的数组
- 调用 `updateApplication` 修改记录，再次查询验证更新成功
- 调用 `deleteApplication` 删除记录，再次查询验证删除成功
- 刷新页面后，再次调用 `getAllApplications`，数据应持久存在

---

## 阶段三：状态管理层

### 步骤 3.1：创建 Zustand Store 基础结构

**操作说明**：
创建 `src/store/applicationStore.ts` 文件：

1. 定义 Store 状态接口，包含：
   - `applications: Application[]` - 投递记录列表
   - `isLoading: boolean` - 加载状态
   - `error: string | null` - 错误信息
2. 使用 `create` 函数创建 Store
3. 初始化默认状态

**验证测试**：

- 在任意组件中调用 `useApplicationStore()`
- 检查返回的状态是否包含 `applications`、`isLoading`、`error`
- 状态初始值应为空数组、false、null

---

### 步骤 3.2：实现 Store 的数据操作方法

**操作说明**：
在 Store 中添加以下 actions：

1. `fetchApplications()` - 从 IndexedDB 加载所有记录到状态
2. `addApplication(data)` - 添加新记录并同步到 IndexedDB
3. `updateApplication(id, data)` - 更新记录并同步到 IndexedDB
4. `deleteApplication(id)` - 删除记录并同步到 IndexedDB

**验证测试**：

- 调用 `fetchApplications()`，检查 `applications` 状态是否与 IndexedDB 数据一致
- 调用 `addApplication()`，检查状态更新且 IndexedDB 中有新记录
- 调用 `updateApplication()`，检查状态和 IndexedDB 均已更新
- 调用 `deleteApplication()`，检查状态和 IndexedDB 均已删除该记录

---

### 步骤 3.3：添加筛选与排序状态

**操作说明**：
在 Store 中添加筛选和排序相关状态与方法：

1. `filterByCompanyLevel: CompanyLevel | null` - 按公司级别筛选
2. `filterByInProgress: boolean` - 筛选流程中的投递（result === null）
3. `sortOrder: 'asc' | 'desc'` - 排序方向
4. `setFilterByCompanyLevel(level)` - 设置公司级别筛选
5. `setFilterByInProgress(value)` - 设置流程中筛选
6. `setSortOrder(order)` - 设置排序方向
7. `getFilteredAndSortedApplications()` - 计算属性，返回筛选排序后的列表

**验证测试**：

- 添加多条测试数据（不同 companyLevel、不同 result）
- 设置 `filterByCompanyLevel` 为 "大厂"，验证只返回大厂记录
- 设置 `filterByInProgress` 为 true，验证只返回 result 为 null 的记录
- 切换 `sortOrder`，验证返回列表按 applyDate 正确排序

---

## 阶段四：路由配置

### 步骤 4.1：配置 React Router

**操作说明**：
修改 `src/App.tsx`：

1. 导入 `BrowserRouter`、`Routes`、`Route` 组件
2. 配置两个路由：
   - `/` → `ApplicationsPage` 组件
   - `/calendar` → `CalendarPage` 组件
3. 创建占位页面组件（临时）

**验证测试**：

- 访问 `http://localhost:5173/`，应显示投递记录表页面（或占位内容）
- 访问 `http://localhost:5173/calendar`，应显示日程表页面（或占位内容）
- 访问不存在的路由，应正常处理（可选：添加 404 页面）

---

## 阶段五：基础 UI 组件开发

### 步骤 5.1：创建 Navbar 导航栏组件

**操作说明**：
创建 `src/components/Navbar.tsx`：

1. 包含应用标题"实习投递追踪"
2. 两个导航链接：投递记录（/）、日程表（/calendar）
3. 新增投递按钮
4. 使用 Tailwind 样式：固定顶部、背景色、阴影

**验证测试**：

- 导航栏在页面顶部正确显示
- 点击"投递记录"链接跳转到 `/`
- 点击"日程表"链接跳转到 `/calendar`
- 当前页面的导航链接应有高亮样式区分

---

### 步骤 5.2：创建 Modal 通用弹窗组件

**操作说明**：
创建 `src/components/Modal.tsx`：

1. Props：`isOpen`、`onClose`、`title`、`children`
2. 使用 React Portal 渲染到 body
3. 包含遮罩层、居中内容区、关闭按钮
4. 点击遮罩层或按 ESC 键关闭弹窗

**验证测试**：

- 设置 `isOpen={true}`，弹窗正确显示在页面中央
- 设置 `isOpen={false}`，弹窗不显示
- 点击遮罩层，`onClose` 回调被调用
- 按 ESC 键，`onClose` 回调被调用
- 弹窗内容正确渲染 `children`

---

### 步骤 5.3：创建 ConfirmDialog 确认对话框组件

**操作说明**：
创建 `src/components/ConfirmDialog.tsx`：

1. 基于 Modal 组件封装
2. Props：`isOpen`、`onConfirm`、`onCancel`、`title`、`message`
3. 包含确认和取消两个按钮
4. 确认按钮为红色警告样式（用于删除操作）

**验证测试**：

- 对话框正确显示标题和消息内容
- 点击"确认"按钮，`onConfirm` 回调被调用
- 点击"取消"按钮，`onCancel` 回调被调用
- 点击遮罩层，对话框关闭

---

### 步骤 5.4：创建 FilterBar 筛选栏组件

**操作说明**：
创建 `src/components/FilterBar.tsx`：

1. 公司级别下拉选择框（全部 / 大厂 / 中厂 / 小厂 / 国企 / 外企）
2. "仅显示流程中"复选框
3. 排序方向切换按钮（按投递时间升序/降序）
4. 连接 Zustand Store 的筛选状态

**验证测试**：

- 选择公司级别，Store 中 `filterByCompanyLevel` 状态正确更新
- 勾选"仅显示流程中"，Store 中 `filterByInProgress` 状态变为 true
- 点击排序按钮，Store 中 `sortOrder` 在 'asc' 和 'desc' 之间切换
- UI 正确反映当前筛选状态

---

## 阶段六：核心功能组件开发

### 步骤 6.1：创建 ApplicationForm 表单组件

**操作说明**：
创建 `src/components/ApplicationForm.tsx`：

1. Props：`initialData`（可选，编辑模式）、`onSubmit`、`onCancel`
2. 包含所有必填字段的输入控件：
   - companyName：文本输入
   - jobName：文本输入
   - city：文本输入
   - companyLevel：下拉选择
   - applyChannel：下拉选择
   - applyLink：URL 输入
   - applyDate：日期选择器
   - processStatus：文本输入
   - record：多行文本
   - result：下拉选择（含空选项）
   - remark：多行文本（可选）
3. 表单验证：必填字段不能为空
4. 提交时调用 `onSubmit` 回调

**验证测试**：

- 新增模式：所有字段为空，提交按钮显示"添加"
- 编辑模式：传入 `initialData`，表单自动填充已有数据
- 必填字段为空时，提交显示错误提示
- 填写完整后提交，`onSubmit` 收到正确的表单数据

---

### 步骤 6.2：创建 ApplicationCard 投递记录卡片组件

**操作说明**：
创建 `src/components/ApplicationCard.tsx`：

1. Props：`application: Application`、`onEdit`、`onDelete`
2. 展示所有字段信息：
   - 主标题：公司名称（可点击跳转到 applyLink）
   - 副标题：岗位名称
   - 信息行：城市、公司级别、投递渠道
   - 信息行：投递时间（格式化显示）
   - 状态：当前流程、投递结果
   - 折叠区域：信息记录、备注
3. 卡片主体点击触发 `onEdit`
4. 右键菜单显示删除选项，点击触发 `onDelete`

**验证测试**：

- 传入测试数据，所有字段正确显示
- 点击公司名称，新标签页打开 applyLink 链接
- 单击卡片主体，`onEdit` 回调被调用
- 右键卡片弹出菜单，点击删除后 `onDelete` 回调被调用
- 不同 result 状态显示不同颜色标签（如 offer 绿色、挂 红色、流程中 蓝色）

---

### 步骤 6.3：实现卡片右键菜单

**操作说明**：
在 ApplicationCard 中实现自定义右键菜单：

1. 使用 `onContextMenu` 事件阻止默认菜单
2. 创建绝对定位的菜单组件，显示在鼠标位置
3. 菜单项：删除
4. 点击其他区域或按 ESC 关闭菜单

**验证测试**：

- 右键点击卡片，自定义菜单在鼠标位置显示
- 菜单不会超出视口边界
- 点击"删除"选项，菜单关闭并触发删除回调
- 点击卡片外部区域，菜单关闭

---

## 阶段七：页面组装与功能集成

### 步骤 7.1：实现投递记录表页面基础布局

**操作说明**：
创建/修改 `src/pages/ApplicationsPage.tsx`：

1. 页面加载时调用 `fetchApplications()` 从 IndexedDB 加载数据
2. 顶部放置 FilterBar 组件
3. 主内容区使用网格布局展示 ApplicationCard 列表
4. 显示加载状态和空状态提示

**验证测试**：

- 页面加载后，IndexedDB 中的数据正确显示为卡片列表
- 无数据时显示"暂无投递记录"提示
- 加载中显示 loading 状态

---

### 步骤 7.2：集成筛选与排序功能

**操作说明**：
在 ApplicationsPage 中：

1. 使用 Store 的 `getFilteredAndSortedApplications()` 获取处理后的列表
2. FilterBar 的状态变化自动触发列表更新

**验证测试**：

- 选择"大厂"，列表只显示公司级别为"大厂"的记录
- 勾选"仅显示流程中"，列表只显示 result 为 null 的记录
- 同时应用多个筛选条件，结果正确
- 切换排序方向，列表按 applyDate 重新排序
- 清除筛选条件，显示所有记录

---

### 步骤 7.3：集成新增投递功能

**操作说明**：

1. 在 Navbar 的"新增"按钮点击时打开 Modal
2. Modal 中渲染 ApplicationForm（新增模式）
3. 表单提交后调用 Store 的 `addApplication()`
4. 成功后关闭弹窗，列表自动更新

**验证测试**：

- 点击"新增"按钮，弹窗正确打开
- 填写表单并提交，新记录出现在列表中
- 打开 IndexedDB 查看，新记录已持久化
- 刷新页面，新记录仍然存在

---

### 步骤 7.4：集成编辑投递功能

**操作说明**：

1. 点击卡片时打开 Modal，传入当前记录数据
2. Modal 中渲染 ApplicationForm（编辑模式）
3. 表单提交后调用 Store 的 `updateApplication()`
4. 成功后关闭弹窗，卡片信息自动更新

**验证测试**：

- 点击某条记录的卡片，弹窗打开并显示该记录数据
- 修改部分字段并提交，卡片显示更新后的信息
- 打开 IndexedDB 查看，数据已更新
- 刷新页面，修改后的数据仍然存在

---

### 步骤 7.5：集成删除投递功能

**操作说明**：

1. 右键卡片选择删除时，打开 ConfirmDialog
2. 确认后调用 Store 的 `deleteApplication()`
3. 成功后关闭对话框，列表自动更新

**验证测试**：

- 右键卡片选择删除，确认对话框显示
- 点击"取消"，记录保留
- 点击"确认"，记录从列表中移除
- 打开 IndexedDB 查看，记录已删除
- 刷新页面，被删除的记录不再出现

---

### 步骤 7.6：实现日程表页面占位

**操作说明**：
创建 `src/pages/CalendarPage.tsx`：

1. 显示"日程表功能开发中"占位提示
2. 提供返回投递记录页面的链接

**验证测试**：

- 访问 `/calendar`，显示占位内容
- 点击返回链接，正确跳转到投递记录页面

---

## 阶段八：交互优化与细节完善

### 步骤 8.1：添加操作反馈提示

**操作说明**：

1. 创建 Toast 通知组件（或使用简单的状态提示）
2. 新增成功："投递记录已添加"
3. 更新成功："投递记录已更新"
4. 删除成功："投递记录已删除"
5. 操作失败时显示错误信息

**验证测试**：

- 新增记录后，显示成功提示
- 更新记录后，显示成功提示
- 删除记录后，显示成功提示
- 模拟操作失败，显示错误提示

---

### 步骤 8.2：优化表单交互体验

**操作说明**：

1. 表单字段添加输入验证和错误提示
2. applyLink 字段验证 URL 格式
3. applyDate 默认值设为今天
4. 提交按钮在提交过程中显示 loading 状态
5. 添加键盘快捷键支持（Enter 提交、ESC 取消）

**验证测试**：

- 输入无效 URL，显示格式错误提示
- 打开新增表单，日期默认为今天
- 快速双击提交按钮，不会重复提交
- 按 Enter 键提交表单
- 按 ESC 键关闭弹窗

---

### 步骤 8.3：优化卡片展示样式

**操作说明**：

1. 根据 companyLevel 显示不同颜色标签
2. 根据 result 显示不同状态徽章
3. 卡片 hover 时添加阴影效果
4. 响应式布局：移动端单列、平板双列、桌面三列

**验证测试**：

- 大厂、中厂、小厂、国企、外企显示不同颜色标签
- offer 显示绿色、挂显示红色、流程中显示蓝色
- 鼠标悬停卡片，阴影效果出现
- 调整浏览器窗口大小，卡片列数自动调整

---

### 步骤 8.4：添加空状态和加载状态

**操作说明**：

1. 无数据时显示友好的空状态插图和提示
2. 数据加载中显示骨架屏或加载动画
3. 筛选无结果时显示"未找到匹配的投递记录"

**验证测试**：

- IndexedDB 无数据时，显示空状态和"添加第一条记录"引导
- 设置筛选条件导致无结果时，显示筛选无结果提示
- 加载过程中显示 loading 状态

---

## 阶段九：工具函数与代码优化

### 步骤 9.1：创建日期工具函数

**操作说明**：
在 `src/lib/utils.ts` 中添加：

1. `formatDate(date: string)` - 将 ISO 日期格式化为可读格式（如：2026 年 1 月 27 日）
2. `formatRelativeDate(date: string)` - 相对时间（如：3 天前）
3. `isToday(date: string)` - 判断是否为今天
4. 使用 date-fns 库实现

**验证测试**：

- `formatDate('2026-01-27')` 返回 "2026 年 1 月 27 日"
- `formatRelativeDate` 对今天的日期返回 "今天"
- `isToday` 对今天的日期返回 true

---

### 步骤 9.2：创建样式工具函数

**操作说明**：
在 `src/lib/utils.ts` 中添加：

1. `cn(...classes)` - 使用 clsx 合并类名
2. `getCompanyLevelColor(level: CompanyLevel)` - 返回对应级别的颜色类名
3. `getResultStatusColor(result: ApplicationResult)` - 返回对应结果的颜色类名

**验证测试**：

- `cn('text-red', condition && 'bg-blue')` 正确合并类名
- `getCompanyLevelColor('大厂')` 返回预期的颜色类名
- `getResultStatusColor('offer')` 返回绿色相关类名

---

## 阶段十：测试与部署准备

### 步骤 10.1：进行完整功能测试

**操作说明**：
按以下场景进行手动测试：

1. 新增 5 条不同类型的投递记录
2. 使用所有筛选条件组合测试
3. 编辑每条记录的不同字段
4. 删除部分记录
5. 刷新页面验证数据持久化
6. 清除浏览器数据后重新访问

**验证测试**：

- 所有 CRUD 操作正常工作
- 筛选和排序功能正确
- 数据在页面刷新后保留
- 清除数据后应用正常启动（空状态）

---

### 步骤 10.2：代码质量检查

**操作说明**：

1. 运行 `npm run lint` 修复所有 ESLint 警告和错误
2. 运行 `npm run typecheck` 确保无 TypeScript 错误
3. 检查控制台无警告信息

**验证测试**：

- `npm run lint` 输出无错误
- `npm run typecheck` 输出无错误
- 浏览器控制台无 React 警告

---

### 步骤 10.3：生产构建测试

**操作说明**：

1. 运行 `npm run build` 构建生产版本
2. 运行 `npm run preview` 预览生产构建
3. 在预览模式下测试所有功能

**验证测试**：

- 构建成功，无错误
- 预览模式下所有功能正常工作
- IndexedDB 在生产模式下正常读写
- 页面加载速度正常

---

### 步骤 10.4：响应式布局测试

**操作说明**：
使用浏览器开发者工具测试以下设备：

1. 移动端（375px 宽度）
2. 平板（768px 宽度）
3. 桌面（1280px+ 宽度）

**验证测试**：

- 移动端：导航栏适配、卡片单列、弹窗全屏
- 平板：卡片双列、弹窗居中
- 桌面：卡片三列、完整布局
- 所有交互在各设备上可用

---

## 进度跟踪

| 阶段 | 步骤                 | 状态      | 完成日期 |
| ---- | -------------------- | --------- | -------- |
| 一   | 1.1 项目初始化       | ⬜ 待开始 | -        |
| 一   | 1.2 配置 Tailwind    | ⬜ 待开始 | -        |
| 一   | 1.3 安装依赖         | ⬜ 待开始 | -        |
| 一   | 1.4 创建目录结构     | ⬜ 待开始 | -        |
| 二   | 2.1 类型定义         | ⬜ 待开始 | -        |
| 二   | 2.2 IndexedDB 初始化 | ⬜ 待开始 | -        |
| 二   | 2.3 CRUD 操作函数    | ⬜ 待开始 | -        |
| 三   | 3.1 Store 基础结构   | ⬜ 待开始 | -        |
| 三   | 3.2 数据操作方法     | ⬜ 待开始 | -        |
| 三   | 3.3 筛选排序状态     | ⬜ 待开始 | -        |
| 四   | 4.1 路由配置         | ⬜ 待开始 | -        |
| 五   | 5.1 Navbar           | ⬜ 待开始 | -        |
| 五   | 5.2 Modal            | ⬜ 待开始 | -        |
| 五   | 5.3 ConfirmDialog    | ⬜ 待开始 | -        |
| 五   | 5.4 FilterBar        | ⬜ 待开始 | -        |
| 六   | 6.1 ApplicationForm  | ⬜ 待开始 | -        |
| 六   | 6.2 ApplicationCard  | ⬜ 待开始 | -        |
| 六   | 6.3 右键菜单         | ⬜ 待开始 | -        |
| 七   | 7.1 页面基础布局     | ⬜ 待开始 | -        |
| 七   | 7.2 筛选排序集成     | ⬜ 待开始 | -        |
| 七   | 7.3 新增功能         | ⬜ 待开始 | -        |
| 七   | 7.4 编辑功能         | ⬜ 待开始 | -        |
| 七   | 7.5 删除功能         | ⬜ 待开始 | -        |
| 七   | 7.6 日程表占位       | ⬜ 待开始 | -        |
| 八   | 8.1 操作反馈         | ⬜ 待开始 | -        |
| 八   | 8.2 表单优化         | ⬜ 待开始 | -        |
| 八   | 8.3 卡片样式         | ⬜ 待开始 | -        |
| 八   | 8.4 空状态/加载状态  | ⬜ 待开始 | -        |
| 九   | 9.1 日期工具函数     | ⬜ 待开始 | -        |
| 九   | 9.2 样式工具函数     | ⬜ 待开始 | -        |
| 十   | 10.1 完整功能测试    | ⬜ 待开始 | -        |
| 十   | 10.2 代码质量检查    | ⬜ 待开始 | -        |
| 十   | 10.3 生产构建测试    | ⬜ 待开始 | -        |
| 十   | 10.4 响应式测试      | ⬜ 待开始 | -        |

---

## 注意事项

1. **每完成一步都要进行验证测试**，确保功能正常后再进入下一步
2. **遇到问题及时记录**，并在解决后更新文档
3. **保持代码整洁**，遵循 TypeScript 和 React 最佳实践
4. **定期提交代码**，使用有意义的 commit message
