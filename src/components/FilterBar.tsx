import type { ReactElement } from 'react'
import { ArrowUp, ArrowDown } from 'lucide-react'
import { useApplicationStore } from '../store/applicationStore'
import type { CompanyLevel } from '../lib/types'

const COMPANY_LEVELS: CompanyLevel[] = ['大厂', '中厂', '小厂', '国企', '外企']

interface FilterBarProps {
  onAddClick: () => void
}

export default function FilterBar({
  onAddClick,
}: FilterBarProps): ReactElement {
  const {
    filterByCompanyLevel,
    filterByInProgress,
    sortOrder,
    setFilterByCompanyLevel,
    setFilterByInProgress,
    setSortOrder,
  } = useApplicationStore()

  const handleCompanyLevelChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = e.target.value
    setFilterByCompanyLevel(value === '' ? null : (value as CompanyLevel))
  }

  const handleInProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterByInProgress(e.target.checked)
  }

  const handleSortToggle = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-white rounded-lg shadow mb-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* 公司级别筛选 */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="companyLevel"
            className="text-sm font-medium text-gray-700 hidden sm:inline"
          >
            公司级别
          </label>
          <select
            id="companyLevel"
            value={filterByCompanyLevel ?? ''}
            onChange={handleCompanyLevelChange}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">全部级别</option>
            {COMPANY_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        {/* 流程中筛选 */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filterByInProgress}
            onChange={handleInProgressChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">
            <span className="hidden sm:inline">仅显示</span>流程中
          </span>
        </label>

        {/* 排序按钮 */}
        <button
          onClick={handleSortToggle}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          {sortOrder === 'asc' ? (
            <>
              <ArrowUp size={16} />
              <span className="hidden sm:inline">投递时间</span>升序
            </>
          ) : (
            <>
              <ArrowDown size={16} />
              <span className="hidden sm:inline">投递时间</span>降序
            </>
          )}
        </button>
      </div>

      {/* 新增投递按钮 */}
      <button
        onClick={onAddClick}
        className="flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
      >
        <span className="text-lg leading-none">+</span>
        新增投递
      </button>
    </div>
  )
}
