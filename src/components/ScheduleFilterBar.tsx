// filepath: /Users/raven/code/Apply_Record/ApplyLog/src/components/ScheduleFilterBar.tsx
import type { ReactElement } from 'react'
import { ArrowUpDown, Filter } from 'lucide-react'
import { useScheduleStore } from '../store/scheduleStore'

interface ScheduleFilterBarProps {
  onAddClick: () => void
}

export default function ScheduleFilterBar({
  onAddClick,
}: ScheduleFilterBarProps): ReactElement {
  const {
    showOnlyIncomplete,
    sortOrder,
    setShowOnlyIncomplete,
    toggleSortOrder,
  } = useScheduleStore()

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-white rounded-lg shadow mb-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* 按时间排序按钮 */}
        <button
          onClick={toggleSortOrder}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowUpDown size={16} />
          <span className="hidden sm:inline">按时间</span>排序
          <span className="text-xs text-gray-500">
            ({sortOrder === 'asc' ? '升' : '降'})
          </span>
        </button>

        {/* 仅显示未完成按钮 */}
        <button
          onClick={() => setShowOnlyIncomplete(!showOnlyIncomplete)}
          className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
            showOnlyIncomplete
              ? 'bg-blue-50 text-blue-600 border-blue-300'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Filter size={16} />
          <span className="hidden sm:inline">仅显示</span>未完成
        </button>
      </div>

      {/* 新增日程按钮 */}
      <button
        onClick={onAddClick}
        className="flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
      >
        <span className="text-lg leading-none">+</span>
        新增日程
      </button>
    </div>
  )
}
