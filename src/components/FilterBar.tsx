import type { ReactElement } from 'react'
import { ArrowUp, ArrowDown } from 'lucide-react'
import { useApplicationStore } from '../store/applicationStore'
import type { CompanyLevel } from '../lib/types'

const COMPANY_LEVELS: CompanyLevel[] = ['大厂', '中厂', '小厂', '国企', '外企']

export default function FilterBar(): ReactElement {
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
    <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg shadow mb-4">
      {/* 公司级别筛选 */}
      <div className="flex items-center gap-2">
        <label
          htmlFor="companyLevel"
          className="text-sm font-medium text-gray-700"
        >
          公司级别
        </label>
        <select
          id="companyLevel"
          value={filterByCompanyLevel ?? ''}
          onChange={handleCompanyLevelChange}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">全部</option>
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
        <span className="text-sm font-medium text-gray-700">仅显示流程中</span>
      </label>

      {/* 排序按钮 */}
      <button
        onClick={handleSortToggle}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
      >
        {sortOrder === 'asc' ? (
          <>
            <ArrowUp size={16} />
            投递时间升序
          </>
        ) : (
          <>
            <ArrowDown size={16} />
            投递时间降序
          </>
        )}
      </button>
    </div>
  )
}
