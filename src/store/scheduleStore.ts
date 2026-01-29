import { create } from 'zustand'
import type { Schedule, ScheduleInput, ScheduleUpdate } from '../lib/types'
import * as db from '../lib/db'

// Store 状态接口
interface ScheduleState {
  // 数据
  schedules: Schedule[]
  isLoading: boolean
  error: string | null

  // 筛选排序
  showOnlyIncomplete: boolean // 仅显示未完成
  sortOrder: 'asc' | 'desc' // 时间排序方向

  // 分页
  currentPage: number
  pageSize: number

  // Actions
  fetchSchedules: () => Promise<void>
  addSchedule: (data: ScheduleInput) => Promise<Schedule | null>
  updateSchedule: (id: string, data: ScheduleUpdate) => Promise<Schedule | null>
  deleteSchedule: (id: string) => Promise<boolean>
  toggleComplete: (id: string) => Promise<Schedule | null>

  // 筛选排序 Actions
  setShowOnlyIncomplete: (value: boolean) => void
  toggleSortOrder: () => void

  // 分页 Actions
  setCurrentPage: (page: number) => void

  // 计算属性
  getFilteredAndSortedSchedules: () => Schedule[]
  getPaginatedSchedules: () => Schedule[]
  getTotalPages: () => number
  getStats: () => { total: number; completed: number }
}

// 判断是否为今天
function isToday(dateStr: string): boolean {
  const today = new Date()
  const date = new Date(dateStr)
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  )
}

// 判断是否为明天
function isTomorrow(dateStr: string): boolean {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const date = new Date(dateStr)
  return (
    date.getFullYear() === tomorrow.getFullYear() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getDate() === tomorrow.getDate()
  )
}

// 导出日期判断函数供组件使用
export { isToday, isTomorrow }

export const useScheduleStore = create<ScheduleState>((set, get) => ({
  // 初始状态
  schedules: [],
  isLoading: false,
  error: null,
  showOnlyIncomplete: false,
  sortOrder: 'asc',
  currentPage: 1,
  pageSize: 10,

  // 从 IndexedDB 加载所有日程
  fetchSchedules: async () => {
    set({ isLoading: true, error: null })
    try {
      const schedules = await db.getAllSchedules()
      set({ schedules, isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  // 添加新日程
  addSchedule: async (data: ScheduleInput) => {
    set({ isLoading: true, error: null })
    try {
      const newSchedule = await db.addSchedule(data)
      set((state) => ({
        schedules: [...state.schedules, newSchedule],
        isLoading: false,
      }))
      return newSchedule
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      return null
    }
  },

  // 更新日程
  updateSchedule: async (id: string, data: ScheduleUpdate) => {
    set({ isLoading: true, error: null })
    try {
      const updated = await db.updateSchedule(id, data)
      if (updated) {
        set((state) => ({
          schedules: state.schedules.map((s) => (s.id === id ? updated : s)),
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

  // 删除日程
  deleteSchedule: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const success = await db.deleteSchedule(id)
      if (success) {
        set((state) => ({
          schedules: state.schedules.filter((s) => s.id !== id),
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

  // 切换完成状态
  toggleComplete: async (id: string) => {
    const schedule = get().schedules.find((s) => s.id === id)
    if (!schedule) return null

    return get().updateSchedule(id, { completed: !schedule.completed })
  },

  // 设置仅显示未完成
  setShowOnlyIncomplete: (value: boolean) => {
    set({ showOnlyIncomplete: value, currentPage: 1 })
  },

  // 切换排序方向
  toggleSortOrder: () => {
    set((state) => ({
      sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc',
    }))
  },

  // 设置当前页
  setCurrentPage: (page: number) => {
    set({ currentPage: page })
  },

  // 获取筛选和排序后的列表
  getFilteredAndSortedSchedules: () => {
    const { schedules, showOnlyIncomplete, sortOrder } = get()

    let filtered = [...schedules]

    // 筛选未完成的日程
    if (showOnlyIncomplete) {
      filtered = filtered.filter((s) => !s.completed)
    }

    // 排序：未完成的在前，已完成的在后
    // 在各自组内按日期时间排序
    filtered.sort((a, b) => {
      // 首先按完成状态排序：未完成在前
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1
      }

      // 然后按日期时间排序
      const dateTimeA = new Date(`${a.date}T${a.time}`).getTime()
      const dateTimeB = new Date(`${b.date}T${b.time}`).getTime()
      return sortOrder === 'asc' ? dateTimeA - dateTimeB : dateTimeB - dateTimeA
    })

    return filtered
  },

  // 获取分页后的列表
  getPaginatedSchedules: () => {
    const { currentPage, pageSize } = get()
    const filtered = get().getFilteredAndSortedSchedules()

    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize

    return filtered.slice(startIndex, endIndex)
  },

  // 获取总页数
  getTotalPages: () => {
    const { pageSize } = get()
    const filtered = get().getFilteredAndSortedSchedules()
    return Math.ceil(filtered.length / pageSize) || 1
  },

  // 获取统计数据
  getStats: () => {
    const { schedules } = get()
    return {
      total: schedules.length,
      completed: schedules.filter((s) => s.completed).length,
    }
  },
}))
