import {
  format,
  formatDistanceToNow,
  isToday as dateFnsIsToday,
} from 'date-fns'
import { zhCN } from 'date-fns/locale'
import clsx, { type ClassValue } from 'clsx'
import type { CompanyLevel, ApplicationResult } from './types'

// ==================== 日期工具函数 ====================

/**
 * 将 ISO 日期字符串格式化为可读的中文格式
 * @param date - ISO 日期字符串，如 '2026-01-27'
 * @returns 格式化后的日期字符串，如 '2026年1月27日'
 * @example
 * formatDate('2026-01-27') // '2026年1月27日'
 */
export function formatDate(date: string): string {
  try {
    const dateObj = new Date(date)
    return format(dateObj, 'yyyy年M月d日', { locale: zhCN })
  } catch {
    return date
  }
}

/**
 * 将 ISO 日期字符串格式化为简短格式（月日）
 * @param date - ISO 日期字符串
 * @returns 格式化后的日期字符串，如 '1月27日'
 * @example
 * formatShortDate('2026-01-27') // '1月27日'
 */
export function formatShortDate(date: string): string {
  try {
    const dateObj = new Date(date)
    return format(dateObj, 'M月d日', { locale: zhCN })
  } catch {
    return date
  }
}

/**
 * 将 ISO 日期字符串转换为相对时间描述
 * @param date - ISO 日期字符串
 * @returns 相对时间字符串，如 '3天前'、'今天'、'1个月前'
 * @example
 * formatRelativeDate('2026-01-26') // '1天前'（假设今天是2026-01-27）
 * formatRelativeDate('2026-01-27') // '今天'（假设今天是2026-01-27）
 */
export function formatRelativeDate(date: string): string {
  try {
    const dateObj = new Date(date)

    // 如果是今天，返回 '今天'
    if (dateFnsIsToday(dateObj)) {
      return '今天'
    }

    return formatDistanceToNow(dateObj, {
      addSuffix: true,
      locale: zhCN,
    })
  } catch {
    return date
  }
}

/**
 * 判断给定日期是否为今天
 * @param date - ISO 日期字符串
 * @returns 如果是今天返回 true，否则返回 false
 * @example
 * isToday('2026-01-29') // true（假设今天是2026-01-29）
 * isToday('2026-01-28') // false
 */
export function isToday(date: string): boolean {
  try {
    const dateObj = new Date(date)
    return dateFnsIsToday(dateObj)
  } catch {
    return false
  }
}

// ==================== 样式工具函数 ====================

/**
 * 合并 CSS 类名，支持条件类名
 * 使用 clsx 库实现，方便处理动态类名
 * @param classes - 类名或条件类名数组
 * @returns 合并后的类名字符串
 * @example
 * cn('text-red-500', 'bg-white') // 'text-red-500 bg-white'
 * cn('text-red-500', isActive && 'font-bold') // 条件类名
 * cn('base-class', { 'active': isActive, 'disabled': isDisabled }) // 对象语法
 */
export function cn(...classes: ClassValue[]): string {
  return clsx(...classes)
}

/**
 * 根据公司级别返回对应的 Tailwind 颜色类名
 * @param level - 公司级别
 * @returns Tailwind CSS 类名字符串
 * @example
 * getCompanyLevelColor('大厂') // 'bg-purple-100 text-purple-700'
 */
export function getCompanyLevelColor(level: CompanyLevel): string {
  const colorMap: Record<CompanyLevel, string> = {
    大厂: 'bg-purple-100 text-purple-700',
    中厂: 'bg-blue-100 text-blue-700',
    小厂: 'bg-green-100 text-green-700',
    国企: 'bg-red-100 text-red-700',
    外企: 'bg-amber-100 text-amber-700',
  }
  return colorMap[level] || 'bg-gray-100 text-gray-700'
}

/**
 * 根据投递结果返回对应的 Tailwind 颜色类名
 * @param result - 投递结果
 * @returns Tailwind CSS 类名字符串
 * @example
 * getResultStatusColor('offer') // 'bg-green-500 text-white'
 * getResultStatusColor('流程中') // 'bg-sky-400 text-white'
 */
export function getResultStatusColor(result: ApplicationResult): string {
  const colorMap: Record<ApplicationResult, string> = {
    offer: 'bg-green-500 text-white',
    流程中: 'bg-sky-400 text-white',
    待投递: 'bg-gray-400 text-white',
    简历挂: 'bg-red-500 text-white',
    笔试挂: 'bg-red-500 text-white',
    面试挂: 'bg-red-500 text-white',
  }
  return colorMap[result] || 'bg-gray-400 text-white'
}

/**
 * 根据岗位类型返回对应的 Tailwind 颜色类名
 * @param jobType - 岗位类型
 * @returns Tailwind CSS 类名字符串
 */
export function getJobTypeColor(jobType: string): string {
  const colorMap: Record<string, string> = {
    日常实习: 'bg-orange-50 text-orange-600',
    暑期实习: 'bg-cyan-50 text-cyan-600',
    校招: 'bg-indigo-50 text-indigo-600',
  }
  return colorMap[jobType] || 'bg-gray-50 text-gray-600'
}
