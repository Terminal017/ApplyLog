import { create } from 'zustand'
import type {
  Application,
  ApplicationInput,
  ApplicationUpdate,
  CompanyLevel,
} from '../lib/types'
import * as db from '../lib/db'

// Store 状态接口
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
  addApplication: (data: ApplicationInput) => Promise<Application | null>
  updateApplication: (
    id: string,
    data: ApplicationUpdate,
  ) => Promise<Application | null>
  deleteApplication: (id: string) => Promise<boolean>

  // 筛选排序 Actions
  setFilterByCompanyLevel: (level: CompanyLevel | null) => void
  setFilterByInProgress: (value: boolean) => void
  setSortOrder: (order: 'asc' | 'desc') => void

  // 计算属性
  getFilteredAndSortedApplications: () => Application[]
}

export const useApplicationStore = create<ApplicationState>((set, get) => ({
  // 初始状态
  applications: [],
  isLoading: false,
  error: null,
  filterByCompanyLevel: null,
  filterByInProgress: false,
  sortOrder: 'desc',

  // 从 IndexedDB 加载所有记录
  fetchApplications: async () => {
    set({ isLoading: true, error: null })
    try {
      const applications = await db.getAllApplications()
      set({ applications, isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  // 添加新记录
  addApplication: async (data: ApplicationInput) => {
    set({ isLoading: true, error: null })
    try {
      const newApplication = await db.addApplication(data)
      set((state) => ({
        applications: [...state.applications, newApplication],
        isLoading: false,
      }))
      return newApplication
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      return null
    }
  },

  // 更新记录
  updateApplication: async (id: string, data: ApplicationUpdate) => {
    set({ isLoading: true, error: null })
    try {
      const updated = await db.updateApplication(id, data)
      if (updated) {
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === id ? updated : app,
          ),
          isLoading: false,
        }))
      } else {
        set({ isLoading: false })
      }
      return updated
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      return null
    }
  },

  // 删除记录
  deleteApplication: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const success = await db.deleteApplication(id)
      if (success) {
        set((state) => ({
          applications: state.applications.filter((app) => app.id !== id),
          isLoading: false,
        }))
      } else {
        set({ isLoading: false })
      }
      return success
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      return false
    }
  },

  // 设置公司级别筛选
  setFilterByCompanyLevel: (level: CompanyLevel | null) => {
    set({ filterByCompanyLevel: level })
  },

  // 设置流程中筛选
  setFilterByInProgress: (value: boolean) => {
    set({ filterByInProgress: value })
  },

  // 设置排序方向
  setSortOrder: (order: 'asc' | 'desc') => {
    set({ sortOrder: order })
  },

  // 获取筛选和排序后的列表
  getFilteredAndSortedApplications: () => {
    const {
      applications,
      filterByCompanyLevel,
      filterByInProgress,
      sortOrder,
    } = get()

    let filtered = [...applications]

    // 按公司级别筛选
    if (filterByCompanyLevel) {
      filtered = filtered.filter(
        (app) => app.companyLevel === filterByCompanyLevel,
      )
    }

    // 筛选流程中的投递（result === null）
    if (filterByInProgress) {
      filtered = filtered.filter((app) => app.result === null)
    }

    // 按投递时间排序
    filtered.sort((a, b) => {
      const dateA = new Date(a.applyDate).getTime()
      const dateB = new Date(b.applyDate).getTime()
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
    })

    return filtered
  },
}))
