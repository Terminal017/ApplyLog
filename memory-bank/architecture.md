# 项目架构

本文档记录应聘信息追踪系统的技术架构和代码组织结构。

---

## 一、技术架构概览

```
┌─────────────────────────────────────────────────────────────┐
│                        用户界面 (UI)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Navbar    │  │  FilterBar  │  │   ApplicationCard   │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │    Modal    │  │ ConfirmDialog│ │  ApplicationForm    │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       页面层 (Pages)                         │
│  ┌────────────────────────┐  ┌────────────────────────────┐ │
│  │   ApplicationsPage     │  │      CalendarPage          │ │
│  │   (投递记录表页面)      │  │      (日程表页面-预留)      │ │
│  └────────────────────────┘  └────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    状态管理层 (Zustand Store)                │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  applicationStore                                       ││
│  │  - applications: Application[]                          ││
│  │  - isLoading: boolean                                   ││
│  │  - filterByCompanyLevel / filterByInProgress / sortOrder││
│  │  - fetchApplications / addApplication / updateApplication││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    数据持久层 (IndexedDB)                    │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  ApplyLogDB                                             ││
│  │  └── applications (Object Store)                        ││
│  │      - keyPath: id                                      ││
│  │      - indexes: applyDate, companyLevel, result         ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## 二、目录结构

```
src/
├── components/          # 可复用 UI 组件
│   ├── Navbar.tsx           # 导航栏
│   ├── Modal.tsx            # 通用弹窗
│   ├── ConfirmDialog.tsx    # 确认对话框
│   ├── FilterBar.tsx        # 筛选栏
│   ├── ApplicationCard.tsx  # 投递记录卡片
│   ├── ApplicationForm.tsx  # 新增/编辑表单
│   └── Toast.tsx            # 操作反馈通知
│
├── pages/              # 页面组件
│   ├── ApplicationsPage.tsx  # 投递记录表页面
│   └── CalendarPage.tsx      # 日程表页面（预留）
│
├── store/              # Zustand 状态管理
│   └── applicationStore.ts   # 投递记录状态
│
├── lib/                # 工具函数和配置
│   ├── db.ts               # IndexedDB 数据库操作
│   ├── types.ts            # TypeScript 类型定义
│   ├── dateUtils.ts        # 日期工具函数
│   └── styleUtils.ts       # 样式工具函数
│
├── App.tsx             # 根组件（路由配置）
├── main.tsx            # 应用入口
└── index.css           # 全局样式（Tailwind）
```

---

## 三、数据流

```
用户操作 → UI 组件 → Zustand Store Action → IndexedDB CRUD → 更新 Store 状态 → UI 重新渲染
```

### 示例：新增投递记录

1. 用户点击 Navbar 的「新增投递」按钮
2. App.tsx 打开 Modal，显示 ApplicationForm（新增模式）
3. 用户填写表单并提交
4. 调用 `applicationStore.addApplication(data)`
5. Store 内部调用 `db.addApplication(data)` 写入 IndexedDB
6. 成功后更新 Store 中的 `applications` 数组
7. ApplicationsPage 自动重新渲染，显示新记录

### 示例：编辑投递记录

1. 用户单击 ApplicationCard 卡片
2. App.tsx 打开 Modal，显示 ApplicationForm（编辑模式，传入 initialData）
3. 用户修改表单并提交
4. 调用 `applicationStore.updateApplication(id, data)`
5. Store 内部调用 `db.updateApplication(id, data)` 更新 IndexedDB
6. 成功后更新 Store 中的 `applications` 数组
7. ApplicationsPage 自动重新渲染，显示更新后的记录

### 示例：删除投递记录

1. 用户右键点击 ApplicationCard 卡片，选择「删除」
2. App.tsx 打开 ConfirmDialog 确认对话框
3. 用户点击「确认删除」
4. 调用 `applicationStore.deleteApplication(id)`
5. Store 内部调用 `db.deleteApplication(id)` 从 IndexedDB 删除
6. 成功后更新 Store 中的 `applications` 数组
7. ApplicationsPage 自动重新渲染，移除该记录

---

## 四、核心类型定义

```typescript
// 投递记录
interface Application {
  id: string
  companyName: string
  jobName: string
  jobType: JobType
  city: string
  companyLevel: CompanyLevel
  applyChannel: ApplyChannel
  applyLink: string
  applyDate: string
  processStatus: string
  record: string
  result: ApplicationResult
  createdAt: string
  updatedAt: string
}

