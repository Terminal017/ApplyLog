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
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-lg shadow mb-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* 按时间排序按钮 */}
        <button
          onClick={toggleSortOrder}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowUpDown size={16} />
          按时间排序
          <span className="text-xs text-gray-500">
            ({sortOrder === 'asc' ? '升序' : '降序'})
          </span>
        </button>

        {/* 仅显示未完成按钮 */}
        <button
          onClick={() => setShowOnlyIncomplete(!showOnlyIncomplete)}
          className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
            showOnlyIncomplete
              ? 'bg-blue-50 text-blue-600 border-blue-300'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Filter size={16} />
          仅显示未完成
        </button>
      </div>

      {/* 新增日程按钮 */}
      <button
        onClick={onAddClick}
        className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <span className="text-lg leading-none">+</span>
        新增日程
      </button>
    </div>
  )
}
