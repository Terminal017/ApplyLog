import { openDB } from 'idb'
import type { DBSchema, IDBPDatabase } from 'idb'
import { v4 as uuidv4 } from 'uuid'
import type {
  Application,
  ApplicationInput,
  ApplicationUpdate,
  Schedule,
  ScheduleInput,
  ScheduleUpdate,
} from './types'

// 定义数据库 Schema
interface ApplyLogDBSchema extends DBSchema {
  applications: {
    key: string
    value: Application
    indexes: {
      'by-applyDate': string
      'by-companyLevel': string
      'by-result': string
    }
  }
  schedules: {
    key: string
    value: Schedule
    indexes: {
      'by-date': string
      'by-completed': string
    }
  }
}

const DB_NAME = 'ApplyLogDB'
const DB_VERSION = 2 // 升级版本号以触发数据库升级

// 数据库实例缓存
let dbInstance: IDBPDatabase<ApplyLogDBSchema> | null = null

// 初始化数据库
export async function initDB(): Promise<IDBPDatabase<ApplyLogDBSchema>> {
  if (dbInstance) {
    return dbInstance
  }

  dbInstance = await openDB<ApplyLogDBSchema>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      // 创建 applications 对象仓库
      if (!db.objectStoreNames.contains('applications')) {
        const store = db.createObjectStore('applications', { keyPath: 'id' })

        // 创建索引
        store.createIndex('by-applyDate', 'applyDate')
        store.createIndex('by-companyLevel', 'companyLevel')
        store.createIndex('by-result', 'result')
      }

      // 版本 2：创建 schedules 对象仓库
      if (oldVersion < 2) {
        if (!db.objectStoreNames.contains('schedules')) {
          const scheduleStore = db.createObjectStore('schedules', {
            keyPath: 'id',
          })

          // 创建索引
          scheduleStore.createIndex('by-date', 'date')
          scheduleStore.createIndex('by-completed', 'completed')
        }
      }
    },
  })

  return dbInstance
}

// 获取数据库实例
async function getDB(): Promise<IDBPDatabase<ApplyLogDBSchema>> {
  if (!dbInstance) {
    return initDB()
  }
  return dbInstance
}

// ==================== CRUD 操作 ====================

// 新增投递记录
export async function addApplication(
  data: ApplicationInput,
): Promise<Application> {
  const db = await getDB()
  const now = new Date().toISOString()

  const application: Application = {
    ...data,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
  }

  await db.add('applications', application)
  return application
}

// 更新投递记录
export async function updateApplication(
  id: string,
  data: ApplicationUpdate,
): Promise<Application | null> {
  const db = await getDB()
  const existing = await db.get('applications', id)

  if (!existing) {
    return null
  }

  const updated: Application = {
    ...existing,
    ...data,
    updatedAt: new Date().toISOString(),
  }

  await db.put('applications', updated)
  return updated
}

// 删除投递记录
export async function deleteApplication(id: string): Promise<boolean> {
  const db = await getDB()
  const existing = await db.get('applications', id)

  if (!existing) {
    return false
  }

  await db.delete('applications', id)
  return true
}

// 获取单条投递记录
export async function getApplication(id: string): Promise<Application | null> {
  const db = await getDB()
  const application = await db.get('applications', id)
  return application || null
}

// 获取所有投递记录
export async function getAllApplications(): Promise<Application[]> {
  const db = await getDB()
  return db.getAll('applications')
}

// ==================== 日程 CRUD 操作 ====================

// 新增日程
export async function addSchedule(data: ScheduleInput): Promise<Schedule> {
  const db = await getDB()
  const now = new Date().toISOString()

  const schedule: Schedule = {
    ...data,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
  }

  await db.add('schedules', schedule)
  return schedule
}

// 更新日程
export async function updateSchedule(
  id: string,
  data: ScheduleUpdate,
): Promise<Schedule | null> {
  const db = await getDB()
  const existing = await db.get('schedules', id)

  if (!existing) {
    return null
  }

  const updated: Schedule = {
    ...existing,
    ...data,
    updatedAt: new Date().toISOString(),
  }

  await db.put('schedules', updated)
  return updated
}

// 删除日程
export async function deleteSchedule(id: string): Promise<boolean> {
  const db = await getDB()
  const existing = await db.get('schedules', id)

  if (!existing) {
    return false
  }

  await db.delete('schedules', id)
  return true
}

// 获取单条日程
export async function getSchedule(id: string): Promise<Schedule | null> {
  const db = await getDB()
  const schedule = await db.get('schedules', id)
  return schedule || null
}

// 获取所有日程
export async function getAllSchedules(): Promise<Schedule[]> {
  const db = await getDB()
  return db.getAll('schedules')
}

// 导出数据库操作函数供控制台调试使用
if (typeof window !== 'undefined') {
  ;(window as unknown as Record<string, unknown>).db = {
    initDB,
    addApplication,
    updateApplication,
    deleteApplication,
    getApplication,
    getAllApplications,
    // 日程操作
    addSchedule,
    updateSchedule,
    deleteSchedule,
    getSchedule,
    getAllSchedules,
  }
}