// 公司级别
type CompanyLevel = '大厂' | '中厂' | '小厂' | '国企' | '外企'

// 投递渠道
type ApplyChannel = '官网' | 'Boss直聘' | '牛客' | '实习僧' | '内推' | '其他'

// 岗位类型
type JobType = '日常实习' | '暑期实习' | '校招'

// 投递结果
type ApplicationResult =
  | '待投递'
  | '流程中'
  | 'offer'
  | '简历挂'
  | '笔试挂'
  | '面试挂'

// 当前进度
type ApplicationStatus =
  | '简历初筛'
  | '笔试'
  | '一面'
  | '二面'
  | '三面'
  | 'HR面'
  | '录用'
```

---

## 五、路由结构

| 路径        | 页面             | 说明                   |
| ----------- | ---------------- | ---------------------- |
| `/`         | ApplicationsPage | 投递记录表页面（主页） |
| `/calendar` | CalendarPage     | 日程表页面（预留）     |

---

## 六、组件依赖关系

```
App.tsx
├── Navbar
│   └── [新增按钮触发 Modal]
├── Routes
│   ├── ApplicationsPage
│   │   ├── FilterBar
│   │   └── ApplicationCard (列表)
│   │       └── [右键菜单]
│   └── CalendarPage
├── Modal
│   └── ApplicationForm
└── ConfirmDialog
```

---

## 六-A、已实现组件说明

### Navbar (src/components/Navbar.tsx)

- **功能**：顶部导航栏
- **Props**：`onAddClick: () => void` - 新增按钮点击回调
- **特性**：
  - 应用标题"实习投递追踪"
  - 路由链接：投递记录(/)、日程表(/calendar)
  - 当前路由高亮显示
  - 蓝色"新增投递"按钮（含 Plus 图标）
  - 固定顶部 sticky 定位

### Modal (src/components/Modal.tsx)

- **功能**：通用弹窗组件
- **Props**：
  - `isOpen: boolean` - 控制显示/隐藏
  - `onClose: () => void` - 关闭回调
  - `title: string` - 弹窗标题
  - `children: ReactNode` - 弹窗内容
- **特性**：
  - 使用 React Portal 渲染到 body
  - 点击遮罩层关闭
  - ESC 键关闭
  - 打开时禁止页面滚动

### ConfirmDialog (src/components/ConfirmDialog.tsx)

- **功能**：确认对话框（用于删除操作）
- **Props**：
  - `isOpen: boolean`
  - `onConfirm: () => void` - 确认回调
  - `onCancel: () => void` - 取消回调
  - `title: string`
  - `message: string`
- **特性**：
  - 基于 Modal 封装
  - 红色确认按钮（删除警告样式）

### FilterBar (src/components/FilterBar.tsx)

- **功能**：筛选栏组件
- **特性**：
  - 公司级别下拉选择（全部/大厂/中厂/小厂/国企/外企）
  - "仅显示流程中"复选框
  - 排序方向切换按钮（升序/降序）
  - 直接连接 Zustand Store 状态

### ApplicationForm (src/components/ApplicationForm.tsx)

- **功能**：投递记录新增/编辑表单
- **Props**：
  - `initialData?: Application` - 编辑模式时传入已有数据
  - `onSubmit: (data: ApplicationInput) => void` - 提交回调
  - `onCancel: () => void` - 取消回调
- **特性**：
  - 包含所有字段输入控件（公司名称、岗位名称、岗位类型、城市、公司级别、投递渠道、投递链接、投递时间、当前进度、投递结果、面试记录）
  - 必填字段验证（公司名称、岗位名称、城市、投递时间）
  - 新增模式：按钮显示"添加"
  - 编辑模式：自动填充已有数据，按钮显示"保存修改"

### ApplicationCard (src/components/ApplicationCard.tsx)

- **功能**：投递记录卡片展示组件
- **Props**：
  - `application: Application` - 投递记录数据
  - `onEdit: (application: Application) => void` - 编辑回调
  - `onDelete: (id: string) => void` - 删除回调
- **特性**：
  - 两列网格布局展示（lg 屏幕）
  - 第一行：公司名称（蓝色）+ 岗位名称 + 投递结果标签（右上角）
  - 第二行：岗位类型标签 + 分隔线 + 城市 + 投递渠道
  - 详情区域：当前进度、面试记录
  - 底部：投递时间（左侧）+ 公司级别标签（右侧）
  - 结果状态颜色标签（offer 绿色、挂 红色、流程中 天蓝色、待投递 灰色）
  - 单击卡片触发编辑
  - 右键菜单支持删除操作

### Toast (src/components/Toast.tsx)

- **功能**：操作反馈通知组件
- **Props**：
  - `message: string` - 提示消息
  - `type: 'success' | 'error'` - 通知类型
  - `isVisible: boolean` - 控制显示/隐藏
  - `onClose: () => void` - 关闭回调
  - `duration?: number` - 自动关闭时间（默认 3000ms）
- **特性**：
  - 使用 React Portal 渲染到 body
  - 固定在顶部中间显示
  - 自动消失（可配置时间）
  - 成功绿色、错误红色样式
  - 支持手动关闭

---

## 七、工具函数

### dateUtils.ts（日期工具函数）

| 函数名            | 说明                                     | 返回值    |
| ----------------- | ---------------------------------------- | --------- |
| `formatDate`      | 格式化日期为 YYYY-MM-DD                  | `string`  |
| `formatDateCN`    | 格式化日期为中文格式 YYYY 年 MM 月 DD 日 | `string`  |
| `getRelativeTime` | 获取相对时间描述（今天、昨天、X 天前）   | `string`  |
| `getDaysDiff`     | 计算两个日期之间的天数差                 | `number`  |
| `isToday`         | 判断日期是否是今天                       | `boolean` |
| `getTodayString`  | 获取今天的日期字符串                     | `string`  |

### styleUtils.ts（样式工具函数）

| 函数名                 | 说明                       | 返回值                   |
| ---------------------- | -------------------------- | ------------------------ |
| `getResultStyles`      | 获取投递结果对应的样式     | `{ bgColor, textColor }` |
| `getStatusStyles`      | 获取投递状态对应的样式     | `{ bgColor, textColor }` |
| `getJobTypeStyles`     | 获取岗位类型对应的样式     | `{ bgColor, textColor }` |
| `cn`                   | 合并多个类名               | `string`                 |
| `getResultBadgeClass`  | 生成投递结果徽章的完整类名 | `string`                 |
| `getStatusBadgeClass`  | 生成投递状态徽章的完整类名 | `string`                 |
| `getJobTypeBadgeClass` | 生成岗位类型徽章的完整类名 | `string`                 |

---

## 八、状态管理设计

### applicationStore 状态

```typescript
interface ApplicationState {
  // 数据
  applications: Application[]
  isLoading: boolean
  error: string | null

  // 筛选排序
  filterByCompanyLevel: CompanyLevel | null
  filterByInProgress: boolean
  sortOrder: 'asc' | 'desc'

  // Actions
  fetchApplications: () => Promise<void>
  addApplication: (
    data: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>,
  ) => Promise<void>
  updateApplication: (id: string, data: Partial<Application>) => Promise<void>
  deleteApplication: (id: string) => Promise<void>
  setFilterByCompanyLevel: (level: CompanyLevel | null) => void
  setFilterByInProgress: (value: boolean) => void
  setSortOrder: (order: 'asc' | 'desc') => void
  getFilteredAndSortedApplications: () => Application[]
}
```

---

## 九、开发进度

此部分内容详见 `progress.md`。
