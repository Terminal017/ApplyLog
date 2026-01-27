import { openDB } from 'idb'
import type { DBSchema, IDBPDatabase } from 'idb'
import { v4 as uuidv4 } from 'uuid'
import type { Application, ApplicationInput, ApplicationUpdate } from './types'

// 定义数据库 Schema
interface ApplyLogDBSchema extends DBSchema {
  applications: {
    key: string
    value: Application
    indexes: {
      'by-applyDate': string
      'by-companyLevel': string
      'by-result': string | null
    }
  }
}

const DB_NAME = 'ApplyLogDB'
const DB_VERSION = 1

// 数据库实例缓存
let dbInstance: IDBPDatabase<ApplyLogDBSchema> | null = null

// 初始化数据库
export async function initDB(): Promise<IDBPDatabase<ApplyLogDBSchema>> {
  if (dbInstance) {
    return dbInstance
  }

  dbInstance = await openDB<ApplyLogDBSchema>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // 创建 applications 对象仓库
      if (!db.objectStoreNames.contains('applications')) {
        const store = db.createObjectStore('applications', { keyPath: 'id' })

        // 创建索引
        store.createIndex('by-applyDate', 'applyDate')
        store.createIndex('by-companyLevel', 'companyLevel')
        store.createIndex('by-result', 'result')
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

// 导出数据库操作函数供控制台调试使用
if (typeof window !== 'undefined') {
  ;(window as unknown as Record<string, unknown>).db = {
    initDB,
    addApplication,
    updateApplication,
    deleteApplication,
    getApplication,
    getAllApplications,
  }
}
