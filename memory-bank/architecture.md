# 项目架构

本文档记录实习投递追踪系统的技术架构和代码组织结构。

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
│   └── ApplicationForm.tsx  # 新增/编辑表单
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
│   └── utils.ts            # 通用工具函数
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

1. 用户点击 Navbar 的「新增」按钮
2. 打开 Modal，显示 ApplicationForm
3. 用户填写表单并提交
4. 调用 `applicationStore.addApplication(data)`
5. Store 内部调用 `db.addApplication(data)` 写入 IndexedDB
6. 成功后更新 Store 中的 `applications` 数组
7. ApplicationsPage 自动重新渲染，显示新记录

---

## 四、核心类型定义

```typescript
// 投递记录
interface Application {
  id: string
  companyName: string
  jobName: string
  city: string
  companyLevel: CompanyLevel
  applyChannel: ApplyChannel
  applyLink: string
  applyDate: string
  processStatus: string
  record: string
  result: ApplicationResult
  remark: string
  createdAt: string
  updatedAt: string
}

// 公司级别
type CompanyLevel = '大厂' | '中厂' | '小厂' | '国企' | '外企'

// 投递渠道
type ApplyChannel = '官网' | '内推' | '邮箱' | '其他'

// 投递结果
type ApplicationResult =
  | 'offer'
  | '一面挂'
  | '二面挂'
  | '三面挂'
  | 'hr挂'
  | null
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

## 七、状态管理设计

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

## 八、开发进度

此部分内容详见 `progress.md`。
