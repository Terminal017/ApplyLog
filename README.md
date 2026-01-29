# 应聘信息追踪系统 (ApplyLog)

一个面向个人的应聘流程管理工具，用于集中记录、追踪和管理所有应聘投递信息。

开发说明：本项目设计图主要由 GPT 和 Galileo AI 创作，开发部分主要依赖 Claude 和 Copilot 完成，AI 生码占比 90%左右，设计和开发总时间小于 12 小时。

## 功能特性

### 投递记录管理

- **增删改查**：支持新增、编辑、删除投递记录
- **筛选功能**：按公司级别筛选、筛选流程中的记录
- **排序功能**：按投递日期升序/降序排列

### 日程管理

- **日程管理**：支持新增、编辑、删除日程
- **完成状态**：点击复选框标记日程完成，已完成日程显示删除线并移至底部
- **日期高亮**：当天日程显示橙色边框，明天日程显示蓝色边框
- **筛选排序**：支持按时间排序、仅显示未完成日程
- **分页功能**：支持分页浏览，显示统计信息

### 通用特性

- **本地存储**：使用 IndexedDB 本地存储数据，无需后端服务
- **响应式设计**：支持移动端和桌面端，移动端显示汉堡菜单

## 技术栈

- **前端框架**：React 19 + TypeScript
- **构建工具**：Vite 7
- **样式**：Tailwind CSS v4
- **状态管理**：Zustand
- **路由**：React Router v7
- **数据库**：IndexedDB（使用 idb 库）
- **图标**：Lucide React

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 生产构建

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 使用说明

### 投递记录

1. **新增投递**：点击筛选栏右侧「新增投递」按钮
2. **编辑投递**：单击卡片进入编辑模式
3. **删除投递**：右键点击卡片选择删除
4. **筛选记录**：使用筛选栏按公司级别或流程状态筛选
5. **排序记录**：点击排序按钮切换升序/降序

### 日程管理

1. **进入日程页**：点击导航栏「日程表」链接
2. **新增日程**：点击「新增日程」按钮，填写日期、时间、标题、描述
3. **编辑日程**：单击日程行进入编辑模式
4. **完成日程**：点击复选框标记完成，日程显示删除线并移至底部
5. **删除日程**：右键点击日程行选择删除
6. **筛选排序**：点击「按时间排序」切换升序/降序，点击「仅未完成」隐藏已完成日程

## 项目结构

```
src/
├── components/          # 可复用 UI 组件
│   ├── Navbar.tsx           # 导航栏（响应式汉堡菜单）
│   ├── Modal.tsx            # 通用弹窗
│   ├── ConfirmDialog.tsx    # 确认对话框
│   ├── FilterBar.tsx        # 投递记录筛选栏
│   ├── ApplicationCard.tsx  # 投递记录卡片
│   ├── ApplicationForm.tsx  # 投递记录表单
│   ├── Toast.tsx            # 操作反馈通知
│   ├── ScheduleFilterBar.tsx # 日程筛选栏
│   ├── ScheduleRow.tsx      # 日程行组件
│   └── ScheduleForm.tsx     # 日程表单
├── pages/               # 页面组件
│   ├── ApplicationsPage.tsx  # 投递记录表页面
│   └── SchedulePage.tsx      # 日程表页面
├── store/               # Zustand 状态管理
│   ├── applicationStore.ts   # 投递记录状态
│   └── scheduleStore.ts      # 日程状态
├── lib/                 # 工具函数和配置
│   ├── db.ts               # IndexedDB 数据库操作
│   ├── types.ts            # TypeScript 类型定义
│   └── utils.ts            # 工具函数
├── App.tsx              # 根组件（路由配置）
└── main.tsx             # 应用入口
```

## 数据存储

使用 IndexedDB 本地存储，数据库版本 v2，包含两个对象仓库：

- **applications**：投递记录，索引：applyDate、companyLevel、result
- **schedules**：日程记录，索引：date、completed
