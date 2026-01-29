// filepath: /Users/raven/code/Apply_Record/ApplyLog/src/components/ScheduleRow.tsx
import { useState, useEffect, useCallback, type ReactElement } from 'react'
import { Check } from 'lucide-react'
import type { Schedule } from '../lib/types'
import { cn, formatDate } from '../lib/utils'
import { isToday, isTomorrow } from '../store/scheduleStore'

interface ScheduleRowProps {
  schedule: Schedule
  onEdit: (schedule: Schedule) => void
  onDelete: (id: string) => void
  onToggleComplete: (id: string) => void
}

interface ContextMenuPosition {
  x: number
  y: number
}

// 获取星期几
function getWeekDay(dateStr: string): string {
  const weekDays = [
    '星期日',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六',
  ]
  const date = new Date(dateStr)
  return weekDays[date.getDay()]
}

// 获取日期高亮样式
function getDateHighlightClass(dateStr: string): string {
  if (isToday(dateStr)) {
    return 'bg-orange-50 border-l-4 border-l-orange-400'
  }
  if (isTomorrow(dateStr)) {
    return 'bg-blue-50 border-l-4 border-l-blue-400'
  }
  return ''
}

export default function ScheduleRow({
  schedule,
  onEdit,
  onDelete,
  onToggleComplete,
}: ScheduleRowProps): ReactElement {
  const [contextMenu, setContextMenu] = useState<ContextMenuPosition | null>(
    null,
  )

  // 处理右键菜单
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const x = Math.min(e.clientX, window.innerWidth - 120)
    const y = Math.min(e.clientY, window.innerHeight - 50)
    setContextMenu({ x, y })
  }

  // 关闭右键菜单
  const closeContextMenu = useCallback(() => {
    setContextMenu(null)
  }, [])

  // 处理删除点击
  const handleDeleteClick = () => {
    closeContextMenu()
    onDelete(schedule.id)
  }

  // 处理行点击（编辑）
  const handleRowClick = (e: React.MouseEvent) => {
    // 如果点击的是复选框区域，不触发编辑
    if ((e.target as HTMLElement).closest('.checkbox-area')) {
      return
    }
    onEdit(schedule)
  }

  // 处理复选框点击
  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleComplete(schedule.id)
  }

  // 点击其他区域或按 ESC 关闭菜单
  useEffect(() => {
    if (!contextMenu) return

    const handleClick = () => closeContextMenu()
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeContextMenu()
    }

    document.addEventListener('click', handleClick)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [contextMenu, closeContextMenu])

  const highlightClass = getDateHighlightClass(schedule.date)

  return (
    <>
      <tr
        className={cn(
          'border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors',
          highlightClass,
          schedule.completed && 'opacity-60',
        )}
        onClick={handleRowClick}
        onContextMenu={handleContextMenu}
      >
        {/* 日期列 */}
        <td className="py-4 px-3 w-54">
          <div className="flex flex-col">
            <span
              className={cn(
                'font-medium text-sm',
                schedule.completed && 'line-through text-gray-400',
              )}
            >
              {formatDate(schedule.date)}
            </span>
            <span className="text-xs text-gray-500">
              {getWeekDay(schedule.date)}
            </span>
          </div>
        </td>

        {/* 时间列 */}
        <td className="py-4 px-3 w-48">
          <span
            className={cn(
              'text-blue-600 font-medium',
              schedule.completed && 'line-through text-gray-400',
            )}
          >
            {schedule.time}
          </span>
        </td>

        {/* 日程内容列 */}
        <td className="py-4 px-4">
          <div className="flex flex-col">
            <span
              className={cn(
                'font-medium',
                schedule.completed && 'line-through text-gray-400',
              )}
            >
              {schedule.title}
            </span>
            {schedule.description && (
              <span
                className={cn(
                  'text-sm text-gray-500',
                  schedule.completed && 'line-through',
                )}
              >
                {schedule.description}
              </span>
            )}
          </div>
        </td>

        {/* 状态列 */}
        <td className="py-4 px-3 w-16">
          <div
            className="checkbox-area flex justify-center"
            onClick={handleCheckboxClick}
          >
            <div
              className={cn(
                'w-5.5 h-5.5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors',
                schedule.completed
                  ? 'bg-blue-600 border-blue-600'
                  : 'border-gray-300 hover:border-blue-400',
              )}
            >
              {schedule.completed && <Check size={14} className="text-white" />}
            </div>
          </div>
        </td>
      </tr>

      {/* 右键菜单 */}
      {contextMenu && (
        <div
          className="fixed bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            onClick={handleDeleteClick}
            className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
          >
            删除日程
          </button>
        </div>
      )}
    </>
  )
}
